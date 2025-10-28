/**
 * AETHERIAL Route Guard
 * 
 * Military-Grade Route Protection
 * - Authentication checks
 * - Authorization checks
 * - Role-based access control
 * - Redirect to login if unauthorized
 * 
 * @module components/RouteGuard
 */

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Route Guard Props
 */
export interface RouteGuardProps {
  /** Child components to render if authorized */
  children: React.ReactNode;
  
  /** Requires authentication */
  requiresAuth?: boolean;
  
  /** Requires admin role */
  requiresAdmin?: boolean;
  
  /** Requires owner role */
  requiresOwner?: boolean;
  
  /** Redirect path if unauthorized */
  redirectTo?: string;
  
  /** Fallback component to render if unauthorized */
  fallback?: React.ReactNode;
}

/**
 * Route Guard Component
 * 
 * Protects routes based on authentication and authorization.
 * Redirects to login or shows fallback if unauthorized.
 * 
 * @example
 * ```tsx
 * <RouteGuard requiresAuth>
 *   <Dashboard />
 * </RouteGuard>
 * 
 * <RouteGuard requiresAdmin redirectTo="/dashboard">
 *   <AdminPanel />
 * </RouteGuard>
 * ```
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  requiresAuth = false,
  requiresAdmin = false,
  requiresOwner = false,
  redirectTo,
  fallback
}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Wait for auth to load
    if (loading) return;
    
    // Check authentication
    if (requiresAuth && !user) {
      const returnUrl = encodeURIComponent(location.pathname + location.search);
      navigate(redirectTo || `/login?returnUrl=${returnUrl}`, { replace: true });
      return;
    }
    
    // Check admin role
    if (requiresAdmin && (!user || user.role !== 'admin')) {
      navigate(redirectTo || '/dashboard', { replace: true });
      return;
    }
    
    // Check owner role
    if (requiresOwner && (!user || user.role !== 'owner')) {
      navigate(redirectTo || '/dashboard', { replace: true });
      return;
    }
  }, [user, loading, requiresAuth, requiresAdmin, requiresOwner, navigate, location, redirectTo]);
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  // Check authentication
  if (requiresAuth && !user) {
    return fallback ? <>{fallback}</> : null;
  }
  
  // Check admin role
  if (requiresAdmin && (!user || user.role !== 'admin')) {
    return fallback ? <>{fallback}</> : (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4">403 Forbidden</h1>
        <p className="text-lg text-gray-600 mb-8">You don't have permission to access this page.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }
  
  // Check owner role
  if (requiresOwner && (!user || user.role !== 'owner')) {
    return fallback ? <>{fallback}</> : (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4">403 Forbidden</h1>
        <p className="text-lg text-gray-600 mb-8">Only the platform owner can access this page.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }
  
  // Render children if authorized
  return <>{children}</>;
};

export default RouteGuard;

