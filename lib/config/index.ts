/**
 * Configuration Utility
 * 
 * Central place to check which services are configured and available
 */

export interface ServiceConfig {
  auth: {
    enabled: boolean;
    provider: 'none' | 'clerk';
  };
  storage: {
    backend: 'local' | 'convex';
    configured: boolean;
  };
  services: {
    firecrawl: boolean;
    e2b: boolean;
  };
}

/**
 * Get current configuration
 */
export function getConfig(): ServiceConfig {
  // Check authentication
  const authEnabled = process.env.ENABLE_AUTH === 'true';
  const clerkConfigured = !!(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY
  );
  
  // Check storage backend
  const storageBackend = (process.env.STORAGE_BACKEND || 'local') as 'local' | 'convex';
  const convexConfigured = !!process.env.NEXT_PUBLIC_CONVEX_URL;
  
  // Check optional services
  const firecrawlConfigured = !!process.env.FIRECRAWL_API_KEY;
  const e2bConfigured = !!process.env.E2B_API_KEY;
  
  return {
    auth: {
      enabled: authEnabled && clerkConfigured,
      provider: authEnabled && clerkConfigured ? 'clerk' : 'none',
    },
    storage: {
      backend: storageBackend,
      configured: storageBackend === 'local' || convexConfigured,
    },
    services: {
      firecrawl: firecrawlConfigured,
      e2b: e2bConfigured,
    },
  };
}

/**
 * Check if running in fully self-hosted mode (no SaaS dependencies)
 */
export function isSelfHosted(): boolean {
  const config = getConfig();
  return (
    !config.auth.enabled &&
    config.storage.backend === 'local'
  );
}

/**
 * Get configuration warnings/errors
 */
export function getConfigIssues(): string[] {
  const issues: string[] = [];
  const config = getConfig();
  
  // Check if storage is configured
  if (!config.storage.configured) {
    if (config.storage.backend === 'convex') {
      issues.push('Convex storage selected but NEXT_PUBLIC_CONVEX_URL not configured');
    }
  }
  
  // Check if auth is enabled but not configured
  if (process.env.ENABLE_AUTH === 'true' && !config.auth.enabled) {
    issues.push('Authentication enabled but Clerk keys not configured');
  }
  
  // Warn about missing optional services
  if (!config.services.firecrawl) {
    issues.push('Firecrawl API key not configured - web scraping features will be limited');
  }
  
  return issues;
}

/**
 * Log configuration on startup
 */
export function logConfig() {
  const config = getConfig();
  
  console.log('🔧 Open Agent Builder Configuration:');
  console.log(`   Auth: ${config.auth.provider} ${config.auth.enabled ? '(enabled)' : '(disabled)'}`);
  console.log(`   Storage: ${config.storage.backend} ${config.storage.configured ? '(configured)' : '(NOT CONFIGURED)'}`);
  console.log(`   Firecrawl: ${config.services.firecrawl ? 'configured' : 'not configured'}`);
  console.log(`   E2B: ${config.services.e2b ? 'configured' : 'not configured'}`);
  console.log(`   Mode: ${isSelfHosted() ? '✅ Fully Self-Hosted' : '☁️  Using SaaS Services'}`);
  
  const issues = getConfigIssues();
  if (issues.length > 0) {
    console.warn('⚠️  Configuration Issues:');
    issues.forEach(issue => console.warn(`   - ${issue}`));
  }
}
