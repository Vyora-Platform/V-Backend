/**
 * Pro Subscription Middleware
 * 
 * Enterprise-grade middleware to enforce Pro subscription access control.
 * 
 * Rules:
 * - Non-Pro vendors can VIEW all features (GET requests allowed)
 * - Non-Pro vendors CANNOT perform write operations (POST, PUT, PATCH, DELETE blocked)
 * - A vendor is Pro ONLY when: subscription status = 'active' AND payment status = 'completed'
 * - All blocked actions return a clear upgrade prompt message
 * - No data is stored for non-Pro vendors on write operations
 */

import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

// Response type for blocked actions
interface BlockedActionResponse {
  error: string;
  code: "SUBSCRIPTION_REQUIRED";
  message: string;
  upgradeRequired: true;
  action: string;
}

// HTTP methods that represent write operations
const WRITE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

// Paths that should be exempt from subscription checks
// These are essential paths that non-Pro users need access to
const EXEMPT_PATHS = [
  // Authentication
  '/api/auth',
  '/api/login',
  '/api/signup',
  '/api/logout',
  
  // Vendor registration and basic info
  '/api/vendors/register',
  '/api/vendors/onboarding',
  
  // Subscription management (users need to be able to subscribe)
  '/api/vendor-subscriptions',
  '/api/subscription-plans',
  '/api/billing-history',
  
  // Demo requests (potential customers)
  '/api/demo-requests',
  
  // Customer-facing mini website operations
  '/api/mini-website',
  '/api/customer-auth',
  
  // Public APIs
  '/api/public',
  
  // Admin routes (have their own auth)
  '/api/admin',
  
  // Notifications (users need to receive notifications)
  '/api/notifications',
  
  // Referral system (available to all)
  '/api/referrals',
  '/api/referral',
];

// Paths that should always be checked for Pro subscription on write operations
// These are the Pro-only modules
const PRO_ONLY_PATHS = [
  // Orders & POS
  '/api/vendors/:vendorId/orders',
  '/api/pos',
  
  // Products & Catalogue
  '/api/vendors/:vendorId/products',
  '/api/vendor-products',
  '/api/vendors/:vendorId/catalogue',
  '/api/vendor-catalogue',
  
  // Services & Bookings
  '/api/vendors/:vendorId/bookings',
  '/api/vendors/:vendorId/appointments',
  
  // Employees & HR
  '/api/vendors/:vendorId/employees',
  '/api/vendors/:vendorId/attendance',
  '/api/vendors/:vendorId/leaves',
  '/api/vendors/:vendorId/payroll',
  '/api/vendors/:vendorId/tasks',
  
  // Marketing
  '/api/vendors/:vendorId/greetings',
  '/api/greeting-template-usage',
  
  // Coupons
  '/api/vendors/:vendorId/coupons',
  '/api/coupons',
  
  // Website Builder
  '/api/vendors/:vendorId/mini-website',
  '/api/mini-websites',
  
  // Invoicing & Bills
  '/api/vendors/:vendorId/bills',
  '/api/vendors/:vendorId/invoices',
  
  // Inventory
  '/api/vendors/:vendorId/inventory',
  '/api/vendors/:vendorId/stock',
  
  // Expenses
  '/api/vendors/:vendorId/expenses',
  
  // Quotations
  '/api/vendors/:vendorId/quotations',
  
  // Ledger
  '/api/vendors/:vendorId/ledger',
  
  // Analytics export
  '/api/vendors/:vendorId/analytics/export',
];

/**
 * Check if a path matches any exempt pattern
 */
function isExemptPath(path: string): boolean {
  return EXEMPT_PATHS.some(exemptPath => {
    // Exact match or prefix match
    return path === exemptPath || path.startsWith(exemptPath);
  });
}

/**
 * Extract vendor ID from request path or body
 */
function extractVendorId(req: Request): string | null {
  // Try to get from URL params
  if (req.params?.vendorId) {
    return req.params.vendorId;
  }
  
  // Try to get from path (e.g., /api/vendors/{vendorId}/...)
  const pathMatch = req.path.match(/\/api\/vendors\/([a-zA-Z0-9_-]+)/);
  if (pathMatch && pathMatch[1]) {
    return pathMatch[1];
  }
  
  // Try to get from request body
  if (req.body?.vendorId) {
    return req.body.vendorId;
  }
  
  // Try to get from query params
  if (req.query?.vendorId) {
    return req.query.vendorId as string;
  }
  
  return null;
}

/**
 * Get the action type based on HTTP method and path
 */
