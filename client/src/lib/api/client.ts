/**
 * AETHERIAL Platform - API Client
 * 
 * Centralized API client for all frontend-backend communication
 * Handles authentication, error handling, loading states, and WebSocket connections
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { io, Socket } from 'socket.io-client';

// ============================================
// CONFIGURATION
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: any;
}

// ============================================
// API CLIENT CLASS
// ============================================

export class ApiClient {
  private axios: AxiosInstance;
  private socket: Socket | null = null;
  private authToken: string | null = null;

  constructor() {
    // Initialize Axios instance
    this.axios = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Setup interceptors
    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors() {
    // Request interceptor
    this.axios.interceptors.request.use(
      (config) => {
        // Add auth token to headers
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }

        // Add timestamp to prevent caching
        if (config.method === 'get') {
          config.params = {
            ...config.params,
            _t: Date.now(),
          };
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: AxiosError) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          this.clearAuth();
          window.location.href = '/login';
        }

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
          console.error('Access forbidden');
        }

        // Handle network errors
        if (!error.response) {
          console.error('Network error - server may be down');
        }

        return Promise.reject(this.formatError(error));
      }
    );
  }

  /**
   * Format error for consistent error handling
   */
  private formatError(error: AxiosError): ApiError {
    if (error.response) {
      return {
        message: (error.response.data as any)?.message || error.message,
        code: (error.response.data as any)?.code,
        status: error.response.status,
        details: error.response.data,
      };
    }

    return {
      message: error.message || 'An unknown error occurred',
      code: 'NETWORK_ERROR',
    };
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string) {
    this.authToken = token;
    localStorage.setItem('auth_token', token);
  }

  /**
   * Get authentication token
   */
  getAuthToken(): string | null {
    if (!this.authToken) {
      this.authToken = localStorage.getItem('auth_token');
    }
    return this.authToken;
  }

  /**
   * Clear authentication
   */
  clearAuth() {
    this.authToken = null;
    localStorage.removeItem('auth_token');
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Initialize WebSocket connection
   */
  connectWebSocket(): Socket {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    this.socket = io(WS_URL, {
      auth: {
        token: this.authToken,
      },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    return this.socket;
  }

  /**
   * Get WebSocket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  // ============================================
  // HTTP METHODS
  // ============================================

  /**
   * GET request
   */
  async get<T = any>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axios.get<ApiResponse<T>>(url, {
        params,
        ...config,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * POST request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axios.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * PUT request
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axios.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axios.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axios.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload file
   */
  async upload<T = any>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await this.axios.post<ApiResponse<T>>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Download file
   */
  async download(url: string, filename?: string): Promise<void> {
    try {
      const response = await this.axios.get(url, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      throw error;
    }
  }
}

// ============================================
// API ENDPOINTS
// ============================================

export class ApiEndpoints {
  constructor(private client: ApiClient) {}

  // AUTH
  auth = {
    login: (credentials: { email: string; password: string }) =>
      this.client.post('/auth/login', credentials),
    register: (data: any) => this.client.post('/auth/register', data),
    logout: () => this.client.post('/auth/logout'),
    refreshToken: () => this.client.post('/auth/refresh'),
    forgotPassword: (email: string) => this.client.post('/auth/forgot-password', { email }),
    resetPassword: (token: string, password: string) =>
      this.client.post('/auth/reset-password', { token, password }),
  };

  // USERS
  users = {
    getProfile: (userId?: string) =>
      this.client.get(userId ? `/users/${userId}` : '/users/me'),
    updateProfile: (data: any) => this.client.put('/users/me', data),
    uploadAvatar: (file: File) => this.client.upload('/users/me/avatar', file),
    getActivities: (userId: string, params?: PaginationParams) =>
      this.client.get(`/users/${userId}/activities`, params),
    getFriends: (userId: string, params?: PaginationParams) =>
      this.client.get(`/users/${userId}/friends`, params),
    sendFriendRequest: (userId: string) => this.client.post(`/users/${userId}/friend-request`),
  };

  // POSTS
  posts = {
    getAll: (params?: PaginationParams & FilterParams) => this.client.get('/posts', params),
    getById: (postId: string) => this.client.get(`/posts/${postId}`),
    create: (data: any) => this.client.post('/posts', data),
    update: (postId: string, data: any) => this.client.put(`/posts/${postId}`, data),
    delete: (postId: string) => this.client.delete(`/posts/${postId}`),
    like: (postId: string) => this.client.post(`/posts/${postId}/like`),
    unlike: (postId: string) => this.client.delete(`/posts/${postId}/like`),
    comment: (postId: string, content: string) =>
      this.client.post(`/posts/${postId}/comments`, { content }),
    share: (postId: string) => this.client.post(`/posts/${postId}/share`),
  };

  // GROUPS
  groups = {
    getAll: (params?: PaginationParams & FilterParams) => this.client.get('/groups', params),
    getById: (groupId: string) => this.client.get(`/groups/${groupId}`),
    create: (data: any) => this.client.post('/groups', data),
    update: (groupId: string, data: any) => this.client.put(`/groups/${groupId}`, data),
    delete: (groupId: string) => this.client.delete(`/groups/${groupId}`),
    join: (groupId: string) => this.client.post(`/groups/${groupId}/join`),
    leave: (groupId: string) => this.client.post(`/groups/${groupId}/leave`),
    getMembers: (groupId: string, params?: PaginationParams) =>
      this.client.get(`/groups/${groupId}/members`, params),
  };

  // MESSAGES
  messages = {
    getConversations: (params?: PaginationParams) => this.client.get('/messages/conversations', params),
    getMessages: (conversationId: string, params?: PaginationParams) =>
      this.client.get(`/messages/conversations/${conversationId}`, params),
    send: (conversationId: string, content: string, attachments?: string[]) =>
      this.client.post(`/messages/conversations/${conversationId}`, { content, attachments }),
    markAsRead: (conversationId: string) =>
      this.client.post(`/messages/conversations/${conversationId}/read`),
  };

  // COURSES
  courses = {
    getAll: (params?: PaginationParams & FilterParams) => this.client.get('/courses', params),
    getById: (courseId: string) => this.client.get(`/courses/${courseId}`),
    enroll: (courseId: string) => this.client.post(`/courses/${courseId}/enroll`),
    getProgress: (courseId: string) => this.client.get(`/courses/${courseId}/progress`),
    completeLesson: (courseId: string, lessonId: string) =>
      this.client.post(`/courses/${courseId}/lessons/${lessonId}/complete`),
  };

  // PRODUCTS
  products = {
    getAll: (params?: PaginationParams & FilterParams) => this.client.get('/products', params),
    getById: (productId: string) => this.client.get(`/products/${productId}`),
    addToCart: (productId: string, quantity: number) =>
      this.client.post('/cart/items', { productId, quantity }),
    getCart: () => this.client.get('/cart'),
    checkout: (data: any) => this.client.post('/orders', data),
  };

  // JOBS
  jobs = {
    getAll: (params?: PaginationParams & FilterParams) => this.client.get('/jobs', params),
    getById: (jobId: string) => this.client.get(`/jobs/${jobId}`),
    apply: (jobId: string, data: any) => this.client.post(`/jobs/${jobId}/apply`, data),
    getApplications: (params?: PaginationParams) => this.client.get('/jobs/applications', params),
  };

  // EVENTS
  events = {
    getAll: (params?: PaginationParams & FilterParams) => this.client.get('/events', params),
    getById: (eventId: string) => this.client.get(`/events/${eventId}`),
    rsvp: (eventId: string, status: 'going' | 'maybe' | 'not_going') =>
      this.client.post(`/events/${eventId}/rsvp`, { status }),
  };

  // BLOCKCHAIN
  blockchain = {
    getWallet: () => this.client.get('/blockchain/wallet'),
    getTransactions: (params?: PaginationParams) =>
      this.client.get('/blockchain/transactions', params),
    sendTransaction: (data: any) => this.client.post('/blockchain/transactions', data),
    getBlocks: (params?: PaginationParams) => this.client.get('/blockchain/blocks', params),
    getSmartContracts: (params?: PaginationParams) =>
      this.client.get('/blockchain/smart-contracts', params),
    deployContract: (data: any) => this.client.post('/blockchain/smart-contracts', data),
  };

  // NFT
  nft = {
    getAll: (params?: PaginationParams & FilterParams) => this.client.get('/nft', params),
    getById: (nftId: string) => this.client.get(`/nft/${nftId}`),
    mint: (data: any) => this.client.post('/nft/mint', data),
    buy: (nftId: string) => this.client.post(`/nft/${nftId}/buy`),
    sell: (nftId: string, price: number) => this.client.post(`/nft/${nftId}/sell`, { price }),
  };

  // DEFI
  defi = {
    getPortfolio: () => this.client.get('/defi/portfolio'),
    stake: (tokenId: string, amount: number) =>
      this.client.post('/defi/stake', { tokenId, amount }),
    unstake: (stakeId: string) => this.client.post(`/defi/unstake/${stakeId}`),
    addLiquidity: (data: any) => this.client.post('/defi/liquidity/add', data),
    removeLiquidity: (poolId: string) => this.client.post(`/defi/liquidity/remove/${poolId}`),
  };

  // AI
  ai = {
    chat: (messages: any[], model?: string) =>
      this.client.post('/ai/chat', { messages, model }),
    generateImage: (prompt: string, options?: any) =>
      this.client.post('/ai/image/generate', { prompt, ...options }),
    analyzeCode: (code: string, language: string) =>
      this.client.post('/ai/code/analyze', { code, language }),
    moderateContent: (content: string) =>
      this.client.post('/ai/moderate', { content }),
  };

  // ANALYTICS
  analytics = {
    getDashboard: () => this.client.get('/analytics/dashboard'),
    getUserMetrics: (params?: any) => this.client.get('/analytics/users', params),
    getRevenueMetrics: (params?: any) => this.client.get('/analytics/revenue', params),
    getEngagementMetrics: (params?: any) => this.client.get('/analytics/engagement', params),
  };

  // ADMIN
  admin = {
    getUsers: (params?: PaginationParams & FilterParams) =>
      this.client.get('/admin/users', params),
    updateUser: (userId: string, data: any) =>
      this.client.put(`/admin/users/${userId}`, data),
    deleteUser: (userId: string) => this.client.delete(`/admin/users/${userId}`),
    moderateContent: (contentId: string, action: string) =>
      this.client.post(`/admin/moderate/${contentId}`, { action }),
    getSystemSettings: () => this.client.get('/admin/settings'),
    updateSystemSettings: (data: any) => this.client.put('/admin/settings', data),
  };
}

// ============================================
// EXPORT SINGLETON
// ============================================

export const apiClient = new ApiClient();
export const api = new ApiEndpoints(apiClient);

// Export for convenience
export default api;

