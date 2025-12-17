import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import * as schema from "@shared/schema";

// Use NEW Supabase project database (abizuwqnqkbicrhorcig)
// Set NEW_DATABASE_URL in Replit Secrets with your database connection string
let databaseUrl = process.env.NEW_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ [DB ERROR] Database URL is not set!');
  console.error('   Please set NEW_DATABASE_URL or DATABASE_URL environment variable');
  console.error('   Example: postgresql://user:password@host:port/database');
  throw new Error(
    "NEW_DATABASE_URL or DATABASE_URL must be set. Please add your Supabase database connection string to environment variables.",
  );
}

// Log database connection info (without password)
const urlParts = databaseUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
if (urlParts) {
  console.log('📊 [DB] Database Configuration:');
  console.log('   User:', urlParts[1]);
  console.log('   Host:', urlParts[3]);
  console.log('   Port:', urlParts[4]);
  console.log('   Database:', urlParts[5].split('?')[0]);
} else {
  console.log('📊 [DB] Database URL format:', databaseUrl.substring(0, 30) + '...');
}

// Add sslmode=require if not already present (Supabase requirement)
if (!databaseUrl.includes('sslmode=')) {
  databaseUrl += (databaseUrl.includes('?') ? '&' : '?') + 'sslmode=require';
}

console.log('🔒 [DB] SSL mode:', databaseUrl.includes('sslmode') ? 'ENABLED' : 'DISABLED');

// For Supabase pooler connections with PgBouncer (Transaction mode on port 6543)
// We need SSL but must accept the pooler's certificate
// Optimized pool configuration for better performance
export const pool = new Pool({ 
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false  // Required for Supabase pooler connections
  },
  // Connection pool optimization
  max: 10,                    // Maximum number of clients in the pool
  min: 2,                     // Minimum number of idle clients
  idleTimeoutMillis: 30000,   // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection not established
  allowExitOnIdle: false,     // Keep pool alive even when all clients idle
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('❌ [DB POOL ERROR] Unexpected error on idle client:', err);
  console.error('   Error code:', err.code);
  console.error('   Error message:', err.message);
});

// Handle pool connection events
pool.on('connect', () => {
  console.log('✅ [DB] New client connected to database pool');
});

pool.on('remove', () => {
  console.log('🔌 [DB] Client removed from database pool');
});

export const db = drizzle(pool, { schema });

// Test database connection on startup
(async () => {
  try {
    console.log('🔍 [DB] Testing database connection...');
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, current_database() as database');
    console.log('✅ [DB] Database connection successful!');
    console.log('   Current time:', result.rows[0].current_time);
    console.log('   Database name:', result.rows[0].database);
    client.release();
  } catch (error: any) {
    console.error('❌ [DB CONNECTION ERROR] Failed to connect to database!');
    console.error('   Error name:', error.name);
    console.error('   Error code:', error.code);
    console.error('   Error message:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   → Database server is not accepting connections');
      console.error('   → Check if PostgreSQL is running');
      console.error('   → Verify host and port are correct');
    } else if (error.code === 'ENOTFOUND') {
      console.error('   → Database host not found');
      console.error('   → Check your database URL hostname');
    } else if (error.code === '28P01') {
      console.error('   → Authentication failed');
      console.error('   → Check username and password');
    } else if (error.code === '3D000') {
      console.error('   → Database does not exist');
      console.error('   → Create the database first');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('   → Connection timed out');
      console.error('   → Check network connectivity');
      console.error('   → Database server might be down');
    }
    
    console.error('\n📝 [DB] Full error details:');
    console.error(error);
    
    // Don't exit - let the app try to reconnect
    console.error('\n⚠️  [DB] Server will continue, but database operations will fail');
  }
})();

/**
 * Security Context for Row-Level Security (RLS)
 * This context is used to set PostgreSQL session variables that enforce data isolation
 */
export interface SecurityContext {
  /** Vendor ID for vendor-scoped queries (null for admin queries) */
  vendorId: string | null;
  /** User role: 'vendor' for business users, 'admin' for platform administrators */
  role: 'vendor' | 'admin';
  /** Optional user ID for audit trails */
  userId?: string;
}

/**
 * Execute a database operation with RLS security context
 * 
 * This function:
 * 1. Acquires a dedicated connection from the pool
 * 2. Sets PostgreSQL session variables (app.vendor_id, app.role) for RLS policies
 * 3. Executes the provided callback with a scoped database instance
 * 4. Ensures proper cleanup even if errors occur
 * 
 * @param context - Security context (vendorId and role)
 * @param callback - Async function that performs database operations
 * @returns Result of the callback function
 * 
 * @example
 * // Vendor accessing their own bookings
 * const bookings = await withSecurityContext(
 *   { vendorId: 'vendor-123', role: 'vendor' },
 *   async (db) => await db.select().from(bookings)
 * );
 * 
 * @example
 * // Admin accessing all data
 * const allVendors = await withSecurityContext(
 *   { vendorId: null, role: 'admin' },
 *   async (db) => await db.select().from(vendors)
 * );
 */
export async function withSecurityContext<T>(
  context: SecurityContext,
  callback: (db: ReturnType<typeof drizzle<typeof schema>>) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  
  try {
    const scopedDb = drizzle({ client, schema });
    
    // Begin transaction to ensure session variables persist for the entire operation
    await scopedDb.execute(sql`BEGIN`);
    
    // Set session variables for RLS policies (is_local=false to persist for transaction)
    // These variables are used in PostgreSQL RLS policies to enforce data isolation
    await scopedDb.execute(sql`SELECT set_config('app.vendor_id', ${context.vendorId || ''}, false)`);
    await scopedDb.execute(sql`SELECT set_config('app.role', ${context.role}, false)`);
    
    if (context.userId) {
      await scopedDb.execute(sql`SELECT set_config('app.user_id', ${context.userId}, false)`);
    }
    
    // Execute the callback with the security-scoped database instance
    const result = await callback(scopedDb);
    
    // Commit the transaction
    await scopedDb.execute(sql`COMMIT`);
    
    return result;
  } catch (error) {
    // Rollback on error to ensure transaction consistency
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      // Log rollback error but throw original error
      console.error('Failed to rollback transaction:', rollbackError);
    }
    throw error;
  } finally {
    // Clear session variables to prevent leakage across pooled connections
    // This is critical for security in a connection pool
    try {
      await client.query(`SELECT set_config('app.vendor_id', '', false)`);
      await client.query(`SELECT set_config('app.role', '', false)`);
      await client.query(`SELECT set_config('app.user_id', '', false)`);
    } catch (clearError) {
      console.error('Failed to clear session variables:', clearError);
    }
    
    // Always release the connection back to the pool
    client.release();
  }
}

/**
 * Helper function to get the current security context from session variables
 * Useful for debugging and logging
 */
export async function getCurrentSecurityContext(): Promise<{
  vendorId: string | null;
  role: string | null;
  userId: string | null;
}> {
  const result = await db.execute(sql`
    SELECT 
      current_setting('app.vendor_id', true) as vendor_id,
      current_setting('app.role', true) as role,
      current_setting('app.user_id', true) as user_id
  `);
  
  const row = result.rows[0] as any;
  return {
    vendorId: row?.vendor_id || null,
    role: row?.role || null,
    userId: row?.user_id || null
  };
}
