/**
 * API Client Utility
 * Centralized API communication with error handling and type safety
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
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
        ...options.headers,
      },
    };

    // TODO: Add JWT token from auth context
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers = {
    //     ...config.headers,
    //     Authorization: `Bearer ${token}`,
    //   };
    // }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiClient(API_BASE_URL);

// ============================================
// API Endpoints - Type-safe wrappers
// ============================================

// Users API
export const usersApi = {
  getProfile: (userId: number) => api.get(`/users/${userId}`),
  updateProfile: (userId: number, data: any) => api.put(`/users/${userId}`, data),
  searchUsers: (query: string) => api.get(`/users/search?q=${query}`),
};

// Posts API
export const postsApi = {
  getFeed: (page = 1, limit = 20) => api.get(`/posts?page=${page}&limit=${limit}`),
  getPost: (postId: number) => api.get(`/posts/${postId}`),
  createPost: (data: { content: string; media?: string[] }) => api.post("/posts", data),
  updatePost: (postId: number, data: any) => api.put(`/posts/${postId}`, data),
  deletePost: (postId: number) => api.delete(`/posts/${postId}`),
  likePost: (postId: number) => api.post(`/posts/${postId}/like`),
  unlikePost: (postId: number) => api.delete(`/posts/${postId}/like`),
};

// Comments API
export const commentsApi = {
  getComments: (postId: number, page = 1) => 
    api.get(`/comments?postId=${postId}&page=${page}`),
  createComment: (data: { postId: number; content: string; parentId?: number }) => 
    api.post("/comments", data),
  deleteComment: (commentId: number) => api.delete(`/comments/${commentId}`),
};

// Friends API
export const friendsApi = {
  getFriends: (page = 1) => api.get(`/friends?page=${page}`),
  getFriendRequests: () => api.get("/friends/requests"),
  sendFriendRequest: (userId: number) => api.post(`/friends/request/${userId}`),
  acceptFriendRequest: (userId: number) => api.post(`/friends/accept/${userId}`),
  rejectFriendRequest: (userId: number) => api.post(`/friends/reject/${userId}`),
  removeFriend: (userId: number) => api.delete(`/friends/${userId}`),
};

// Products API
export const productsApi = {
  getProducts: (params?: { q?: string; category?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return api.get(`/products?${query}`);
  },
  getProduct: (productId: number) => api.get(`/products/${productId}`),
  createProduct: (data: any) => api.post("/products", data),
  updateProduct: (productId: number, data: any) => api.put(`/products/${productId}`, data),
  deleteProduct: (productId: number) => api.delete(`/products/${productId}`),
  getReviews: (productId: number, page = 1) => 
    api.get(`/products/${productId}/reviews?page=${page}`),
  createReview: (productId: number, data: { rating: number; comment: string }) => 
    api.post(`/products/${productId}/reviews`, data),
};

// Cart API
export const cartApi = {
  getCart: () => api.get("/cart"),
  addToCart: (productId: number, quantity: number) => 
    api.post("/cart", { productId, quantity }),
  updateCartItem: (itemId: number, quantity: number) => 
    api.put(`/cart/${itemId}`, { quantity }),
  removeFromCart: (itemId: number) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete("/cart"),
};

// Orders API
export const ordersApi = {
  getOrders: (page = 1) => api.get(`/orders?page=${page}`),
  getOrder: (orderId: number) => api.get(`/orders/${orderId}`),
  createOrder: (data: { items: any[]; shippingAddress: string; paymentMethod: string }) => 
    api.post("/orders", data),
  updateOrderStatus: (orderId: number, status: string) => 
    api.put(`/orders/${orderId}/status`, { status }),
};

// Courses API
export const coursesApi = {
  getCourses: (params?: { q?: string; category?: string; level?: string; page?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return api.get(`/courses?${query}`);
  },
  getCourse: (courseId: number) => api.get(`/courses/${courseId}`),
  createCourse: (data: any) => api.post("/courses", data),
  updateCourse: (courseId: number, data: any) => api.put(`/courses/${courseId}`, data),
  deleteCourse: (courseId: number) => api.delete(`/courses/${courseId}`),
  enrollCourse: (courseId: number) => api.post(`/courses/${courseId}/enroll`),
  getReviews: (courseId: number, page = 1) => 
    api.get(`/courses/${courseId}/reviews?page=${page}`),
};

// Jobs API
export const jobsApi = {
  getJobs: (params?: { q?: string; category?: string; location?: string; page?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return api.get(`/jobs?${query}`);
  },
  getJob: (jobId: number) => api.get(`/jobs/${jobId}`),
  createJob: (data: any) => api.post("/jobs", data),
  updateJob: (jobId: number, data: any) => api.put(`/jobs/${jobId}`, data),
  deleteJob: (jobId: number) => api.delete(`/jobs/${jobId}`),
  applyToJob: (jobId: number, data: { coverLetter?: string; resumeUrl?: string }) => 
    api.post(`/jobs/${jobId}/apply`, data),
  getApplications: (jobId: number, page = 1) => 
    api.get(`/jobs/${jobId}/applications?page=${page}`),
};

// Messages API
export const messagesApi = {
  getConversations: () => api.get("/messages"),
  getMessages: (userId: number, page = 1) => api.get(`/messages/${userId}?page=${page}`),
  sendMessage: (data: { receiverId?: number; groupId?: number; content: string; media?: string }) => 
    api.post("/messages", data),
  deleteMessage: (messageId: number) => api.delete(`/messages/${messageId}`),
  markAsRead: (senderId: number) => api.put("/messages/read", { senderId }),
};

// Groups API
export const groupsApi = {
  getGroups: (params?: { q?: string; category?: string; page?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return api.get(`/groups?${query}`);
  },
  getGroup: (groupId: number) => api.get(`/groups/${groupId}`),
  createGroup: (data: any) => api.post("/groups", data),
  updateGroup: (groupId: number, data: any) => api.put(`/groups/${groupId}`, data),
  deleteGroup: (groupId: number) => api.delete(`/groups/${groupId}`),
  joinGroup: (groupId: number) => api.post(`/groups/${groupId}/join`),
  leaveGroup: (groupId: number) => api.post(`/groups/${groupId}/leave`),
  getMembers: (groupId: number, page = 1) => api.get(`/groups/${groupId}/members?page=${page}`),
};

export default api;

