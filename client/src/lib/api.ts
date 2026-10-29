/**
 * API Client Utility
 *
 * One place for the browser's REST calls. The pages call namespaced
 * methods (`api.posts.getAll`, `api.friends.accept`, ...), while the
 * legacy Express routes answer with envelopes such as
 * `{ success, posts }` or `{ success, cart: { items } }`. The facade
 * unwraps those envelopes and normalizes each row to the model the
 * page renders.
 *
 * The REST routes live in `server/routes` and are not mounted by the
 * live tRPC entry (`server/_core/index.ts`). Until they are, these
 * calls only work when the REST server is running against a database.
 * That split is recorded in `build.yaml`; it is not hidden here.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// ============================================
// Envelope and request plumbing
// ============================================

interface ApiEnvelope {
  success?: boolean;
  message?: string;
  error?: string;
}

type QueryValue = string | number | boolean | undefined | null;

function queryString(params?: Record<string, QueryValue>): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const serialized = search.toString();
  return serialized ? `?${serialized}` : "";
}

function authHeaders(): Record<string, string> {
  if (typeof localStorage === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const text = await response.text();
      const data = text ? (JSON.parse(text) as T & ApiEnvelope) : undefined;

      if (!response.ok || data?.success === false) {
        const message =
          data?.message || data?.error || `HTTP error! status: ${response.status}`;
        throw new Error(message);
      }

      return data as T;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data === undefined ? undefined : JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data === undefined ? undefined : JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // ============================================
  // Posts
  // ============================================

  readonly posts = {
    getAll: async (
      params: { limit?: number; page?: number; userId?: number } = {}
    ): Promise<FeedPost[]> => {
      const data = await this.request<{ posts: RawPost[] }>(
        `/posts${queryString(params)}`
      );
      return (data.posts ?? []).map(normalizePost);
    },

    create: async (input: {
      content: string;
      media?: string[];
    }): Promise<FeedPost> => {
      const data = await this.request<{ post: RawPost }>("/posts", {
        method: "POST",
        body: JSON.stringify(input),
      });
      return normalizePost(data.post);
    },

    like: async (postId: number): Promise<void> => {
      await this.request(`/posts/${postId}/like`, { method: "POST" });
    },
  };

  // ============================================
  // Friends
  // ============================================

  readonly friends = {
    /**
     * The page shows accepted friends and pending requests in one list
     * and filters by status. The REST endpoint defaults to
     * `status=accepted`, so fetch both sets explicitly.
     */
    getAll: async (): Promise<FriendEntry[]> => {
      const [accepted, pending] = await Promise.all([
        this.request<{ friends: RawFriend[] }>("/friends?status=accepted"),
        this.request<{ friends: RawFriend[] }>("/friends?status=pending"),
      ]);
      return [...(accepted.friends ?? []), ...(pending.friends ?? [])].map(
        normalizeFriend
      );
    },

    accept: async (friendshipId: number): Promise<void> => {
      await this.request(`/friends/requests/${friendshipId}/accept`, {
        method: "POST",
      });
    },

    reject: async (friendshipId: number): Promise<void> => {
      await this.request(`/friends/requests/${friendshipId}/decline`, {
        method: "POST",
      });
    },

    /**
     * The legacy REST router has no `DELETE /friends/:id` route. Throw
     * instead of pretending the removal succeeded.
     */
    remove: async (_friendshipId: number): Promise<void> => {
      throw new Error(
        "Removing a friend is not implemented by the REST API (no DELETE /friends/:id route)."
      );
    },
  };

  // ============================================
  // Groups
  // ============================================

  readonly groups = {
    getAll: async (params: {
      search?: string;
      category?: string;
      page?: number;
      limit?: number;
    } = {}): Promise<GroupEntry[]> => {
      const data = await this.request<{ groups: RawGroup[] }>(
        `/groups${queryString({
          q: params.search,
          category: params.category,
          page: params.page,
          limit: params.limit,
        })}`
      );
      return (data.groups ?? []).map(normalizeGroup);
    },

    join: async (groupId: number): Promise<void> => {
      await this.request(`/groups/${groupId}/join`, { method: "POST" });
    },
  };

  // ============================================
  // Jobs
  // ============================================

  readonly jobs = {
    getAll: async (params: {
      search?: string;
      category?: string;
      location?: string;
      type?: string;
      page?: number;
      limit?: number;
    } = {}): Promise<JobEntry[]> => {
      const data = await this.request<{ jobs: RawJob[] }>(
        `/jobs${queryString({
          q: params.search,
          category: params.category,
          location: params.location,
          jobType: params.type,
          page: params.page,
          limit: params.limit,
        })}`
      );
      return (data.jobs ?? []).map(normalizeJob);
    },

    apply: async (
      jobId: number,
      data: { coverLetter?: string; resumeUrl?: string }
    ): Promise<void> => {
      await this.request(`/jobs/${jobId}/apply`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  };

  // ============================================
  // Courses
  // ============================================

  readonly courses = {
    getAll: async (params: {
      search?: string;
      category?: string;
      level?: string;
      page?: number;
      limit?: number;
    } = {}): Promise<CourseEntry[]> => {
      const data = await this.request<{ courses: RawCourse[] }>(
        `/courses${queryString({
          q: params.search,
          category: params.category,
          level: params.level,
          page: params.page,
          limit: params.limit,
        })}`
      );
      return (data.courses ?? []).map(normalizeCourse);
    },

    enroll: async (courseId: number): Promise<void> => {
      await this.request(`/courses/${courseId}/enroll`, { method: "POST" });
    },
  };

  // ============================================
  // Products and cart
  // ============================================

  readonly products = {
    getAll: async (params: {
      search?: string;
      category?: string;
      page?: number;
      limit?: number;
    } = {}): Promise<ProductEntry[]> => {
      const data = await this.request<{ products: RawProduct[] }>(
        `/products${queryString({
          q: params.search,
          category: params.category,
          page: params.page,
          limit: params.limit,
        })}`
      );
      return (data.products ?? []).map(normalizeProduct);
    },
  };

  readonly cart = {
    get: async (): Promise<Cart> => {
      const data = await this.request<{ cart: Cart }>("/cart");
      return data.cart;
    },

    addItem: async (input: {
      productId: number;
      quantity: number;
    }): Promise<void> => {
      await this.request("/cart", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
  };

  // ============================================
  // Messages
  // ============================================

  readonly messages = {
    getConversations: async (): Promise<Conversation[]> => {
      const data = await this.request<{ conversations: RawConversation[] }>(
        "/messages"
      );
      return (data.conversations ?? []).map(normalizeConversation);
    },

    /**
     * The route returns only `isSentByMe`; reconstruct sender and
     * receiver from the current user and the selected peer so the page
     * can keep rendering its existing bubble alignment.
     */
    getMessages: async (
      userId: number,
      currentUserId: number,
      page = 1
    ): Promise<MessageEntry[]> => {
      const data = await this.request<{ messages: RawMessage[] }>(
        `/messages/${userId}${queryString({ page })}`
      );
      return (data.messages ?? []).map(message => ({
        id: message.id,
        senderId: message.isSentByMe ? currentUserId : userId,
        receiverId: message.isSentByMe ? userId : currentUserId,
        content: message.content,
        read: message.isRead,
        createdAt: message.createdAt,
      }));
    },

    send: async (input: {
      receiverId?: number;
      groupId?: number;
      content: string;
      media?: string;
    }): Promise<void> => {
      await this.request("/messages", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
  };

  // ============================================
  // Users
  // ============================================

  readonly users = {
    getById: async (userId: number): Promise<ProfileUser> => {
      const data = await this.request<{ user: RawUser }>(`/users/${userId}`);
      return normalizeUser(data.user);
    },

    /**
     * The profile route persists displayName, bio, avatar and cover
     * photo. The page also sends email, location and website, which the
     * users table has no columns for; warn instead of pretending they
     * were saved.
     */
    update: async (
      userId: number,
      data: {
        fullName?: string;
        email?: string;
        bio?: string;
        location?: string;
        website?: string;
      }
    ): Promise<ProfileUser> => {
      const unsupported = (["email", "location", "website"] as const).filter(
        key => data[key] !== undefined
      );
      if (unsupported.length > 0) {
        console.warn(
          `[api.users.update] The profile endpoint does not persist: ${unsupported.join(
            ", "
          )}`
        );
      }

      const body: Record<string, string> = {};
      if (data.fullName !== undefined) body.displayName = data.fullName;
      if (data.bio !== undefined) body.bio = data.bio;

      const response = await this.request<{ user: RawUser }>(
        `/users/${userId}`,
        { method: "PUT", body: JSON.stringify(body) }
      );
      return normalizeUser(response.user);
    },
  };

  // ============================================
  // Admin (kept for the Admin page)
  // ============================================

  readonly admin = {
    getStats: () => this.get("/admin/stats"),
    getUsers: (params: string) => this.get(`/admin/users?${params}`),
    updateUser: (id: number, data: unknown) =>
      this.put(`/admin/users/${id}`, data),
    deleteUser: (id: number) => this.delete(`/admin/users/${id}`),
    getPosts: (params: string) => this.get(`/admin/posts?${params}`),
    deletePost: (id: number) => this.delete(`/admin/posts/${id}`),
    getOrders: (params: string) => this.get(`/admin/orders?${params}`),
    updateOrder: (id: number, data: unknown) =>
      this.put(`/admin/orders/${id}`, data),
    getAnalytics: (params: string) => this.get(`/admin/analytics?${params}`),
  };
}

// ============================================
// Page models
// ============================================

export interface FeedPost {
  id: number;
  userId: number;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
  liked: boolean;
  user?: {
    id: number;
    fullName: string;
    email: string;
  };
}

export interface FriendEntry {
  id: number;
  status: string;
  createdAt: string;
  friend: {
    id: number;
    fullName: string;
    email: string;
  };
}

export interface GroupEntry {
  id: number;
  name: string;
  description: string;
  privacy: string;
  memberCount: number;
  createdAt: string;
}

export interface JobEntry {
  id: number;
  companyId: number;
  title: string;
  description: string;
  location: string;
  type: string;
  salary: string;
  requirements: string[];
  benefits: string[];
  createdAt: string;
  company: {
    name: string;
    logo: string;
  };
}

export interface CourseEntry {
  id: number;
  instructorId: number;
  title: string;
  description: string;
  category: string;
  level: string;
  price: string;
  duration: number;
  thumbnail: string;
  rating: string;
  enrollmentCount: number;
  createdAt: string;
}

export interface ProductEntry {
  id: number;
  sellerId: number;
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  stock: number;
  images: string[];
  rating: string;
  reviewCount: number;
  createdAt: string;
}

export interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    title: string;
    price: number;
    currency: string;
    images: string[];
    stock: number;
    seller: { id: number; name: string };
  };
  itemTotal: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface Conversation {
  userId: number;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface MessageEntry {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface ProfileUser {
  id: number;
  email: string;
  fullName: string;
  bio?: string;
  location?: string;
  website?: string;
  createdAt: string;
}

// ============================================
// Raw REST rows
// ============================================

interface RawPost {
  id: number;
  content: string;
  media?: unknown;
  createdAt: string;
  author?: {
    id: number;
    username?: string | null;
    name?: string | null;
  };
  authorId?: number;
  authorUsername?: string | null;
  authorName?: string | null;
  likes?: number;
  comments?: number;
  shares?: number;
  isLiked?: boolean;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
}

interface RawFriend {
  friendshipId: number;
  userId: number;
  username?: string | null;
  name?: string | null;
  status: string;
  createdAt: string;
}

interface RawGroup {
  id: number;
  name: string;
  description: string;
  privacy: string;
  membersCount: number;
  createdAt: string;
}

interface RawJob {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: string;
  jobType: string;
  createdAt: string;
  employerId: number;
  employerName?: string | null;
  employerAvatar?: string | null;
}

interface RawCourse {
  id: number;
  title: string;
  description: string;
  thumbnail?: string | null;
  price: number;
  category: string;
  level: string;
  enrollmentsCount: number;
  rating: number;
  createdAt: string;
  instructor: {
    id: number;
    name?: string | null;
  };
}

interface RawProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  images?: string[] | null;
  category: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  seller: {
    id: number;
    name?: string | null;
  };
}

interface RawConversation {
  user: {
    id: number;
    name?: string | null;
    email?: string | null;
  };
  lastMessage: {
    content: string;
    isRead: boolean;
    isSentByMe: boolean;
    createdAt: string;
  };
}

interface RawMessage {
  id: number;
  content: string;
  isRead: boolean;
  isSentByMe: boolean;
  createdAt: string;
}

interface RawUser {
  id: number;
  email?: string | null;
  username?: string | null;
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  joinedAt?: string;
  createdAt?: string;
}

// ============================================
// Normalizers
// ============================================

function firstMedia(media: unknown): string | undefined {
  if (Array.isArray(media)) {
    return typeof media[0] === "string" ? media[0] : undefined;
  }
  if (typeof media === "string" && media.trim() !== "") {
    try {
      const parsed: unknown = JSON.parse(media);
      if (Array.isArray(parsed)) {
        return typeof parsed[0] === "string" ? parsed[0] : undefined;
      }
    } catch {
      return media;
    }
  }
  return undefined;
}

function normalizePost(post: RawPost): FeedPost {
  const authorId = post.author?.id ?? post.authorId ?? 0;
  const authorName = post.author?.name ?? post.authorName ?? "";
  const authorUsername = post.author?.username ?? post.authorUsername ?? "";

  return {
    id: post.id,
    userId: authorId,
    content: post.content,
    mediaUrl: firstMedia(post.media),
    likesCount: post.likes ?? post.likesCount ?? 0,
    commentsCount: post.comments ?? post.commentsCount ?? 0,
    sharesCount: post.shares ?? post.sharesCount ?? 0,
    createdAt: post.createdAt,
    liked: post.isLiked ?? false,
    user:
      authorId > 0
        ? {
            id: authorId,
            fullName: authorName || authorUsername,
            email: "",
          }
        : undefined,
  };
}

function normalizeFriend(friend: RawFriend): FriendEntry {
  return {
    id: friend.friendshipId,
    status: friend.status,
    createdAt: friend.createdAt,
    friend: {
      id: friend.userId,
      fullName: friend.name ?? friend.username ?? "",
      // The friends query does not select users.email.
      email: "",
    },
  };
}

function normalizeGroup(group: RawGroup): GroupEntry {
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    privacy: group.privacy,
    memberCount: group.membersCount,
    createdAt: group.createdAt,
  };
}

function normalizeJob(job: RawJob): JobEntry {
  return {
    id: job.id,
    companyId: job.employerId,
    title: job.title,
    description: job.description,
    location: job.location,
    type: job.jobType,
    salary: job.salary,
    // The list query does not select requirements or benefits.
    requirements: [],
    benefits: [],
    createdAt: job.createdAt,
    company: {
      name: job.employerName ?? "",
      logo: job.employerAvatar ?? "",
    },
  };
}

function normalizeCourse(course: RawCourse): CourseEntry {
  return {
    id: course.id,
    instructorId: course.instructor.id,
    title: course.title,
    description: course.description,
    category: course.category,
    level: course.level,
    price: String(course.price),
    // The list query does not select a duration.
    duration: 0,
    thumbnail: course.thumbnail ?? "",
    rating: String(course.rating),
    enrollmentCount: course.enrollmentsCount,
    createdAt: course.createdAt,
  };
}

function normalizeProduct(product: RawProduct): ProductEntry {
  return {
    id: product.id,
    sellerId: product.seller.id,
    title: product.title,
    description: product.description,
    price: String(product.price),
    category: product.category,
    // The list query does not select a condition.
    condition: "",
    stock: product.stock,
    images: product.images ?? [],
    rating: String(product.rating),
    reviewCount: product.reviewsCount,
    createdAt: product.createdAt,
  };
}

function normalizeConversation(
  conversation: RawConversation
): Conversation {
  const lastMessage = conversation.lastMessage;
  return {
    userId: conversation.user.id,
    userName: conversation.user.name ?? "Unknown User",
    userEmail: conversation.user.email ?? "",
    lastMessage: lastMessage.content,
    lastMessageTime: lastMessage.createdAt,
    unreadCount:
      lastMessage.isRead || lastMessage.isSentByMe ? 0 : 1,
  };
}

function normalizeUser(user: RawUser): ProfileUser {
  const name =
    user.displayName ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    "";

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: name,
    bio: user.bio ?? undefined,
    createdAt: user.joinedAt ?? user.createdAt ?? "",
  };
}

export const api = new ApiClient(API_BASE_URL);

// ============================================
// Flat wrappers kept for existing imports
// ============================================

export const usersApi = {
  getProfile: (userId: number) => api.users.getById(userId),
  updateProfile: (userId: number, data: Record<string, string>) =>
    api.users.update(userId, data),
  searchUsers: (query: string) => api.get(`/users/search?q=${query}`),
};

export const postsApi = {
  getFeed: (page = 1, limit = 20) => api.posts.getAll({ page, limit }),
  getPost: (postId: number) => api.get(`/posts/${postId}`),
  createPost: (data: { content: string; media?: string[] }) =>
    api.posts.create(data),
  updatePost: (postId: number, data: unknown) =>
    api.put(`/posts/${postId}`, data),
  deletePost: (postId: number) => api.delete(`/posts/${postId}`),
  likePost: (postId: number) => api.posts.like(postId),
  unlikePost: (postId: number) => api.delete(`/posts/${postId}/like`),
};

export const commentsApi = {
  getComments: (postId: number, page = 1) =>
    api.get(`/comments?postId=${postId}&page=${page}`),
  createComment: (data: {
    postId: number;
    content: string;
    parentId?: number;
  }) => api.post("/comments", data),
  deleteComment: (commentId: number) => api.delete(`/comments/${commentId}`),
};

export const friendsApi = {
  getFriends: (page = 1) => api.get(`/friends?page=${page}`),
  getFriendRequests: () => api.get("/friends/requests"),
  sendFriendRequest: (userId: number) => api.post(`/friends/request/${userId}`),
  acceptFriendRequest: (userId: number) => api.friends.accept(userId),
  rejectFriendRequest: (userId: number) => api.friends.reject(userId),
  removeFriend: (userId: number) => api.friends.remove(userId),
};

export const productsApi = {
  getProducts: (params?: {
    q?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) => api.products.getAll(params),
  getProduct: (productId: number) => api.get(`/products/${productId}`),
  createProduct: (data: unknown) => api.post("/products", data),
  updateProduct: (productId: number, data: unknown) =>
    api.put(`/products/${productId}`, data),
  deleteProduct: (productId: number) => api.delete(`/products/${productId}`),
  getReviews: (productId: number, page = 1) =>
    api.get(`/products/${productId}/reviews?page=${page}`),
  createReview: (
    productId: number,
    data: { rating: number; comment: string }
  ) => api.post(`/products/${productId}/reviews`, data),
};

export const cartApi = {
  getCart: () => api.cart.get(),
  addToCart: (productId: number, quantity: number) =>
    api.cart.addItem({ productId, quantity }),
  updateCartItem: (itemId: number, quantity: number) =>
    api.put(`/cart/${itemId}`, { quantity }),
  removeFromCart: (itemId: number) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete("/cart"),
};

export const ordersApi = {
  getOrders: (page = 1) => api.get(`/orders?page=${page}`),
  getOrder: (orderId: number) => api.get(`/orders/${orderId}`),
  createOrder: (data: {
    items: unknown[];
    shippingAddress: string;
    paymentMethod: string;
  }) => api.post("/orders", data),
  updateOrderStatus: (orderId: number, status: string) =>
    api.put(`/orders/${orderId}/status`, { status }),
};

export const coursesApi = {
  getCourses: (params?: {
    q?: string;
    category?: string;
    level?: string;
    page?: number;
  }) => api.courses.getAll(params),
  getCourse: (courseId: number) => api.get(`/courses/${courseId}`),
  createCourse: (data: unknown) => api.post("/courses", data),
  updateCourse: (courseId: number, data: unknown) =>
    api.put(`/courses/${courseId}`, data),
  deleteCourse: (courseId: number) => api.delete(`/courses/${courseId}`),
  enrollCourse: (courseId: number) => api.courses.enroll(courseId),
  getReviews: (courseId: number, page = 1) =>
    api.get(`/courses/${courseId}/reviews?page=${page}`),
};

export const jobsApi = {
  getJobs: (params?: {
    q?: string;
    category?: string;
    location?: string;
    page?: number;
  }) => api.jobs.getAll(params),
  getJob: (jobId: number) => api.get(`/jobs/${jobId}`),
  createJob: (data: unknown) => api.post("/jobs", data),
  updateJob: (jobId: number, data: unknown) =>
    api.put(`/jobs/${jobId}`, data),
  deleteJob: (jobId: number) => api.delete(`/jobs/${jobId}`),
  applyToJob: (
    jobId: number,
    data: { coverLetter?: string; resumeUrl?: string }
  ) => api.jobs.apply(jobId, data),
  getApplications: (jobId: number, page = 1) =>
    api.get(`/jobs/${jobId}/applications?page=${page}`),
};

export const messagesApi = {
  getConversations: () => api.messages.getConversations(),
  getMessages: (userId: number, page = 1) =>
    api.get(`/messages/${userId}?page=${page}`),
  sendMessage: (data: {
    receiverId?: number;
    groupId?: number;
    content: string;
    media?: string;
  }) => api.messages.send(data),
  deleteMessage: (messageId: number) => api.delete(`/messages/${messageId}`),
  markAsRead: (senderId: number) =>
    api.put("/messages/read", { senderId }),
};

export const adminApi = api.admin;

export const groupsApi = {
  getGroups: (params?: {
    q?: string;
    category?: string;
    page?: number;
  }) => api.groups.getAll(params),
  getGroup: (groupId: number) => api.get(`/groups/${groupId}`),
  createGroup: (data: unknown) => api.post("/groups", data),
  updateGroup: (groupId: number, data: unknown) =>
    api.put(`/groups/${groupId}`, data),
  deleteGroup: (groupId: number) => api.delete(`/groups/${groupId}`),
  joinGroup: (groupId: number) => api.groups.join(groupId),
  leaveGroup: (groupId: number) => api.post(`/groups/${groupId}/leave`),
  getMembers: (groupId: number, page = 1) =>
    api.get(`/groups/${groupId}/members?page=${page}`),
};

export default api;
