/**
 * Authentication Utility - Makes Clerk Authentication Optional
 * 
 * This utility provides a unified auth interface that works with or without Clerk.
 * When auth is disabled, it uses a simple single-user mode.
 */

// Check if authentication is enabled
const AUTH_ENABLED = process.env.ENABLE_AUTH === 'true';
const DEFAULT_USER_ID = 'local-user';

export interface AuthUser {
  userId: string;
  email?: string;
  name?: string;
  imageUrl?: string;
}

/**
 * Get current authenticated user
 * Returns null if auth is disabled (single-user mode uses default user)
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!AUTH_ENABLED) {
    // Single-user mode - return default user
    return {
      userId: DEFAULT_USER_ID,
      name: 'Local User',
    };
  }
  
  // Clerk auth would go here
  try {
    const { auth } = await import('@clerk/nextjs/server');
    const { userId } = await auth();
    
    if (!userId) {
      return null;
    }
    
    return {
      userId,
    };
  } catch (error) {
    console.error('Failed to get Clerk user:', error);
    return null;
  }
}

/**
 * Get user ID from request (for API routes)
 */
export async function getUserIdFromRequest(): Promise<string | null> {
  if (!AUTH_ENABLED) {
    return DEFAULT_USER_ID;
  }
  
  try {
    const { auth } = await import('@clerk/nextjs/server');
    const { userId } = await auth();
    return userId;
  } catch (error) {
    console.error('Failed to get user ID from request:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  if (!AUTH_ENABLED) {
    return true; // Always authenticated in single-user mode
  }
  
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Get default user ID for single-user mode
 */
export function getDefaultUserId(): string {
  return DEFAULT_USER_ID;
}

/**
 * Check if authentication is enabled
 */
export function isAuthEnabled(): boolean {
  return AUTH_ENABLED;
}
