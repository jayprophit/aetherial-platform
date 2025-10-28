/**
 * API Client - Connects frontend to backend services
 * Handles all HTTP requests, authentication, and error handling
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_TIMEOUT = 30000; // 30 seconds

// API Client Instance
class APIClient {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          this.clearAuth();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.authToken = token;
    localStorage.setItem('auth_token', token);
  }

  /**
   * Clear authentication
   */
  clearAuth(): void {
    this.authToken = null;
    localStorage.removeItem('auth_token');
  }

  /**
   * Load auth token from localStorage
   */
  loadAuthToken(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.authToken = token;
    }
  }

  /**
   * Generic GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  /**
   * Generic POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  /**
   * Generic PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  /**
   * Generic DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  /**
   * Upload file
   */
  async uploadFile<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(progress);
        }
      },
    };

    return this.post<T>(url, formData, config);
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Load auth token on initialization
apiClient.loadAuthToken();

// API Service Classes
export class AuthAPI {
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const response = await apiClient.post('/auth/login', { email, password });
    apiClient.setAuthToken(response.token);
    return response;
  }

  async register(userData: any): Promise<{ token: string; user: any }> {
    const response = await apiClient.post('/auth/register', userData);
    apiClient.setAuthToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    apiClient.clearAuth();
  }

  async getCurrentUser(): Promise<any> {
    return apiClient.get('/auth/me');
  }

  async updateProfile(data: any): Promise<any> {
    return apiClient.put('/auth/profile', data);
  }
}

export class BlockchainAPI {
  async getBlockchain(): Promise<any> {
    return apiClient.get('/blockchain-ui/blockchain');
  }

  async getBlock(hash: string): Promise<any> {
    return apiClient.get(`/blockchain-ui/block/${hash}`);
  }

  async getStats(): Promise<any> {
    return apiClient.get('/blockchain-ui/stats');
  }

  async searchBlocks(query: string): Promise<any> {
    return apiClient.get(`/blockchain-ui/search?q=${query}`);
  }

  async createBranch(data: any): Promise<any> {
    return apiClient.post('/blockchain-ui/branch', data);
  }
}

export class WalletAPI {
  async getWallet(address: string): Promise<any> {
    return apiClient.get(`/blockchain-ui/wallet/${address}`);
  }

  async createWallet(data: any): Promise<any> {
    return apiClient.post('/blockchain-ui/wallet', data);
  }

  async sendTransaction(data: any): Promise<any> {
    return apiClient.post('/blockchain-ui/transaction', data);
  }

  async getTransactionHistory(address: string): Promise<any> {
    return apiClient.get(`/blockchain-ui/wallet/${address}/transactions`);
  }
}

export class NFTAPI {
  async mintNFT(data: any): Promise<any> {
    return apiClient.post('/nft/mint', data);
  }

  async getNFT(tokenId: string): Promise<any> {
    return apiClient.get(`/nft/${tokenId}`);
  }

  async listNFT(tokenId: string, price: number): Promise<any> {
    return apiClient.post(`/nft/${tokenId}/list`, { price });
  }

  async buyNFT(tokenId: string): Promise<any> {
    return apiClient.post(`/nft/${tokenId}/buy`);
  }

  async getMarketplace(): Promise<any> {
    return apiClient.get('/nft/marketplace');
  }
}

export class CommerceAPI {
  async getProducts(): Promise<any> {
    return apiClient.get('/commerce/products');
  }

  async getProduct(id: string): Promise<any> {
    return apiClient.get(`/commerce/products/${id}`);
  }

  async createProduct(data: any): Promise<any> {
    return apiClient.post('/commerce/products', data);
  }

  async createOrder(data: any): Promise<any> {
    return apiClient.post('/commerce/orders', data);
  }

  async getOrders(): Promise<any> {
    return apiClient.get('/commerce/orders');
  }
}

export class SocialAPI {
  async getFeed(): Promise<any> {
    return apiClient.get('/social/feed');
  }

  async createPost(data: any): Promise<any> {
    return apiClient.post('/social/posts', data);
  }

  async likePost(postId: string): Promise<any> {
    return apiClient.post(`/social/posts/${postId}/like`);
  }

  async commentPost(postId: string, comment: string): Promise<any> {
    return apiClient.post(`/social/posts/${postId}/comments`, { comment });
  }

  async followUser(userId: string): Promise<any> {
    return apiClient.post(`/social/users/${userId}/follow`);
  }
}

export class ELearningAPI {
  async getCourses(): Promise<any> {
    return apiClient.get('/elearning/courses');
  }

  async getCourse(id: string): Promise<any> {
    return apiClient.get(`/elearning/courses/${id}`);
  }

  async enrollCourse(id: string): Promise<any> {
    return apiClient.post(`/elearning/courses/${id}/enroll`);
  }

  async getProgress(courseId: string): Promise<any> {
    return apiClient.get(`/elearning/courses/${courseId}/progress`);
  }

  async completeLesson(courseId: string, lessonId: string): Promise<any> {
    return apiClient.post(`/elearning/courses/${courseId}/lessons/${lessonId}/complete`);
  }
}

export class JobsAPI {
  async getJobs(): Promise<any> {
    return apiClient.get('/jobs');
  }

  async getJob(id: string): Promise<any> {
    return apiClient.get(`/jobs/${id}`);
  }

  async createJob(data: any): Promise<any> {
    return apiClient.post('/jobs', data);
  }

  async applyJob(jobId: string, data: any): Promise<any> {
    return apiClient.post(`/jobs/${jobId}/apply`, data);
  }
}

export class TradingAPI {
  async getMarketData(): Promise<any> {
    return apiClient.get('/trading/market');
  }

  async placeTrade(data: any): Promise<any> {
    return apiClient.post('/trading/trade', data);
  }

  async getPortfolio(): Promise<any> {
    return apiClient.get('/trading/portfolio');
  }

  async getTradeHistory(): Promise<any> {
    return apiClient.get('/trading/history');
  }
}

export class AIAPI {
  async chat(message: string, context?: any): Promise<any> {
    return apiClient.post('/ai/chat', { message, context });
  }

  async getPersonalAI(): Promise<any> {
    return apiClient.get('/ai/personal');
  }

  async updatePersonalAI(preferences: any): Promise<any> {
    return apiClient.put('/ai/personal', preferences);
  }
}

// Export all API services
export const api = {
  auth: new AuthAPI(),
  blockchain: new BlockchainAPI(),
  wallet: new WalletAPI(),
  nft: new NFTAPI(),
  commerce: new CommerceAPI(),
  social: new SocialAPI(),
  elearning: new ELearningAPI(),
  jobs: new JobsAPI(),
  trading: new TradingAPI(),
  ai: new AIAPI(),
};

export default api;

