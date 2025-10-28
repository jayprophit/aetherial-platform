import React from 'react';
import styled from 'styled-components';

// Define the AuthContext interface
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  verifyAge: (birthDate: Date) => Promise<boolean>;
  verifyKYC: (kycData: KYCData) => Promise<KYCStatus>;
  loading: boolean;
  error: string | null;
}

// Define user types and interfaces
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  ageVerified: boolean;
  kycStatus: KYCStatus;
  restrictions: UserRestrictions;
  digitalAssets: DigitalAssets;
}

enum UserRole {
  USER = 'user',
  BUSINESS = 'business',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  ORGANIZATION = 'organization',
  GOVERNMENT = 'government'
}

enum KYCStatus {
  NOT_SUBMITTED = 'not_submitted',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

interface UserRestrictions {
  isMinor: boolean;
  noKYC: boolean;
  chatAccess: boolean;
  financialAccess: boolean;
  contentAccess: ContentRestrictionLevel;
}

enum ContentRestrictionLevel {
  ALL = 'all',
  TEEN = 'teen',
  CHILDREN = 'children'
}

interface DigitalAssets {
  rewardPoints: number;
  lockedRewardPoints: number;
  stakingBalance: number;
  mintedAssets: string[];
  minedAssets: string[];
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  birthDate: Date;
  role?: UserRole;
}

interface KYCData {
  fullName: string;
  address: string;
  idType: string;
  idNumber: string;
  idDocument: File;
  selfieDocument: File;
}

// Create the context with a default value
const AuthContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  verifyAge: async () => false,
  verifyKYC: async () => KYCStatus.NOT_SUBMITTED,
  loading: false,
  error: null
});

// Create the AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the backend API
      // For demo purposes, we'll simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        name: 'Demo User',
        email: email,
        role: UserRole.USER,
        ageVerified: true,
        kycStatus: KYCStatus.APPROVED,
        restrictions: {
          isMinor: false,
          noKYC: false,
          chatAccess: true,
          financialAccess: true,
          contentAccess: ContentRestrictionLevel.ALL
        },
        digitalAssets: {
          rewardPoints: 500,
          lockedRewardPoints: 0,
          stakingBalance: 100,
          mintedAssets: ['token1', 'token2'],
          minedAssets: ['block1', 'block2']
        }
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (err) {
      setError('Failed to login. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  // Register function
  const register = async (userData: RegisterData) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the backend API
      // For demo purposes, we'll simulate a successful registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user is a minor
      const birthDate = new Date(userData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const isMinor = age < 18;
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        name: userData.name,
        email: userData.email,
        role: userData.role || UserRole.USER,
        ageVerified: true,
        kycStatus: KYCStatus.NOT_SUBMITTED,
        restrictions: {
          isMinor: isMinor,
          noKYC: true,
          chatAccess: age >= 13,
          financialAccess: !isMinor,
          contentAccess: isMinor ? (age >= 13 ? ContentRestrictionLevel.TEEN : ContentRestrictionLevel.CHILDREN) : ContentRestrictionLevel.ALL
        },
        digitalAssets: {
          rewardPoints: 0,
          lockedRewardPoints: 0,
          stakingBalance: 0,
          mintedAssets: [],
          minedAssets: []
        }
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (err) {
      setError('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Age verification function
  const verifyAge = async (birthDate: Date): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the backend API
      // For demo purposes, we'll simulate age verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const isAdult = age >= 18;
      
      if (user) {
        const updatedUser = { 
          ...user, 
          restrictions: { 
            ...user.restrictions, 
            isMinor: !isAdult,
            chatAccess: age >= 13,
            financialAccess: isAdult
          } 
        };
        setUser(updatedUser);
      }
      
      return isAdult;
    } catch (err) {
      setError('Failed to verify age. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // KYC verification function
  const verifyKYC = async (kycData: KYCData): Promise<KYCStatus> => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the backend API
      // For demo purposes, we'll simulate KYC verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Always approve for demo
      const kycStatus = KYCStatus.APPROVED;
      
      if (user) {
        const updatedUser = { 
          ...user, 
          kycStatus: kycStatus,
          restrictions: { 
            ...user.restrictions, 
            noKYC: false
          } 
        };
        setUser(updatedUser);
      }
      
      return kycStatus;
    } catch (err) {
      setError('Failed to verify KYC. Please try again.');
      return KYCStatus.REJECTED;
    } finally {
      setLoading(false);
    }
  };

  // Create the context value
  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    register,
    verifyAge,
    verifyKYC,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
