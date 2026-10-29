import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

/**
 * AuthContext backed by the live tRPC session.
 *
 * The server authenticates with an OAuth callback and an httpOnly
 * session cookie (`app_session_id`). The browser cannot read that
 * cookie, so `token` is always null here; requests rely on
 * `credentials: "include"` in the tRPC client. The REST
 * `/api/auth/login` endpoints belong to a separate, unmounted server
 * entry and are not used.
 */

interface User {
  id: number;
  email: string;
  username: string;
  displayName: string;
  avatar: string | null;
  bio: string | null;
  isVerified: boolean;
  mfaEnabled?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ mfaRequired: boolean; mfaToken?: string }>;
  loginWithMfa: (mfaToken: string, mfaCode: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

interface SessionUser {
  id: number;
  email?: string | null;
  username?: string | null;
  name?: string | null;
  displayName?: string | null;
  avatar?: string | null;
  bio?: string | null;
  isVerified?: boolean | null;
}

function mapSessionUser(raw: SessionUser | null | undefined): User | null {
  if (!raw) return null;
  return {
    id: raw.id,
    email: raw.email ?? "",
    username: raw.username ?? "",
    displayName: raw.displayName ?? raw.name ?? raw.username ?? "",
    avatar: raw.avatar ?? null,
    bio: raw.bio ?? null,
    isVerified: raw.isVerified ?? false,
    mfaEnabled: false,
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const utils = trpc.useUtils();
  const logoutMutation = trpc.auth.logout.useMutation();

  // A local overlay lets `updateUser` reflect a profile edit before the
  // session query refetches. It resets when the signed-in identity
  // changes.
  const [overlay, setOverlay] = useState<Partial<User> | null>(null);
  const sessionUser = useMemo(
    () => mapSessionUser(meQuery.data),
    [meQuery.data]
  );
  const userId = sessionUser?.id;

  useEffect(() => {
    setOverlay(null);
  }, [userId]);

  const user = useMemo(
    () => (sessionUser ? { ...sessionUser, ...overlay } : null),
    [sessionUser, overlay]
  );

  const login = useCallback(async () => {
    try {
      window.location.href = getLoginUrl();
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Sign-in is not configured for this deployment."
      );
    }
    // The browser is navigating to the identity provider; there is no
    // local MFA challenge in this flow.
    return { mfaRequired: false };
  }, []);

  const loginWithMfa = useCallback(
    async (_mfaToken: string, _mfaCode: string) => {
      throw new Error(
        "MFA is managed by the identity provider; there is no local MFA challenge."
      );
    },
    []
  );

  const register = useCallback(
    async (_email: string, _password: string, _displayName?: string) => {
      await login();
    },
    [login]
  );

  const logout = useCallback(() => {
    void (async () => {
      try {
        await logoutMutation.mutateAsync();
      } catch (error) {
        // An already-expired session is still a successful sign-out.
        console.warn("[AuthContext] logout request failed:", error);
      }
      utils.auth.me.setData(undefined, null);
      setOverlay(null);
    })();
  }, [logoutMutation, utils]);

  const updateUser = useCallback((userData: Partial<User>) => {
    setOverlay(previous => ({ ...previous, ...userData }));
  }, []);

  const value: AuthContextType = {
    user,
    token: null,
    isLoading: meQuery.isLoading,
    isAuthenticated: Boolean(user),
    login,
    loginWithMfa,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
