import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { generateOTP, sendPasswordResetOTP } from './emailService';

// JWT secret (should be in environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  vendorId?: string;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

/**
 * Generate JWT token
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Hash password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Middleware to authenticate JWT token
 */
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const payload = verifyToken(token);
  
  if (!payload) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  req.user = payload;
  next();
}

/**
 * Optional authentication - doesn't fail if no token
 */
export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }

  next();
}

/**
 * Middleware to check user role
 */
export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

/**
 * Middleware to validate vendor ownership
 * Ensures vendors can only access their own data
 * This prevents security issues where one vendor could access another's dashboard
 */
export function requireVendorOwnership(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Admin users can access any vendor data
  if (req.user.role === 'admin') {
    return next();
  }

  // Get vendorId from URL params
  const urlVendorId = req.params?.vendorId;
  
  // Get vendorId from the authenticated user's token
  const tokenVendorId = req.user.vendorId;

  // If URL has vendorId, validate ownership
  if (urlVendorId && tokenVendorId) {
    if (urlVendorId !== tokenVendorId) {
      console.log(`[SECURITY] ❌ Vendor ownership mismatch: URL vendor ${urlVendorId} !== Token vendor ${tokenVendorId}`);
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'You can only access your own dashboard and data'
      });
    }
  }

  // If vendor role but no vendorId in token, block access
  if (req.user.role === 'vendor' && !tokenVendorId) {
    console.log(`[SECURITY] ❌ Vendor user without vendorId trying to access protected route`);
    return res.status(403).json({ 
      error: 'Access denied',
      message: 'Vendor ID not found in authentication token'
    });
  }

  next();
}

/**
 * Sign up handler
 */
export async function signUp(req: Request, res: Response) {
  try {
    const { email, password, username, role = 'vendor' } = req.body;

    // Validate input
    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, password, and username are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Import storage dynamically to avoid circular dependency
    const { storage } = await import('./storage');

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email.toLowerCase());
    
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user (ID will be auto-generated by storage)
    const user = await storage.createUser({
      email: email.toLowerCase(),
      username,
      role,
      passwordHash, // Store hashed password
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    console.log(`✅ [Auth] User registered: ${email} (${role})`);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('[Auth] Signup error:', error);
    res.status(500).json({ error: error.message || 'Failed to sign up' });
  }
}

/**
 * Sign in handler
 * IMPORTANT: Only allows Admin, Employee, and Vendor roles to login
 * Customers must use the mini-website customer login
 */
export async function signIn(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Import storage dynamically
    const { storage } = await import('./storage');

    // Find user by email
    const user = await storage.getUserByEmail(email.toLowerCase());

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // CRITICAL: Role restriction enforcement
    // Only Admin, Employee, and Vendor roles are allowed to login here
    // Customers must use the mini-website customer login
    const allowedRoles = ['admin', 'employee', 'vendor'];
    if (!allowedRoles.includes(user.role)) {
      console.warn(`🚫 [Auth] Login denied for role: ${user.role} (${email})`);
      return res.status(403).json({ 
        error: 'Access denied. Only business accounts can login here. Customers should use the store login.' 
      });
    }

    // Check if user has a password hash
    if (!user.passwordHash) {
      return res.status(401).json({ error: 'Account not set up properly. Please contact support.' });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Get vendor ID and onboarding status if user is a vendor
    let vendorId: string | undefined;
    let onboardingComplete: boolean = false;
    
    if (user.role === 'vendor') {
      const vendor = await storage.getVendorByUserId(user.id);
      if (vendor) {
        vendorId = vendor.id;
        onboardingComplete = vendor.onboardingComplete || false;
      }
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      vendorId,
    });

    console.log(`✅ [Auth] User logged in: ${email} (${user.role}) - Onboarding: ${onboardingComplete}`);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        vendorId,
        onboardingComplete,
        modulePermissions: user.modulePermissions || [],
        name: (user as any).name,
        phone: (user as any).phone,
        department: (user as any).department,
        jobRole: (user as any).jobRole,
      },
    });
  } catch (error: any) {
    console.error('[Auth] Login error:', error);
    res.status(500).json({ error: error.message || 'Failed to sign in' });
  }
}

/**
 * Sign out handler
 */
export async function signOut(req: Request, res: Response) {
  // With JWT, we don't need to do anything on the server
  // The client just needs to delete the token
  res.json({ success: true, message: 'Signed out successfully' });
}