function getActionType(method: string, path: string): string {
  const methodActions: Record<string, string> = {
    'POST': 'create',
    'PUT': 'update',
    'PATCH': 'update',
    'DELETE': 'delete'
  };
  
  // Check for specific action keywords in path
  if (path.includes('/publish')) return 'publish';
  if (path.includes('/export')) return 'export';
  if (path.includes('/download')) return 'download';
  if (path.includes('/send')) return 'send';
  if (path.includes('/generate')) return 'generate';
  if (path.includes('/activate')) return 'activate';
  if (path.includes('/deactivate')) return 'deactivate';
  if (path.includes('/submit')) return 'submit';
  
  return methodActions[method] || 'save';
}

/**
 * Check if vendor has Pro subscription with completed payment
 */
async function isVendorPro(vendorId: string): Promise<{isPro: boolean; subscription: any}> {
  try {
    const subscription = await storage.getVendorSubscriptionByVendor(vendorId);
    
    if (!subscription) {
      console.log(`[PRO_MIDDLEWARE] No subscription found for vendor: ${vendorId}`);
      return { isPro: false, subscription: null };
    }
    
    // CRITICAL: User is Pro ONLY if:
    // 1. Subscription status is 'active' AND
    // 2. Payment status is 'completed'
    const isPro = subscription.status === 'active' && subscription.paymentStatus === 'completed';
    
    console.log(`[PRO_MIDDLEWARE] Subscription check for vendor ${vendorId}:`, {
      status: subscription.status,
      paymentStatus: subscription.paymentStatus,
      isPro
    });
    
    return { isPro, subscription };
  } catch (error) {
    console.error(`[PRO_MIDDLEWARE] Error checking subscription for vendor ${vendorId}:`, error);
    return { isPro: false, subscription: null };
  }
}

/**
 * Create blocked action response
 */
function createBlockedResponse(action: string): BlockedActionResponse {
  return {
    error: "Subscription required",
    code: "SUBSCRIPTION_REQUIRED",
    message: `Upgrade to Pro to ${action} this feature.`,
    upgradeRequired: true,
    action
  };
}

/**
 * Main subscription middleware
 * 
 * Apply this middleware to routes that require Pro subscription for write operations.
 * GET requests are always allowed (users can view all features).
 * Write operations (POST, PUT, PATCH, DELETE) are blocked for non-Pro users.
 */
export function requireProSubscription() {
  return async (req: Request, res: Response, next: NextFunction) => {
    // GET requests are always allowed - users can VIEW all features
    if (req.method === 'GET') {
      return next();
    }
    
    // Check if this is a write operation
    if (!WRITE_METHODS.includes(req.method)) {
      return next();
    }
    
    // Check if path is exempt
    if (isExemptPath(req.path)) {
      return next();
    }
    
    // Extract vendor ID
    const vendorId = extractVendorId(req);
    
    if (!vendorId) {
      // If we can't identify the vendor, allow the request
      // (it might be a public endpoint or admin endpoint)
      console.log(`[PRO_MIDDLEWARE] No vendor ID found for path: ${req.path}, allowing request`);
      return next();
    }
    
    // Check subscription status
    const { isPro, subscription } = await isVendorPro(vendorId);
    
    if (isPro) {
      // Pro user - allow the action
      console.log(`[PRO_MIDDLEWARE] ✅ Pro vendor ${vendorId} - allowing ${req.method} ${req.path}`);
      return next();
    }
    
    // Non-Pro user trying to perform write operation
    const action = getActionType(req.method, req.path);
    
    console.log(`[PRO_MIDDLEWARE] ❌ Non-Pro vendor ${vendorId} blocked from ${action}`);
    console.log(`[PRO_MIDDLEWARE] Subscription status:`, subscription?.status || 'none');
    console.log(`[PRO_MIDDLEWARE] Payment status:`, subscription?.paymentStatus || 'none');
    console.log(`[PRO_MIDDLEWARE] Blocked path: ${req.method} ${req.path}`);
    
    // Return upgrade required response
    return res.status(403).json(createBlockedResponse(action));
  };
}

/**
 * Middleware specifically for vendor routes
 * Checks subscription before allowing write operations
 */
export function vendorProMiddleware(req: Request, res: Response, next: NextFunction) {
  // Delegate to the main middleware
  return requireProSubscription()(req, res, next);
}

/**
 * Helper function to apply Pro middleware to specific routes
 * Use this when you want to explicitly protect certain routes
 */
export function protectProRoute() {
  return requireProSubscription();
}

/**
 * Check subscription status for a specific vendor (utility function)
 * Can be called from route handlers for additional validation
 */
export async function checkVendorProStatus(vendorId: string): Promise<{
  isPro: boolean;
  canPerformAction: boolean;
  subscription: any;
  message: string;
}> {
  const { isPro, subscription } = await isVendorPro(vendorId);
  
  return {
    isPro,
    canPerformAction: isPro,
    subscription,
    message: isPro 
      ? "Pro subscription active" 
      : "Upgrade to Pro to save, publish, or download this feature."
  };
}

export default requireProSubscription;

