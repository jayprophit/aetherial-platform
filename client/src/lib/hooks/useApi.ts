/**
 * AETHERIAL Platform - API Hooks
 * 
 * React hooks for API calls with loading states, error handling, and caching
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { api, ApiError, ApiResponse } from '../api/client';

// ============================================
// TYPES
// ============================================

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export interface UseApiOptions {
  immediate?: boolean;
  cache?: boolean;
  cacheTime?: number;
}

// ============================================
// CACHE MANAGEMENT
// ============================================

const cache = new Map<string, { data: any; timestamp: number }>();
const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

function getCachedData(key: string, cacheTime: number): any | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cacheTime) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// ============================================
// HOOKS
// ============================================

/**
 * Generic API hook
 */
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
): UseApiState<T> {
  const { immediate = true, cache: useCache = false, cacheTime = DEFAULT_CACHE_TIME } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<ApiError | null>(null);
  const isMounted = useRef(true);

  const cacheKey = useCache ? apiCall.toString() : null;

  const fetchData = useCallback(async () => {
    // Check cache first
    if (cacheKey && useCache) {
      const cachedData = getCachedData(cacheKey, cacheTime);
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      if (isMounted.current) {
        setData(response.data || null);
        if (cacheKey && useCache && response.data) {
          setCachedData(cacheKey, response.data);
        }
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err as ApiError);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [apiCall, cacheKey, useCache, cacheTime]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }

    return () => {
      isMounted.current = false;
    };
  }, [immediate, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for user profile
 */
export function useUserProfile(userId?: string) {
  return useApi(() => api.users.getProfile(userId), { cache: true });
}

/**
 * Hook for posts
 */
export function usePosts(params?: any) {
  return useApi(() => api.posts.getAll(params));
}

/**
 * Hook for groups
 */
export function useGroups(params?: any) {
  return useApi(() => api.groups.getAll(params), { cache: true });
}

/**
 * Hook for courses
 */
export function useCourses(params?: any) {
  return useApi(() => api.courses.getAll(params), { cache: true, cacheTime: 10 * 60 * 1000 });
}

/**
 * Hook for products
 */
export function useProducts(params?: any) {
  return useApi(() => api.products.getAll(params), { cache: true });
}

/**
 * Hook for jobs
 */
export function useJobs(params?: any) {
  return useApi(() => api.jobs.getAll(params), { cache: true });
}

/**
 * Hook for events
 */
export function useEvents(params?: any) {
  return useApi(() => api.events.getAll(params), { cache: true });
}

/**
 * Hook for blockchain wallet
 */
export function useWallet() {
  return useApi(() => api.blockchain.getWallet());
}

/**
 * Hook for NFTs
 */
export function useNFTs(params?: any) {
  return useApi(() => api.nft.getAll(params), { cache: true });
}

/**
 * Hook for DeFi portfolio
 */
export function useDeFiPortfolio() {
  return useApi(() => api.defi.getPortfolio());
}

/**
 * Hook for analytics dashboard
 */
export function useAnalytics() {
  return useApi(() => api.analytics.getDashboard(), { cache: true, cacheTime: 1 * 60 * 1000 });
}

/**
 * Hook for mutations (POST, PUT, DELETE)
 */
export function useMutation<T, P = any>(
  mutationFn: (params: P) => Promise<ApiResponse<T>>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const mutate = useCallback(
    async (params: P) => {
      setLoading(true);
      setError(null);

      try {
        const response = await mutationFn(params);
        setData(response.data || null);
        return response;
      } catch (err) {
        setError(err as ApiError);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [mutationFn]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, mutate, reset };
}

/**
 * Hook for creating a post
 */
export function useCreatePost() {
  return useMutation((data: any) => api.posts.create(data));
}

/**
 * Hook for liking a post
 */
export function useLikePost() {
  return useMutation((postId: string) => api.posts.like(postId));
}

/**
 * Hook for sending a message
 */
export function useSendMessage() {
  return useMutation(({ conversationId, content, attachments }: any) =>
    api.messages.send(conversationId, content, attachments)
  );
}

/**
 * Hook for enrolling in a course
 */
export function useEnrollCourse() {
  return useMutation((courseId: string) => api.courses.enroll(courseId));
}

/**
 * Hook for adding to cart
 */
export function useAddToCart() {
  return useMutation(({ productId, quantity }: any) =>
    api.products.addToCart(productId, quantity)
  );
}

/**
 * Hook for applying to a job
 */
export function useApplyJob() {
  return useMutation(({ jobId, data }: any) => api.jobs.apply(jobId, data));
}

/**
 * Hook for RSVP to event
 */
export function useEventRSVP() {
  return useMutation(({ eventId, status }: any) => api.events.rsvp(eventId, status));
}

/**
 * Hook for staking tokens
 */
export function useStakeTokens() {
  return useMutation(({ tokenId, amount }: any) => api.defi.stake(tokenId, amount));
}

/**
 * Hook for minting NFT
 */
export function useMintNFT() {
  return useMutation((data: any) => api.nft.mint(data));
}

/**
 * Hook for AI chat
 */
export function useAIChat() {
  return useMutation(({ messages, model }: any) => api.ai.chat(messages, model));
}

/**
 * Hook for WebSocket connection
 */
export function useWebSocket() {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socket = api.connectWebSocket();
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    return () => {
      socket.disconnect();
    };
  }, []);

  const emit = useCallback((event: string, data: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  const off = useCallback((event: string) => {
    if (socketRef.current) {
      socketRef.current.off(event);
    }
  }, []);

  return { connected, emit, on, off, socket: socketRef.current };
}

/**
 * Hook for real-time notifications
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { connected, on, off } = useWebSocket();

  useEffect(() => {
    if (connected) {
      on('notification', (notification: any) => {
        setNotifications((prev) => [notification, ...prev]);
      });

      return () => {
        off('notification');
      };
    }
  }, [connected, on, off]);

  return { notifications, connected };
}

/**
 * Hook for real-time messages
 */
export function useRealtimeMessages(conversationId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const { connected, on, off, emit } = useWebSocket();

  useEffect(() => {
    if (connected && conversationId) {
      // Join conversation room
      emit('join-conversation', { conversationId });

      // Listen for new messages
      on('new-message', (message: any) => {
        if (message.conversationId === conversationId) {
          setMessages((prev) => [...prev, message]);
        }
      });

      // Listen for typing indicators
      on('typing', (data: any) => {
        // Handle typing indicator
      });

      return () => {
        emit('leave-conversation', { conversationId });
        off('new-message');
        off('typing');
      };
    }
  }, [connected, conversationId, on, off, emit]);

  const sendMessage = useCallback(
    (content: string, attachments?: string[]) => {
      emit('send-message', { conversationId, content, attachments });
    },
    [conversationId, emit]
  );

  const sendTyping = useCallback(() => {
    emit('typing', { conversationId });
  }, [conversationId, emit]);

  return { messages, sendMessage, sendTyping, connected };
}

/**
 * Hook for file upload with progress
 */
export function useFileUpload() {
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const upload = useCallback(async (file: File, endpoint: string = '/upload') => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const response = await api.upload(endpoint, file, (progress) => {
        setProgress(progress);
      });

      setUrl(response.data?.url || null);
      return response;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setProgress(0);
    setUploading(false);
    setError(null);
    setUrl(null);
  }, []);

  return { upload, uploading, progress, error, url, reset };
}

/**
 * Hook for infinite scroll / pagination
 */
export function useInfiniteScroll<T>(
  fetchFn: (page: number) => Promise<ApiResponse<T[]>>,
  options: { pageSize?: number } = {}
) {
  const { pageSize = 20 } = options;
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetchFn(page);
      const newData = response.data || [];

      setData((prev) => [...prev, ...newData]);
      setHasMore(newData.length === pageSize);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, page, loading, hasMore, pageSize]);

  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  useEffect(() => {
    loadMore();
  }, []); // Load first page on mount

  return { data, loading, error, hasMore, loadMore, reset };
}