/**
 * Get current user handler
 */
export async function getCurrentUser(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Import storage dynamically
    const { storage } = await import('./storage');

    // Get full user details
    const user = await storage.getUser(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get vendor if user is a vendor
    let vendor = null;
    if (user.role === 'vendor') {
      vendor = await storage.getVendorByUserId(user.id);
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      vendor: vendor ? {
        id: vendor.id,
        businessName: vendor.businessName,
        ownerName: vendor.ownerName,
      } : null,
    });
  } catch (error: any) {
    console.error('[Auth] Get current user error:', error);
    res.status(500).json({ error: error.message || 'Failed to get current user' });
  }
}

/**
 * Request password reset - sends OTP to email
 */
export async function requestPasswordReset(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Import storage dynamically
    const { supabaseStorage } = await import('./supabaseStorage');
    const { storage } = await import('./storage');

    // Check if user exists
    const user = await storage.getUserByEmail(email.toLowerCase());

    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({ 
        success: true, 
        message: 'If an account exists with this email, you will receive an OTP shortly.' 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    await supabaseStorage.createPasswordResetToken({
      email: email.toLowerCase(),
      otp,
      expiresAt,
      verified: false,
      used: false,
    });

    // Send OTP via email
    const emailSent = await sendPasswordResetOTP(email, otp);

    if (!emailSent) {
      return res.status(500).json({ error: 'Failed to send OTP email. Please try again.' });
    }

    console.log(`✅ [Auth] Password reset OTP sent to ${email}`);

    res.json({ 
      success: true, 
      message: 'OTP has been sent to your email address.' 
    });
  } catch (error: any) {
    console.error('[Auth] Password reset request error:', error);
    res.status(500).json({ error: error.message || 'Failed to process password reset request' });
  }
}

/**
 * Verify OTP for password reset
 */
export async function verifyResetOTP(req: Request, res: Response) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const normalizedEmail = email.toLowerCase();
    
    // Import storage dynamically
    const { supabaseStorage } = await import('./supabaseStorage');

    // Get token from database
    const token = await supabaseStorage.getPasswordResetToken(normalizedEmail, otp);

    if (!token) {
      return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
    }

    // Check if OTP has expired
    if (new Date() > new Date(token.expiresAt)) {
      await supabaseStorage.markPasswordResetTokenUsed(normalizedEmail, otp);
      return res.status(400).json({ error: 'OTP has expired. Please request a new OTP.' });
    }

    // Mark OTP as verified in database
    await supabaseStorage.verifyPasswordResetToken(normalizedEmail, otp);

    console.log(`✅ [Auth] OTP verified for ${email}`);

    res.json({ 
      success: true, 
      message: 'OTP verified successfully. You can now reset your password.' 
    });
  } catch (error: any) {
    console.error('[Auth] OTP verification error:', error);
    res.status(500).json({ error: error.message || 'Failed to verify OTP' });
  }
}

/**
 * Reset password with verified OTP
 */
export async function resetPassword(req: Request, res: Response) {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.toLowerCase();
    
    // Import storage dynamically
    const { supabaseStorage } = await import('./supabaseStorage');
    const { storage } = await import('./storage');

    // Get token from database
    const token = await supabaseStorage.getPasswordResetToken(normalizedEmail, otp);

    if (!token) {
      return res.status(400).json({ error: 'Invalid OTP. Please request a new OTP.' });
    }

    // Check if OTP has expired
    if (new Date() > new Date(token.expiresAt)) {
      await supabaseStorage.markPasswordResetTokenUsed(normalizedEmail, otp);
      return res.status(400).json({ error: 'OTP has expired. Please request a new OTP.' });
    }

    // Check if OTP was verified
    if (!token.verified) {
      return res.status(400).json({ error: 'OTP has not been verified. Please verify your OTP first.' });
    }

    // Find user
    const user = await storage.getUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update user password
    await storage.updateUser(user.id, { passwordHash });

    // Mark OTP as used in database
    await supabaseStorage.markPasswordResetTokenUsed(normalizedEmail, otp);

    console.log(`✅ [Auth] Password reset successful for ${email}`);

    res.json({ 
      success: true, 
      message: 'Password has been reset successfully. You can now login with your new password.' 
    });
  } catch (error: any) {
    console.error('[Auth] Password reset error:', error);
    res.status(500).json({ error: error.message || 'Failed to reset password' });
  }
}

