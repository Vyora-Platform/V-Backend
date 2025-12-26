import { eq, and, or, like, desc, gte, lte, sql, inArray } from "drizzle-orm";
import { db, withSecurityContext } from "./db";
import {
  users,
  vendors,
  miniWebsites,
  miniWebsiteReviews,
  miniWebsiteLeads,
  customers,
  suppliers,
  expenses,
  orders,
  orderItems,
  bookings,
  appointments,
  employees,
  tasks,
  attendance,
  leaves,
  payroll,
  leads,
  leadCommunications,
  leadTasks,
  quotations,
  quotationItems,
  categories,
  subcategories,
  brands,
  units,
  masterServices,
  vendorCatalogues,
  customServiceRequests,
  additionalServices,
  additionalServiceInquiries,
  vendorProducts,
  masterProducts,
  transactions,
  ledgerTransactions,
  stockMovements,
  bills,
  billItems,
  billPayments,
  notifications,
  coupons,
  couponUsages,
  customerVisits,
  customerTasks,
  customerAttendance,
  supplierPayments,
  greetingTemplates,
  greetingTemplateUsage,
  vendorSubscriptions,
  subscriptionPlans,
  demoRequests,
  type User,
  type InsertUser,
  type Vendor,
  type InsertVendor,
  type MiniWebsite,
  type InsertMiniWebsite,
  type MiniWebsiteReview,
  type InsertMiniWebsiteReview,
  type MiniWebsiteLead,
  type InsertMiniWebsiteLead,
  type Customer,
  type InsertCustomer,
  type Supplier,
  type InsertSupplier,
  type Expense,
  type InsertExpense,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Booking,
  type InsertBooking,
  type Appointment,
  type InsertAppointment,
  type Employee,
  type InsertEmployee,
  type Task,
  type InsertTask,
  type Attendance,
  type InsertAttendance,
  type Leave,
  type InsertLeave,
  type Payroll,
  type InsertPayroll,
  type Lead,
  type InsertLead,
  type LeadCommunication,
  type InsertLeadCommunication,
  type LeadTask,
  type InsertLeadTask,
  type Quotation,
  type InsertQuotation,
  type QuotationItem,
  type InsertQuotationItem,
  type Category,
  type InsertCategory,
  type Subcategory,
  type InsertSubcategory,
  type Brand,
  type InsertBrand,
  type Unit,
  type InsertUnit,
  type MasterService,
  type InsertMasterService,
  type VendorCatalogue,
  type InsertVendorCatalogue,
  type CustomServiceRequest,
  type InsertCustomServiceRequest,
  type AdditionalService,
  type InsertAdditionalService,
  type AdditionalServiceInquiry,
  type InsertAdditionalServiceInquiry,
  type VendorProduct,
  type InsertVendorProduct,
  type MasterProduct,
  type InsertMasterProduct,
  type Transaction,
  type InsertTransaction,
  type LedgerTransaction,
  type InsertLedgerTransaction,
  type StockMovement,
  type InsertStockMovement,
  stockAlerts,
  type StockAlert,
  type InsertStockAlert,
  type Bill,
  type InsertBill,
  type BillItem,
  type InsertBillItem,
  type BillPayment,
  type InsertBillPayment,
  type Notification,
  type InsertNotification,
  type Coupon,
  type InsertCoupon,
  type CouponUsage,
  type InsertCouponUsage,
  type CustomerVisit,
  type InsertCustomerVisit,
  type CustomerTask,
  type InsertCustomerTask,
  type CustomerAttendance,
  type InsertCustomerAttendance,
  type SupplierPayment,
  type InsertSupplierPayment,
  type GreetingTemplate,
  type InsertGreetingTemplate,
  type GreetingTemplateUsage,
  type InsertGreetingTemplateUsage,
  type DemoRequest,
  type InsertDemoRequest,
  type VendorSubscription,
  type InsertVendorSubscription,
  passwordResetTokens,
  type PasswordResetToken,
  type InsertPasswordResetToken,
} from "@shared/schema";
import type { IStorage } from "./storage";
import { nanoid } from "nanoid";

export class SupabaseStorage implements Partial<IStorage> {
  // ========== USERS ==========
  async getUser(id: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0];
    } catch (error: any) {
      // Fallback: Select only columns that definitely exist
      if (error?.code === '42703') {
        const result = await db.execute(sql`
          SELECT id, username, email, password_hash, role, 
                 COALESCE(module_permissions, '[]'::jsonb) as module_permissions, 
                 created_at
          FROM users WHERE id = ${id} LIMIT 1
        `);
        const row = result.rows[0] as any;
        if (!row) return undefined;
        return {
          id: row.id,
          username: row.username,
          email: row.email,
          passwordHash: row.password_hash,
          role: row.role,
          modulePermissions: Array.isArray(row.module_permissions) ? row.module_permissions : [],
          createdAt: row.created_at,
        } as User;
      }
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0];
    } catch (error: any) {
      // Fallback: Select only columns that definitely exist
      if (error?.code === '42703') {
        const result = await db.execute(sql`
          SELECT id, username, email, password_hash, role, 
                 COALESCE(module_permissions, '[]'::jsonb) as module_permissions, 
                 created_at
          FROM users WHERE email = ${email.toLowerCase()} LIMIT 1
        `);
        const row = result.rows[0] as any;
        if (!row) return undefined;
        return {
          id: row.id,
          username: row.username,
          email: row.email,
          passwordHash: row.password_hash,
          role: row.role,
          modulePermissions: Array.isArray(row.module_permissions) ? row.module_permissions : [],
          createdAt: row.created_at,
        } as User;
      }
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return result[0];
    } catch (error: any) {
      // Fallback: Select only columns that definitely exist
      if (error?.code === '42703') {
        const result = await db.execute(sql`
          SELECT id, username, email, password_hash, role, 
                 COALESCE(module_permissions, '[]'::jsonb) as module_permissions, 
                 created_at
          FROM users WHERE username = ${username} LIMIT 1
        `);
        const row = result.rows[0] as any;
        if (!row) return undefined;
        return {
          id: row.id,
          username: row.username,
          email: row.email,
          passwordHash: row.password_hash,
          role: row.role,
          modulePermissions: Array.isArray(row.module_permissions) ? row.module_permissions : [],
          createdAt: row.created_at,
        } as User;
      }
      throw error;
    }
  }

  async createUser(userData: InsertUser): Promise<User> {
    // Generate ID if not provided (for JWT auth)
    const userDataWithId: any = {
      ...userData,
      id: (userData as any).id || `user-${nanoid()}`,
    };
    
    // Ensure modulePermissions is properly formatted for JSON field
    if (userDataWithId.modulePermissions !== undefined) {
      if (Array.isArray(userDataWithId.modulePermissions)) {
        // JSON field expects array, which drizzle will serialize
        userDataWithId.modulePermissions = userDataWithId.modulePermissions;
      } else {
        userDataWithId.modulePermissions = [];
      }
    } else {
      userDataWithId.modulePermissions = [];
    }
    
    // Ensure employee fields are properly set (nullable)
    if (userDataWithId.name === undefined) userDataWithId.name = null;
    if (userDataWithId.phone === undefined) userDataWithId.phone = null;
    if (userDataWithId.department === undefined) userDataWithId.department = null;
    if (userDataWithId.jobRole === undefined) userDataWithId.jobRole = null;
    
    try {
      const result = await db.insert(users).values(userDataWithId).returning();
      return result[0];
    } catch (error: any) {
      console.error("Database error creating user:", error);
      // If module_permissions column doesn't exist, try without it
      if (error?.message?.includes('module_permissions') || error?.code === '42703') {
        console.warn("module_permissions column may not exist, creating user without it");
        delete userDataWithId.modulePermissions;
        const result = await db.insert(users).values(userDataWithId).returning();
        return result[0];
      }
      // If employee fields don't exist, try without them
      if (error?.message?.includes('name') || error?.message?.includes('phone') || 
          error?.message?.includes('department') || error?.message?.includes('job_role') ||
          error?.code === '42703') {
        console.warn("Employee fields may not exist, creating user without them");
        delete userDataWithId.name;
        delete userDataWithId.phone;
        delete userDataWithId.department;
        delete userDataWithId.jobRole;
        const result = await db.insert(users).values(userDataWithId).returning();
        return result[0];
      }
      throw error;
    }
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    // Handle modulePermissions properly for JSONB field
    const updateData: any = { ...updates };
    if (updateData.modulePermissions !== undefined) {
      if (Array.isArray(updateData.modulePermissions)) {
        updateData.modulePermissions = updateData.modulePermissions;
      } else {
        updateData.modulePermissions = [];
      }
    }
    
    try {
      const result = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
      return result[0];
    } catch (error: any) {
      console.error("Database error updating user:", error);
      // If module_permissions column doesn't exist, try without it
      if (error?.message?.includes('module_permissions') || error?.code === '42703') {
        console.warn("module_permissions column may not exist, updating user without it");
        delete updateData.modulePermissions;
        const result = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
        return result[0];
      }
      throw error;
    }
  }

  async getUsersByRole(role: string): Promise<User[]> {
    try {
      const result = await db.select().from(users).where(eq(users.role, role));
      return result;
    } catch (error: any) {
      // Fallback: Select only columns that definitely exist
      if (error?.code === '42703') {
        const result = await db.execute(sql`
          SELECT id, username, email, password_hash, role, 
                 COALESCE(module_permissions, '[]'::jsonb) as module_permissions, 
                 created_at
          FROM users WHERE role = ${role}
        `);
        return result.rows.map((row: any) => ({
          id: row.id,
          username: row.username,
          email: row.email,
          passwordHash: row.password_hash,
          role: row.role,
          modulePermissions: Array.isArray(row.module_permissions) ? row.module_permissions : [],
          createdAt: row.created_at,
        })) as User[];
      }
      throw error;
    }
  }

  // ========== VENDORS ==========
  
  // Helper function to fix category and subcategory fields
  private fixVendorCategory(vendor: Vendor): Vendor {
    return {
      ...vendor,
      category: vendor.customCategory || vendor.category || 'Uncategorized',
      subcategory: vendor.customSubcategory || vendor.subcategory || 'Uncategorized',
    };
  }

  async getVendor(id: string): Promise<Vendor | undefined> {
    const result = await db.select().from(vendors).where(eq(vendors.id, id)).limit(1);
    return result[0] ? this.fixVendorCategory(result[0]) : undefined;
  }

  async getVendorByUserId(userId: string): Promise<Vendor | undefined> {
    const result = await db.select().from(vendors).where(eq(vendors.userId, userId)).limit(1);
    return result[0] ? this.fixVendorCategory(result[0]) : undefined;
  }

  async getAllVendors(): Promise<Vendor[]> {
    const startTime = Date.now();
    try {
      console.log('[DATABASE] Fetching vendors from vendors table');
      console.log('[SQL] SELECT * FROM vendors (direct query, bypassing RLS via service role)');
      console.log('[TIMING] Query started at:', new Date().toISOString());
      
      // Use direct SQL query to bypass any potential RLS overhead
      // The db instance uses service role connection which should bypass RLS
      const result = await db.select().from(vendors);
      
      const queryTime = Date.now() - startTime;
      console.log('[DATABASE] Fetched', result.length, 'vendors from database');
      console.log('[TIMING] Query completed in', queryTime, 'ms');
      
      if (queryTime > 1000) {
        console.warn('[PERFORMANCE WARNING] Vendor query took', queryTime, 'ms - this is slow!');
        console.warn('[PERFORMANCE] Possible causes:');
        console.warn('  1. RLS policies causing slow evaluation');
        console.warn('  2. Missing indexes on vendors table');
        console.warn('  3. Large number of vendors in table');
        console.warn('  4. Database connection pool issues');
      }
      
      if (result.length === 0) {
        console.warn('[WARNING] No vendors found in database');
        console.warn('[DEBUG] Check if vendors table has data: SELECT COUNT(*) FROM vendors;');
      }
      
      // Fix category and subcategory: use customCategory/customSubcategory if they exist
      const fixedResult = result.map(vendor => this.fixVendorCategory(vendor));
      
      return fixedResult;
    } catch (error: any) {
      const queryTime = Date.now() - startTime;
      console.error('[DATABASE ERROR] Failed to fetch vendors after', queryTime, 'ms');
      console.error('[DATABASE ERROR] Details:', {
        message: error?.message,
        detail: error?.detail,
        code: error?.code,
        stack: error?.stack,
      });
      
      // If query is timing out, suggest checking RLS policies
      if (queryTime > 5000) {
        console.error('[TIMEOUT] Query took too long - possible RLS policy issue');
        console.error('[SUGGESTION] Check RLS policies: SELECT * FROM pg_policies WHERE tablename = \'vendors\';');
      }
      
      throw error;
    }
  }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    const result = await db.insert(vendors).values(vendor).returning();
    return result[0];
  }

  async updateVendor(id: string, updates: Partial<InsertVendor>): Promise<Vendor | undefined> {
    const result = await db.update(vendors).set(updates).where(eq(vendors.id, id)).returning();
    return result[0];
  }

  // ========== MINI-WEBSITES ==========
  async getMiniWebsiteByVendor(vendorId: string): Promise<MiniWebsite | undefined> {
    const result = await db.select().from(miniWebsites).where(eq(miniWebsites.vendorId, vendorId)).limit(1);
    return result[0];
  }

  async getMiniWebsiteBySubdomain(subdomain: string): Promise<MiniWebsite | undefined> {
    // Case-insensitive subdomain lookup
    const normalizedSubdomain = subdomain.toLowerCase();
    const result = await db.select().from(miniWebsites).where(sql`LOWER(${miniWebsites.subdomain}) = ${normalizedSubdomain}`).limit(1);
    return result[0];
  }

  async getMiniWebsite(id: string): Promise<MiniWebsite | undefined> {
    const result = await db.select().from(miniWebsites).where(eq(miniWebsites.id, id)).limit(1);
    return result[0];
  }

  async createMiniWebsite(data: InsertMiniWebsite): Promise<MiniWebsite> {
    const id = `mini-${nanoid()}`;
    const now = new Date();
    
    const miniWebsite: typeof miniWebsites.$inferInsert = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.insert(miniWebsites).values(miniWebsite).returning();
    return result[0];
  }

  async updateMiniWebsite(id: string, data: Partial<InsertMiniWebsite>): Promise<MiniWebsite | null> {
    const updates = {
      ...data,
      updatedAt: new Date(),
    };

    const result = await db
      .update(miniWebsites)
      .set(updates)
      .where(eq(miniWebsites.id, id))
      .returning();

    return result[0] || null;
  }

  async publishMiniWebsite(id: string): Promise<MiniWebsite | null> {
    const updates = {
      status: "published" as const,
      publishedAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .update(miniWebsites)
      .set(updates)
      .where(eq(miniWebsites.id, id))
      .returning();

    return result[0] || null;
  }

  // ========== MINI-WEBSITE REVIEWS ==========
  async createReview(data: InsertMiniWebsiteReview): Promise<MiniWebsiteReview> {
    const id = `mwr-${nanoid()}`;
    const now = new Date();
    
    const review: typeof miniWebsiteReviews.$inferInsert = {
      ...data,
      id,
      createdAt: now,
    };

    const result = await db.insert(miniWebsiteReviews).values(review).returning();
    return result[0];
  }

  async getReviewsByMiniWebsite(miniWebsiteId: string): Promise<MiniWebsiteReview[]> {
    return await db
      .select()
      .from(miniWebsiteReviews)
      .where(eq(miniWebsiteReviews.miniWebsiteId, miniWebsiteId));
  }

  async approveReview(id: string): Promise<MiniWebsiteReview | null> {
    const result = await db
      .update(miniWebsiteReviews)
      .set({ status: "approved" })
      .where(eq(miniWebsiteReviews.id, id))
      .returning();

    return result[0] || null;
  }

  // ========== MINI-WEBSITE LEADS ==========
  async createMiniWebsiteLead(data: InsertMiniWebsiteLead): Promise<MiniWebsiteLead> {
    const id = `mwlead-${nanoid()}`;
    const now = new Date();
    
    const lead: typeof miniWebsiteLeads.$inferInsert = {
      ...data,
      id,
      createdAt: now,
    };

    const result = await db.insert(miniWebsiteLeads).values(lead).returning();
    return result[0];
  }

  async getMiniWebsiteLeadsByVendor(vendorId: string): Promise<MiniWebsiteLead[]> {
    return await db
      .select()
      .from(miniWebsiteLeads)
      .where(eq(miniWebsiteLeads.vendorId, vendorId));
  }

  // ========== CUSTOMERS ==========
  async getCustomersByVendor(vendorId: string, status?: string): Promise<Customer[]> {
    if (status) {
      return await db
        .select()
        .from(customers)
        .where(and(
          eq(customers.vendorId, vendorId),
          eq(customers.status, status)
        ));
    }
    return await db
      .select()
      .from(customers)
      .where(eq(customers.vendorId, vendorId));
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const result = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
    return result[0];
  }

  async getCustomerByPhone(vendorId: string, phone: string): Promise<Customer | undefined> {
    const result = await db
      .select()
      .from(customers)
      .where(and(
        eq(customers.vendorId, vendorId),
        eq(customers.phone, phone)
      ))
      .limit(1);
    return result[0];
  }

  async getCustomerByEmailAndVendor(vendorId: string, email: string): Promise<Customer | undefined> {
    const result = await db
      .select()
      .from(customers)
      .where(and(
        eq(customers.vendorId, vendorId),
        eq(customers.email, email.toLowerCase())
      ))
      .limit(1);
    return result[0];
  }

  async searchCustomers(vendorId: string, query: string): Promise<Customer[]> {
    return await db
      .select()
      .from(customers)
      .where(and(
        eq(customers.vendorId, vendorId),
        or(
          like(customers.name, `%${query}%`),
          like(customers.phone, `%${query}%`),
          like(customers.email, `%${query}%`)
        )
      ));
  }

  async getAllCustomers(filters: Partial<any>): Promise<{ customers: any[]; total: number }> {
    let query = db.select().from(customers);
    const conditions: any[] = [];

    // Filter by vendor IDs (multi-select)
    if (filters.vendorIds && filters.vendorIds.length > 0) {
      const vendorConditions = filters.vendorIds.map((vendorId: string) =>
        eq(customers.vendorId, vendorId)
      );
      if (vendorConditions.length > 0) {
        conditions.push(or(...vendorConditions) as any);
      }
    }

    // Filter by customer type (multi-select)
    if (filters.customerType && filters.customerType.length > 0) {
      const typeConditions = filters.customerType.map((type: string) =>
        eq(customers.customerType, type)
      );
      if (typeConditions.length > 0) {
        conditions.push(or(...typeConditions) as any);
      }
    }

    // Filter by status (multi-select)
    if (filters.status && filters.status.length > 0) {
      const statusConditions = filters.status.map((status: string) =>
        eq(customers.status, status)
      );
      if (statusConditions.length > 0) {
        conditions.push(or(...statusConditions) as any);
      }
    }

    // Filter by membership type (multi-select)
    if (filters.membershipType && filters.membershipType.length > 0) {
      const membershipConditions = filters.membershipType.map((type: string) =>
        eq(customers.membershipType, type)
      );
      if (membershipConditions.length > 0) {
        conditions.push(or(...membershipConditions) as any);
      }
    }

    // Filter by subscription status (multi-select)
    if (filters.subscriptionStatus && filters.subscriptionStatus.length > 0) {
      const subscriptionConditions = filters.subscriptionStatus.map((status: string) =>
        eq(customers.subscriptionStatus, status)
      );
      if (subscriptionConditions.length > 0) {
        conditions.push(or(...subscriptionConditions) as any);
      }
    }

    // Date range filter
    if (filters.dateRange) {
      if (filters.dateRange.start) {
        conditions.push(gte(customers.createdAt, new Date(filters.dateRange.start)));
      }
      if (filters.dateRange.end) {
        conditions.push(lte(customers.createdAt, new Date(filters.dateRange.end)));
      }
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Get all customers
    const allCustomers = await query;
    const total = allCustomers.length;

    // Search filter (applied after fetching for simplicity)
    let filteredCustomers = allCustomers;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredCustomers = allCustomers.filter((customer: any) =>
        customer.name?.toLowerCase().includes(searchLower) ||
        customer.email?.toLowerCase().includes(searchLower) ||
        customer.phone?.includes(filters.search) ||
        customer.company?.toLowerCase().includes(searchLower)
      );
    }

    // Sorting
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    filteredCustomers.sort((a: any, b: any) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (aVal === bVal) return 0;
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Pagination
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    const paginatedCustomers = filteredCustomers.slice(offset, offset + limit);

    return {
      customers: paginatedCustomers,
      total: filteredCustomers.length,
    };
  }

  async getAllOrders(filters: Partial<any>): Promise<{ orders: any[]; total: number }> {
    console.log('🔍 [SupabaseStorage] getAllOrders called with filters:', filters);

    let query = db
      .select({
        order: orders,
        vendor: {
          id: vendors.id,
          businessName: vendors.businessName,
        },
      })
      .from(orders)
      .leftJoin(vendors, eq(orders.vendorId, vendors.id));

    const conditions: any[] = [];

    // Filter by vendor IDs (multi-select)
    if (filters.vendorIds && filters.vendorIds.length > 0) {
      const vendorConditions = filters.vendorIds.map((vendorId: string) =>
        eq(orders.vendorId, vendorId)
      );
      if (vendorConditions.length > 0) {
        conditions.push(or(...vendorConditions) as any);
      }
    }

    // Filter by order status (multi-select)
    if (filters.statuses && filters.statuses.length > 0) {
      const statusConditions = filters.statuses.map((status: string) =>
        eq(orders.status, status)
      );
      if (statusConditions.length > 0) {
        conditions.push(or(...statusConditions) as any);
      }
    }

    // Filter by payment status (multi-select)
    if (filters.paymentStatuses && filters.paymentStatuses.length > 0) {
      const paymentStatusConditions = filters.paymentStatuses.map((status: string) =>
        eq(orders.paymentStatus, status)
      );
      if (paymentStatusConditions.length > 0) {
        conditions.push(or(...paymentStatusConditions) as any);
      }
    }

    // Filter by payment method (multi-select)
    if (filters.paymentMethods && filters.paymentMethods.length > 0) {
      const methodConditions = filters.paymentMethods.map((method: string) =>
        eq(orders.paymentMethod, method)
      );
      if (methodConditions.length > 0) {
        conditions.push(or(...methodConditions) as any);
      }
    }

    // Filter by source (multi-select)
    if (filters.sources && filters.sources.length > 0) {
      const sourceConditions = filters.sources.map((source: string) =>
        eq(orders.source, source)
      );
      if (sourceConditions.length > 0) {
        conditions.push(or(...sourceConditions) as any);
      }
    }

    // Filter by prescription required
    if (filters.prescriptionRequired !== undefined) {
      conditions.push(eq(orders.prescriptionRequired, filters.prescriptionRequired));
    }

    // Date range filter
    if (filters.dateRange) {
      if (filters.dateRange.start) {
        conditions.push(gte(orders.createdAt, new Date(filters.dateRange.start)));
      }
      if (filters.dateRange.end) {
        conditions.push(lte(orders.createdAt, new Date(filters.dateRange.end)));
      }
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Get all orders
    const result = await query;
    const allOrders = result.map((r: any) => ({
      ...r.order,
      vendor: r.vendor,
    }));

    // Search filter (applied after fetching for simplicity)
    let filteredOrders = allOrders;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredOrders = allOrders.filter((order: any) =>
        order.customerName?.toLowerCase().includes(searchLower) ||
        order.customerEmail?.toLowerCase().includes(searchLower) ||
        order.customerPhone?.includes(filters.search) ||
        order.trackingNumber?.toLowerCase().includes(searchLower) ||
        order.id?.toLowerCase().includes(searchLower)
      );
    }

    // Sorting
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    filteredOrders.sort((a: any, b: any) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (aVal === bVal) return 0;
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Pagination
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    const paginatedOrders = filteredOrders.slice(offset, offset + limit);

    // Fetch order items for each order
    const ordersWithItems = await Promise.all(
      paginatedOrders.map(async (order: any) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));
        return {
          ...order,
          orderItems: items,
        };
      })
    );

    console.log(`✅ [SupabaseStorage] Fetched ${ordersWithItems.length} orders of ${filteredOrders.length} total`);

    return {
      orders: ordersWithItems,
      total: filteredOrders.length,
    };
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    console.log('🔧 [SupabaseStorage] createCustomer called with:', JSON.stringify(customer, null, 2));
    const id = `cust-${nanoid()}`;
    const now = new Date();
    
    const newCustomer: typeof customers.$inferInsert = {
      ...customer,
      id,
      createdAt: now,
      updatedAt: now,
    };

    console.log('🔧 [SupabaseStorage] Inserting customer:', JSON.stringify(newCustomer, null, 2));
    
    try {
      const result = await db.insert(customers).values(newCustomer).returning();
      console.log('✅ [SupabaseStorage] Customer inserted successfully:', result[0]?.id);
      return result[0];
    } catch (error: any) {
      console.error('❌ [SupabaseStorage] Failed to insert customer:', error);
      console.error('❌ [SupabaseStorage] Error message:', error.message);
      console.error('❌ [SupabaseStorage] SQL State:', error.code);
      throw error;
    }
  }

  async updateCustomer(id: string, updates: Partial<InsertCustomer>): Promise<Customer | null> {
    const result = await db
      .update(customers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();
    
    return result[0] || null;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const result = await db.delete(customers).where(eq(customers.id, id)).returning();
    return result.length > 0;
  }

  // ========== SUPPLIERS ==========
  async getSuppliersByVendor(vendorId: string, filters?: { status?: string; category?: string }): Promise<Supplier[]> {
    let query = db.select().from(suppliers).where(eq(suppliers.vendorId, vendorId));
    
    if (filters?.status) {
      query = query.where(and(
        eq(suppliers.vendorId, vendorId),
        eq(suppliers.status, filters.status)
      )) as any;
    }
    
    if (filters?.category) {
      query = query.where(and(
        eq(suppliers.vendorId, vendorId),
        eq(suppliers.category, filters.category)
      )) as any;
    }
    
    return await query;
  }

  async getSupplier(id: string): Promise<Supplier | undefined> {
    const result = await db.select().from(suppliers).where(eq(suppliers.id, id)).limit(1);
    return result[0];
  }

  async searchSuppliers(vendorId: string, query: string): Promise<Supplier[]> {
    return await db
      .select()
      .from(suppliers)
      .where(and(
        eq(suppliers.vendorId, vendorId),
        or(
          like(suppliers.name, `%${query}%`),
          like(suppliers.phone, `%${query}%`),
          like(suppliers.email, `%${query}%`)
        )
      ));
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const id = `sup-${nanoid()}`;
    const now = new Date();
    
    const newSupplier: typeof suppliers.$inferInsert = {
      ...supplier,
      id,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.insert(suppliers).values(newSupplier).returning();
    return result[0];
  }

  async updateSupplier(id: string, updates: Partial<InsertSupplier>): Promise<Supplier | null> {
    const result = await db
      .update(suppliers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(suppliers.id, id))
      .returning();
    
    return result[0] || null;
  }

  async deleteSupplier(id: string): Promise<boolean> {
    const result = await db.delete(suppliers).where(eq(suppliers.id, id)).returning();
    return result.length > 0;
  }

  // ========== EXPENSES ==========
  async getExpensesByVendor(vendorId: string, filters?: { 
    category?: string; 
    paymentType?: string; 
    status?: string;
    supplierId?: string;
    department?: string;
    isRecurring?: boolean;
    startDate?: Date;
    endDate?: Date;
    dateFrom?: Date; 
    dateTo?: Date;
  }): Promise<Expense[]> {
    const conditions = [eq(expenses.vendorId, vendorId)];
    
    if (filters?.category) {
      conditions.push(eq(expenses.category, filters.category));
    }
    
    if (filters?.paymentType) {
      conditions.push(eq(expenses.paymentType, filters.paymentType));
    }

    if (filters?.status) {
      conditions.push(eq(expenses.status, filters.status));
    }

    if (filters?.supplierId) {
      conditions.push(eq(expenses.supplierId, filters.supplierId));
    }

    if (filters?.department) {
      conditions.push(eq(expenses.department, filters.department));
    }

    if (filters?.isRecurring !== undefined) {
      conditions.push(eq(expenses.isRecurring, filters.isRecurring));
    }
    
    return await db
      .select()
      .from(expenses)
      .where(and(...conditions))
      .orderBy(desc(expenses.expenseDate));
  }

  async getExpense(id: string): Promise<Expense | undefined> {
    const result = await db.select().from(expenses).where(eq(expenses.id, id)).limit(1);
    return result[0];
  }

  async createExpense(expense: InsertExpense): Promise<Expense> {
    const id = `exp-${nanoid()}`;
    const now = new Date();
    
    const newExpense: typeof expenses.$inferInsert = {
      ...expense,
      id,
      createdAt: now,
    };

    const result = await db.insert(expenses).values(newExpense).returning();
    return result[0];
  }

  async updateExpense(id: string, updates: Partial<InsertExpense>): Promise<Expense | null> {
    const result = await db
      .update(expenses)
      .set(updates)
      .where(eq(expenses.id, id))
      .returning();
    
    return result[0] || null;
  }

  async deleteExpense(id: string): Promise<boolean> {
    const result = await db.delete(expenses).where(eq(expenses.id, id)).returning();
    return result.length > 0;
  }

  async searchExpenses(vendorId: string, query: string): Promise<Expense[]> {
    const loweredQuery = `%${query.toLowerCase()}%`;
    return await db
      .select()
      .from(expenses)
      .where(and(
        eq(expenses.vendorId, vendorId),
        or(
          sql`LOWER(${expenses.title}) LIKE ${loweredQuery}`,
          sql`LOWER(${expenses.category}) LIKE ${loweredQuery}`,
          sql`LOWER(${expenses.paidTo}) LIKE ${loweredQuery}`,
          sql`LOWER(${expenses.description}) LIKE ${loweredQuery}`
        )
      ))
      .orderBy(desc(expenses.createdAt));
  }

  async getRecurringExpenses(vendorId: string): Promise<Expense[]> {
    return await db
      .select()
      .from(expenses)
      .where(and(
        eq(expenses.vendorId, vendorId),
        eq(expenses.isRecurring, true)
      ))
      .orderBy(desc(expenses.expenseDate));
  }

  async getUpcomingRecurringExpenses(vendorId: string, daysAhead: number = 30): Promise<Expense[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return await db
      .select()
      .from(expenses)
      .where(and(
        eq(expenses.vendorId, vendorId),
        eq(expenses.isRecurring, true),
        sql`${expenses.nextDueDate} IS NOT NULL`,
        sql`${expenses.nextDueDate} >= ${now}`,
        sql`${expenses.nextDueDate} <= ${futureDate}`
      ))
      .orderBy(expenses.nextDueDate);
  }

  async getExpensesBySupplier(supplierId: string): Promise<Expense[]> {
    return await db
      .select()
      .from(expenses)
      .where(eq(expenses.supplierId, supplierId))
      .orderBy(desc(expenses.expenseDate));
  }

  // ========== ORDERS ==========
  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return result[0];
  }

  async getOrdersByVendor(vendorId: string, filters?: { status?: string }): Promise<Order[]> {
    if (filters?.status) {
      return await db.select().from(orders).where(and(
        eq(orders.vendorId, vendorId),
        eq(orders.status, filters.status)
      )).orderBy(desc(orders.createdAt));
    }
    return await db.select().from(orders).where(eq(orders.vendorId, vendorId)).orderBy(desc(orders.createdAt));
  }

  // Get orders by vendor and customer - ALWAYS use both for mini website operations
  async getOrdersByVendorAndCustomer(vendorId: string, customerId: string): Promise<Order[]> {
    console.log(`[DATABASE] Fetching orders for vendor ${vendorId} and customer ${customerId}`);
    return await db
      .select()
      .from(orders)
      .where(and(
        eq(orders.vendorId, vendorId),
        eq(orders.customerId, customerId)
      ))
      .orderBy(desc(orders.createdAt));
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.customerId, customerId)).orderBy(desc(orders.createdAt));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = `ord-${nanoid()}`;
    const now = new Date();
    const newOrder: typeof orders.$inferInsert = { ...order, id, createdAt: now, updatedAt: now };
    const result = await db.insert(orders).values(newOrder).returning();
    return result[0];
  }

  async updateOrder(id: string, updates: Partial<InsertOrder>): Promise<Order | null> {
    const result = await db.update(orders).set({ ...updates, updatedAt: new Date() }).where(eq(orders.id, id)).returning();
    return result[0] || null;
  }

  async deleteOrder(id: string): Promise<boolean> {
    const result = await db.delete(orders).where(eq(orders.id, id)).returning();
    return result.length > 0;
  }

  async getOrderItemsByOrder(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const id = `oi-${nanoid()}`;
    const result = await db.insert(orderItems).values({ ...item, id }).returning();
    return result[0];
  }

  // ========== BOOKINGS ==========
  async getBooking(id: string): Promise<Booking | undefined> {
    const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    return result[0];
  }

  async getBookingsByVendor(vendorId: string, status?: string): Promise<Booking[]> {
    if (status) {
      return await db.select().from(bookings).where(and(
        eq(bookings.vendorId, vendorId),
        eq(bookings.status, status)
      )).orderBy(desc(bookings.bookingDate));
    }
    return await db.select().from(bookings).where(eq(bookings.vendorId, vendorId)).orderBy(desc(bookings.bookingDate));
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = `book-${nanoid()}`;
    const result = await db.insert(bookings).values({ ...booking, id, createdAt: new Date() }).returning();
    return result[0];
  }

  async updateBooking(id: string, updates: Partial<InsertBooking>): Promise<Booking | null> {
    const result = await db.update(bookings).set(updates).where(eq(bookings.id, id)).returning();
    return result[0] || null;
  }

  async deleteBooking(id: string): Promise<boolean> {
    const result = await db.delete(bookings).where(eq(bookings.id, id)).returning();
    return result.length > 0;
  }

  // ========== APPOINTMENTS ==========
  async getAppointment(id: string): Promise<Appointment | undefined> {
    const result = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1);
    return result[0];
  }

  async getAppointmentsByVendor(vendorId: string, status?: string): Promise<Appointment[]> {
    if (status) {
      return await db.select().from(appointments).where(and(
        eq(appointments.vendorId, vendorId),
        eq(appointments.status, status)
      )).orderBy(desc(appointments.appointmentDate));
    }
    return await db.select().from(appointments).where(eq(appointments.vendorId, vendorId)).orderBy(desc(appointments.appointmentDate));
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const id = `appt-${nanoid()}`;
    const result = await db.insert(appointments).values({ ...appointment, id, createdAt: new Date() }).returning();
    return result[0];
  }

  async updateAppointment(id: string, updates: Partial<InsertAppointment>): Promise<Appointment | null> {
    const result = await db.update(appointments).set(updates).where(eq(appointments.id, id)).returning();
    return result[0] || null;
  }

  async deleteAppointment(id: string): Promise<boolean> {
    const result = await db.delete(appointments).where(eq(appointments.id, id)).returning();
    return result.length > 0;
  }

  // ========== EMPLOYEES ==========
  async getEmployee(id: string): Promise<Employee | undefined> {
    const result = await db.select().from(employees).where(eq(employees.id, id)).limit(1);
    return result[0];
  }

  async getEmployeesByVendor(vendorId: string, status?: string): Promise<Employee[]> {
    if (status) {
      return await db.select().from(employees).where(and(
        eq(employees.vendorId, vendorId),
        eq(employees.status, status)
      ));
    }
    return await db.select().from(employees).where(eq(employees.vendorId, vendorId));
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const id = `emp-${nanoid()}`;
    const result = await db.insert(employees).values({ ...employee, id, createdAt: new Date() }).returning();
    return result[0];
  }

  async updateEmployee(id: string, updates: Partial<InsertEmployee>): Promise<Employee | null> {
    const result = await db.update(employees).set(updates).where(eq(employees.id, id)).returning();
    return result[0] || null;
  }

  async deleteEmployee(id: string): Promise<boolean> {
    const result = await db.delete(employees).where(eq(employees.id, id)).returning();
    return result.length > 0;
  }

  // ========== TASKS ==========
  async getTask(id: string): Promise<Task | undefined> {
    const result = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, id))
      .limit(1);
    return result[0];
  }

  async getTasksByVendor(vendorId: string, filters?: {
    status?: string;
    priority?: string;
    assignedTo?: string;
  }): Promise<Task[]> {
    const conditions = [eq(tasks.vendorId, vendorId)];
    
    if (filters?.status) {
      conditions.push(eq(tasks.status, filters.status));
    }
    if (filters?.priority) {
      conditions.push(eq(tasks.priority, filters.priority));
    }
    if (filters?.assignedTo) {
      conditions.push(eq(tasks.assignedTo, filters.assignedTo));
    }

    return await db
      .select()
      .from(tasks)
      .where(and(...conditions))
      .orderBy(desc(tasks.dueDate));
  }

  async getTasksByEmployee(employeeId: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.assignedTo, employeeId))
      .orderBy(desc(tasks.dueDate));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const id = `task-${nanoid()}`;
    
    const taskData: any = {
      ...task,
      id,
      tags: task.tags || [],
      attachments: (task as any).attachments || [],
    };
    
    try {
      const result = await db
        .insert(tasks)
        .values(taskData)
        .returning();
      return result[0];
    } catch (error) {
      console.error('[DATABASE] Task insert error:', error);
      console.error('[DATABASE] Task data attempted:', JSON.stringify(taskData, null, 2));
      throw error;
    }
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const result = await db
      .update(tasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return result[0];
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning();
    return result.length > 0;
  }

  // ========== ATTENDANCE ==========
  async getAttendanceByEmployee(employeeId: string, startDate?: Date, endDate?: Date): Promise<Attendance[]> {
    return await db.select().from(attendance).where(eq(attendance.employeeId, employeeId)).orderBy(desc(attendance.date));
  }

  async getAttendanceByVendor(vendorId: string, filters?: {
    startDate?: Date;
    endDate?: Date;
    employeeId?: string;
    status?: string;
  }): Promise<Attendance[]> {
    const conditions = [eq(attendance.vendorId, vendorId)];
    
    if (filters?.employeeId) {
      conditions.push(eq(attendance.employeeId, filters.employeeId));
    }
    if (filters?.status) {
      conditions.push(eq(attendance.status, filters.status));
    }
    if (filters?.startDate) {
      conditions.push(gte(attendance.date, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(attendance.date, filters.endDate));
    }

    return await db
      .select()
      .from(attendance)
      .where(and(...conditions))
      .orderBy(desc(attendance.date));
  }

  async createAttendance(record: InsertAttendance): Promise<Attendance> {
    const id = `att-${nanoid()}`;
    const result = await db.insert(attendance).values({ ...record, id }).returning();
    return result[0];
  }

  async updateAttendance(id: string, updates: Partial<InsertAttendance>): Promise<Attendance | null> {
    const result = await db.update(attendance).set(updates).where(eq(attendance.id, id)).returning();
    return result[0] || null;
  }

  async deleteAttendance(id: string): Promise<void> {
    await db.delete(attendance).where(eq(attendance.id, id));
  }

  // ========== CUSTOMER ATTENDANCE ==========
  async getCustomerAttendance(id: string): Promise<CustomerAttendance | undefined> {
    const result = await db
      .select()
      .from(customerAttendance)
      .where(eq(customerAttendance.id, id))
      .limit(1);
    return result[0];
  }

  async getCustomerAttendanceByCustomer(customerId: string, vendorId: string): Promise<CustomerAttendance[]> {
    return await db
      .select()
      .from(customerAttendance)
      .where(and(
        eq(customerAttendance.customerId, customerId),
        eq(customerAttendance.vendorId, vendorId)
      ))
      .orderBy(desc(customerAttendance.date));
  }

  async getCustomerAttendanceByVendor(vendorId: string, filters?: {
    startDate?: Date;
    endDate?: Date;
    customerId?: string;
    status?: string;
  }): Promise<CustomerAttendance[]> {
    const conditions = [eq(customerAttendance.vendorId, vendorId)];
    
    if (filters?.customerId) {
      conditions.push(eq(customerAttendance.customerId, filters.customerId));
    }
    if (filters?.status) {
      conditions.push(eq(customerAttendance.status, filters.status));
    }
    if (filters?.startDate) {
      conditions.push(gte(customerAttendance.date, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(customerAttendance.date, filters.endDate));
    }

    return await db
      .select()
      .from(customerAttendance)
      .where(and(...conditions))
      .orderBy(desc(customerAttendance.date));
  }

  async createCustomerAttendance(record: InsertCustomerAttendance): Promise<CustomerAttendance> {
    const id = `catt-${nanoid()}`;
    const result = await db
      .insert(customerAttendance)
      .values({ ...record, id })
      .returning();
    return result[0];
  }

  async updateCustomerAttendance(id: string, updates: Partial<InsertCustomerAttendance>): Promise<CustomerAttendance | undefined> {
    const result = await db
      .update(customerAttendance)
      .set(updates)
      .where(eq(customerAttendance.id, id))
      .returning();
    return result[0];
  }

  async deleteCustomerAttendance(id: string): Promise<void> {
    await db.delete(customerAttendance).where(eq(customerAttendance.id, id));
  }

  // ========== LEAVES ==========
  async getLeave(id: string): Promise<Leave | undefined> {
    const result = await db
      .select()
      .from(leaves)
      .where(eq(leaves.id, id))
      .limit(1);
    return result[0];
  }

  async getLeavesByEmployee(employeeId: string, vendorId?: string): Promise<Leave[]> {
    const conditions = [eq(leaves.employeeId, employeeId)];
    
    if (vendorId) {
      conditions.push(eq(leaves.vendorId, vendorId));
    }
    
    return await db
      .select()
      .from(leaves)
      .where(and(...conditions))
      .orderBy(desc(leaves.startDate));
  }

  async getLeavesByVendor(vendorId: string, filters?: {
    startDate?: Date;
    endDate?: Date;
    employeeId?: string;
    status?: string;
    leaveType?: string;
  }): Promise<Leave[]> {
    const conditions = [eq(leaves.vendorId, vendorId)];
    
    if (filters?.employeeId) {
      conditions.push(eq(leaves.employeeId, filters.employeeId));
    }
    if (filters?.status) {
      conditions.push(eq(leaves.status, filters.status));
    }
    if (filters?.leaveType) {
      conditions.push(eq(leaves.leaveType, filters.leaveType));
    }
    if (filters?.startDate) {
      conditions.push(gte(leaves.startDate, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(leaves.endDate, filters.endDate));
    }

    return await db
      .select()
      .from(leaves)
      .where(and(...conditions))
      .orderBy(desc(leaves.startDate));
  }

  async createLeave(leave: InsertLeave): Promise<Leave> {
    const id = `leave-${nanoid()}`;
    
    // Build leave data with proper defaults
    const leaveData: any = {
      ...leave,
      id,
      documents: (leave as any).documents || [], // Ensure documents is an array
      rejectionReason: null, // Default to null
      approvedBy: null, // Default to null
      approvedAt: null, // Default to null
    };
    
    // Override approval fields if status is "approved"
    if (leave.status === "approved" && (leave as any).approvedBy) {
      leaveData.approvedBy = (leave as any).approvedBy;
      leaveData.approvedAt = (leave as any).approvedAt || new Date();
    }
    
    try {
      const result = await db
        .insert(leaves)
        .values(leaveData)
        .returning();
      return result[0];
    } catch (error) {
      console.error('[DATABASE] Leave insert error:', error);
      console.error('[DATABASE] Leave data attempted:', JSON.stringify(leaveData, null, 2));
      throw error;
    }
  }

  async updateLeave(id: string, updates: Partial<Leave>): Promise<Leave | undefined> {
    const result = await db
      .update(leaves)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leaves.id, id))
      .returning();
    return result[0];
  }

  async approveLeave(id: string, approvedBy: string): Promise<Leave | undefined> {
    const result = await db
      .update(leaves)
      .set({ 
        status: "approved", 
        approvedBy, 
        approvedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(leaves.id, id))
      .returning();
    return result[0];
  }

  async rejectLeave(id: string, rejectedBy: string, reason?: string): Promise<Leave | undefined> {
    const result = await db
      .update(leaves)
      .set({ 
        status: "rejected",
        rejectionReason: reason || null,
        updatedAt: new Date()
      })
      .where(eq(leaves.id, id))
      .returning();
    return result[0];
  }

  async deleteLeave(id: string): Promise<void> {
    await db.delete(leaves).where(eq(leaves.id, id));
  }

  // ========== PAYROLL ==========
  async getPayrollByEmployee(employeeId: string): Promise<Payroll[]> {
    return await db.select().from(payroll).where(eq(payroll.employeeId, employeeId)).orderBy(desc(payroll.paymentDate));
  }

  async createPayroll(record: InsertPayroll): Promise<Payroll> {
    const id = `pay-${nanoid()}`;
    const result = await db.insert(payroll).values({ ...record, id, createdAt: new Date() }).returning();
    return result[0];
  }

  async updatePayroll(id: string, updates: Partial<InsertPayroll>): Promise<Payroll | null> {
    const result = await db.update(payroll).set(updates).where(eq(payroll.id, id)).returning();
    return result[0] || null;
  }

  // ========== LEADS ==========
  async getLead(id: string): Promise<Lead | undefined> {
    const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
    return result[0];
  }

  async getLeadsByVendor(vendorId: string, filters?: { status?: string; source?: string }): Promise<Lead[]> {
    const conditions = [eq(leads.vendorId, vendorId)];
    if (filters?.status) conditions.push(eq(leads.status, filters.status));
    if (filters?.source) conditions.push(eq(leads.source, filters.source));
    return await db.select().from(leads).where(and(...conditions)).orderBy(desc(leads.createdAt));
  }

  async getAllLeads(filters: Partial<any>): Promise<{ leads: any[]; total: number }> {
    let query = db.select().from(leads);
    const conditions: any[] = [];

    // Filter by vendor IDs
    if (filters.vendorIds && filters.vendorIds.length > 0) {
      conditions.push(inArray(leads.vendorId, filters.vendorIds));
    }

    // Filter by status (multi-select)
    if (filters.status && filters.status.length > 0) {
      conditions.push(inArray(leads.status, filters.status));
    }

    // Filter by source (multi-select)
    if (filters.source && filters.source.length > 0) {
      conditions.push(inArray(leads.source, filters.source));
    }

    // Filter by priority (multi-select)
    if (filters.priority && filters.priority.length > 0) {
      conditions.push(inArray(leads.priority, filters.priority));
    }

    // Filter by assigned employees (multi-select)
    // Note: assignedEmployeeId can be null, so we need to handle that
    if (filters.assignedEmployeeIds && filters.assignedEmployeeIds.length > 0) {
      const employeeConditions = filters.assignedEmployeeIds.map((empId: string) => 
        eq(leads.assignedEmployeeId, empId)
      );
      if (employeeConditions.length > 0) {
        conditions.push(or(...employeeConditions) as any);
      }
    }

    // Filter by lead score range
    if (filters.leadScoreMin !== undefined) {
      conditions.push(gte(leads.leadScore, filters.leadScoreMin));
    }
    if (filters.leadScoreMax !== undefined) {
      conditions.push(lte(leads.leadScore, filters.leadScoreMax));
    }

    // Filter by date range
    if (filters.dateRange) {
      if (filters.dateRange.start) {
        conditions.push(gte(leads.createdAt, new Date(filters.dateRange.start)));
      }
      if (filters.dateRange.end) {
        conditions.push(lte(leads.createdAt, new Date(filters.dateRange.end)));
      }
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Get total count before pagination
    const allLeads = await query;

    // Category filter (applied after fetching to check vendor category)
    let filteredLeads = allLeads;
    if (filters.categories && Array.isArray(filters.categories) && filters.categories.length > 0) {
      // Fetch all vendors to check their categories
      const allVendors = await db.select().from(vendors);
      const vendorMap = new Map(allVendors.map(v => [v.id, v]));
      
      filteredLeads = filteredLeads.filter((lead: any) => {
        const vendor = vendorMap.get(lead.vendorId);
        if (!vendor) return false;
        
        const vendorCategory = vendor.customCategory || vendor.category;
        return filters.categories!.includes(vendorCategory);
      });
    }

    // Search filter (applied after fetching for simplicity)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredLeads = filteredLeads.filter((lead: any) =>
        lead.name?.toLowerCase().includes(searchLower) ||
        lead.email?.toLowerCase().includes(searchLower) ||
        lead.phone?.includes(filters.search) ||
        lead.company?.toLowerCase().includes(searchLower)
      );
    }

    // Sorting
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    filteredLeads.sort((a: any, b: any) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (aVal === bVal) return 0;
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Pagination
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    const paginatedLeads = filteredLeads.slice(offset, offset + limit);

    return {
      leads: paginatedLeads,
      total: filteredLeads.length,
    };
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const id = `lead-${nanoid()}`;
    const result = await db.insert(leads).values({ ...lead, id, createdAt: new Date(), updatedAt: new Date() }).returning();
    return result[0];
  }

  async updateLead(id: string, updates: Partial<InsertLead>): Promise<Lead | null> {
    const result = await db.update(leads).set({ ...updates, updatedAt: new Date() }).where(eq(leads.id, id)).returning();
    return result[0] || null;
  }

  async deleteLead(id: string): Promise<boolean> {
    const result = await db.delete(leads).where(eq(leads.id, id)).returning();
    return result.length > 0;
  }

  // ========== QUOTATIONS ==========
  async getQuotation(id: string): Promise<Quotation | undefined> {
    const result = await db.select().from(quotations).where(eq(quotations.id, id)).limit(1);
    return result[0];
  }

  async getQuotationsByVendor(vendorId: string, filters?: { status?: string; customerId?: string }): Promise<Quotation[]> {
    const conditions = [eq(quotations.vendorId, vendorId)];
    
    if (filters?.status) {
      conditions.push(eq(quotations.status, filters.status));
    }
    
    if (filters?.customerId) {
      conditions.push(eq(quotations.customerId, filters.customerId));
    }
    
    if (conditions.length > 1) {
      return await db.select().from(quotations).where(and(...conditions)).orderBy(desc(quotations.createdAt));
    }
    
    return await db.select().from(quotations).where(eq(quotations.vendorId, vendorId)).orderBy(desc(quotations.createdAt));
  }

  async createQuotation(quotation: InsertQuotation): Promise<Quotation> {
    const id = `quot-${nanoid()}`;
    const result = await db.insert(quotations).values({ ...quotation, id, createdAt: new Date(), updatedAt: new Date() }).returning();
    return result[0];
  }

  async updateQuotation(id: string, updates: Partial<InsertQuotation>): Promise<Quotation | null> {
    const result = await db.update(quotations).set({ ...updates, updatedAt: new Date() }).where(eq(quotations.id, id)).returning();
    return result[0] || null;
  }

  async deleteQuotation(id: string): Promise<boolean> {
    const result = await db.delete(quotations).where(eq(quotations.id, id)).returning();
    return result.length > 0;
  }

  async generateQuotationNumber(vendorId: string): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // Use timestamp + random string for guaranteed uniqueness
    const timestamp = now.getTime().toString(36);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    // Format: QUO-YYYYMMDD-TIMESTAMP-RANDOM
    return `QUO-${year}${month}${day}-${timestamp}-${random}`;
  }

  async getQuotationItems(quotationId: string): Promise<QuotationItem[]> {
    return await db.select().from(quotationItems).where(eq(quotationItems.quotationId, quotationId));
  }

  async createQuotationItem(item: InsertQuotationItem): Promise<QuotationItem> {
    const id = `qi-${nanoid()}`;
    const result = await db.insert(quotationItems).values({ ...item, id }).returning();
    return result[0];
  }

  // ========== CATEGORIES & MASTER DATA ==========
  async getCategory(id: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return result[0];
  }

  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = `cat-${nanoid()}`;
    const result = await db.insert(categories).values({ ...category, id }).returning();
    return result[0];
  }

  async updateCategory(id: string, updates: Partial<InsertCategory>): Promise<Category | null> {
    const result = await db.update(categories).set(updates).where(eq(categories.id, id)).returning();
    return result[0] || null;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id)).returning();
    return result.length > 0;
  }

  async getCategoriesByCreator(creatorId: string): Promise<Category[]> {
    try {
      // Return global categories (isGlobal = true) + vendor's own categories (createdBy = creatorId)
      const result = await db.select().from(categories).where(
        or(
          eq(categories.isGlobal, true),
          eq(categories.createdBy, creatorId)
        )
      );
      console.log(`[Categories] Found ${result.length} categories for vendor ${creatorId}`);
      return result;
    } catch (error) {
      console.error('[Categories] Error fetching categories:', error);
      throw error;
    }
  }

  async getSubcategory(id: string): Promise<Subcategory | undefined> {
    const result = await db.select().from(subcategories).where(eq(subcategories.id, id)).limit(1);
    return result[0];
  }

  async getSubcategoriesByCategory(categoryId: string): Promise<Subcategory[]> {
    return await db.select().from(subcategories).where(eq(subcategories.categoryId, categoryId));
  }

  async getAllSubcategories(): Promise<Subcategory[]> {
    return await db.select().from(subcategories);
  }

  async createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory> {
    const id = `sub-${nanoid()}`;
    const result = await db.insert(subcategories).values({ ...subcategory, id }).returning();
    return result[0];
  }

  async updateSubcategory(id: string, updates: Partial<InsertSubcategory>): Promise<Subcategory | null> {
    const result = await db.update(subcategories).set(updates).where(eq(subcategories.id, id)).returning();
    return result[0] || null;
  }

  async deleteSubcategory(id: string): Promise<boolean> {
    const result = await db.delete(subcategories).where(eq(subcategories.id, id)).returning();
    return result.length > 0;
  }

  // ========== BRANDS ==========
  async getBrand(id: string): Promise<Brand | undefined> {
    const result = await db.select().from(brands).where(eq(brands.id, id)).limit(1);
    return result[0];
  }

  async getAllBrands(): Promise<Brand[]> {
    return await db.select().from(brands);
  }

  async getBrandsByCategory(categoryId: string): Promise<Brand[]> {
    return await db.select().from(brands).where(eq(brands.categoryId, categoryId));
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const id = `brand-${nanoid()}`;
    const result = await db.insert(brands).values({ ...brand, id }).returning();
    return result[0];
  }

  async updateBrand(id: string, updates: Partial<InsertBrand>): Promise<Brand | null> {
    const result = await db.update(brands).set(updates).where(eq(brands.id, id)).returning();
    return result[0] || null;
  }

  async deleteBrand(id: string): Promise<boolean> {
    const result = await db.delete(brands).where(eq(brands.id, id)).returning();
    return result.length > 0;
  }

  async getSubcategoriesByCreator(creatorId: string, categoryId?: string): Promise<Subcategory[]> {
    try {
      // Get all categories accessible to this vendor (global + vendor-specific)
      const accessibleCategories = await this.getCategoriesByCreator(creatorId);
      const categoryIds = accessibleCategories.map(c => c.id);

      // Build the query
      const result = await db.select().from(subcategories).where(
        or(
          // Global subcategories
          eq(subcategories.isGlobal, true),
          // Vendor's own subcategories
          eq(subcategories.createdBy, creatorId)
        )
      );

      console.log(`[Subcategories] Found ${result.length} subcategories for vendor ${creatorId}`);

      // Filter by categoryId if provided
      if (categoryId) {
        return result.filter(sub => sub.categoryId === categoryId);
      }

      // Filter to only include subcategories under accessible categories
      return result.filter(sub => categoryIds.includes(sub.categoryId));
    } catch (error) {
      console.error('[Subcategories] Error fetching subcategories:', error);
      throw error;
    }
  }

  async getUnit(id: string): Promise<Unit | undefined> {
    const result = await db.select().from(units).where(eq(units.id, id)).limit(1);
    return result[0];
  }

  async getAllUnits(): Promise<Unit[]> {
    return await db.select().from(units);
  }

  async createUnit(unit: InsertUnit): Promise<Unit> {
    const id = `unit-${nanoid()}`;
    const result = await db.insert(units).values({ ...unit, id }).returning();
    return result[0];
  }

  async updateUnit(id: string, updates: Partial<InsertUnit>): Promise<Unit | null> {
    const result = await db.update(units).set(updates).where(eq(units.id, id)).returning();
    return result[0] || null;
  }

  async deleteUnit(id: string): Promise<boolean> {
    const result = await db.delete(units).where(eq(units.id, id)).returning();
    return result.length > 0;
  }

  // ========== MASTER SERVICES ==========
  async getMasterService(id: string): Promise<MasterService | undefined> {
    const result = await db.select().from(masterServices).where(eq(masterServices.id, id)).limit(1);
    return result[0];
  }

  async getAllMasterServices(): Promise<MasterService[]> {
    return await db.select().from(masterServices);
  }

  async getAllCatalogue(filters: Partial<any>): Promise<{ services: any[]; total: number }> {
    try {
      // Fetch all services from vendor catalogues (actual services offered by vendors)
      const allServices = await db.select().from(vendorCatalogues).orderBy(desc(vendorCatalogues.createdAt));
      console.log('[DATABASE] Fetched vendor catalogue services from DB:', allServices.length);
      console.log('[DATABASE] Filters received:', JSON.stringify(filters, null, 2));
      
      // Apply filters in memory for simplicity and reliability
      let filteredServices = allServices;

      // Filter by vendor IDs (multi-select)
      if (filters.vendorIds && filters.vendorIds.length > 0) {
        console.log('[DATABASE] Filtering by vendorIds:', filters.vendorIds);
        filteredServices = filteredServices.filter((service: any) =>
          filters.vendorIds.includes(service.vendorId)
        );
        console.log('[DATABASE] After vendor filter:', filteredServices.length);
      }

      // Filter by category IDs (multi-select)
      if (filters.categoryIds && filters.categoryIds.length > 0) {
        console.log('[DATABASE] Filtering by categoryIds:', filters.categoryIds);
        console.log('[DATABASE] Sample service categoryId:', allServices[0]?.categoryId);
        console.log('[DATABASE] Before category filter:', filteredServices.length);
        filteredServices = filteredServices.filter((service: any) =>
          filters.categoryIds.includes(service.categoryId)
        );
        console.log('[DATABASE] After category filter:', filteredServices.length);
      }

      // Filter by subcategory IDs (multi-select)
      if (filters.subcategoryIds && filters.subcategoryIds.length > 0) {
        filteredServices = filteredServices.filter((service: any) =>
          filters.subcategoryIds.includes(service.subcategoryId)
        );
      }

      // Filter by service type (multi-select)
      if (filters.serviceType && filters.serviceType.length > 0) {
        filteredServices = filteredServices.filter((service: any) =>
          filters.serviceType.includes(service.serviceType)
        );
      }

      // Filter by unit IDs (multi-select)
      if (filters.unitIds && filters.unitIds.length > 0) {
        filteredServices = filteredServices.filter((service: any) =>
          filters.unitIds.includes(service.unitId)
        );
      }

      // Price range filter (vendor catalogues use 'price' field)
      if (filters.priceMin !== undefined) {
        filteredServices = filteredServices.filter((service: any) =>
          (service.price || service.basePrice || 0) >= filters.priceMin
        );
      }
      if (filters.priceMax !== undefined) {
        filteredServices = filteredServices.filter((service: any) =>
          (service.price || service.basePrice || 0) <= filters.priceMax
        );
      }

      // Date range filter
      if (filters.dateRange) {
        if (filters.dateRange.start) {
          const startDate = new Date(filters.dateRange.start);
          filteredServices = filteredServices.filter((service: any) =>
            new Date(service.createdAt) >= startDate
          );
        }
        if (filters.dateRange.end) {
          const endDate = new Date(filters.dateRange.end);
          filteredServices = filteredServices.filter((service: any) =>
            new Date(service.createdAt) <= endDate
          );
        }
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredServices = filteredServices.filter((service: any) =>
          service.name?.toLowerCase().includes(searchLower) ||
          service.category?.toLowerCase().includes(searchLower) ||
          service.subcategory?.toLowerCase().includes(searchLower) ||
          service.description?.toLowerCase().includes(searchLower) ||
          (service.tags && Array.isArray(service.tags) && service.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)))
        );
      }

      // Sorting
      const sortBy = filters.sortBy || 'createdAt';
      const sortOrder = filters.sortOrder || 'desc';
      filteredServices.sort((a: any, b: any) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (aVal === bVal) return 0;
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      // Pagination
      const limit = filters.limit || 50;
      const offset = filters.offset || 0;
      const paginatedServices = filteredServices.slice(offset, offset + limit);

      console.log('[DATABASE] Final results - Total:', filteredServices.length, 'Returned:', paginatedServices.length);

      return {
        services: paginatedServices,
        total: filteredServices.length,
      };
    } catch (error) {
      console.error('Error in getAllCatalogue:', error);
      throw error;
    }
  }

  async getMasterServicesByCategory(category?: string, subcategory?: string): Promise<MasterService[]> {
    const conditions = [];
    if (category) conditions.push(eq(masterServices.category, category));
    if (subcategory) conditions.push(eq(masterServices.subcategory, subcategory));
    if (conditions.length > 0) {
      return await db.select().from(masterServices).where(and(...conditions));
    }
    return await db.select().from(masterServices);
  }

  async searchMasterServices(query: string): Promise<MasterService[]> {
    return await db.select().from(masterServices).where(
      or(
        like(masterServices.name, `%${query}%`),
        like(masterServices.description, `%${query}%`)
      )
    );
  }

  async createMasterService(service: InsertMasterService): Promise<MasterService> {
    const id = `ms-${nanoid()}`;
    const result = await db.insert(masterServices).values({ ...service, id, createdAt: new Date(), updatedAt: new Date() }).returning();
    return result[0];
  }

  async updateMasterService(id: string, updates: Partial<InsertMasterService>): Promise<MasterService | null> {
    const result = await db.update(masterServices).set({ ...updates, updatedAt: new Date() }).where(eq(masterServices.id, id)).returning();
    return result[0] || null;
  }

  async deleteMasterService(id: string): Promise<boolean> {
    const result = await db.delete(masterServices).where(eq(masterServices.id, id)).returning();
    return result.length > 0;
  }

  // ========== VENDOR CATALOGUES (Services) ==========
  async getVendorCatalogue(id: string): Promise<VendorCatalogue | undefined> {
    const result = await db.select().from(vendorCatalogues).where(eq(vendorCatalogues.id, id)).limit(1);
    return result[0];
  }

  async getVendorCatalogueByVendorId(vendorId: string): Promise<VendorCatalogue[]> {
    return await db.select().from(vendorCatalogues).where(eq(vendorCatalogues.vendorId, vendorId));
  }

  async getVendorCataloguesByVendor(vendorId: string): Promise<VendorCatalogue[]> {
    return await db.select().from(vendorCatalogues).where(eq(vendorCatalogues.vendorId, vendorId));
  }

  async createVendorCatalogue(service: InsertVendorCatalogue): Promise<VendorCatalogue> {
    const id = `vc-${nanoid()}`;
    const result = await db.insert(vendorCatalogues).values({ ...service, id, createdAt: new Date(), updatedAt: new Date() }).returning();
    return result[0];
  }

  async updateVendorCatalogue(id: string, updates: Partial<InsertVendorCatalogue>): Promise<VendorCatalogue | null> {
    const result = await db.update(vendorCatalogues).set({ ...updates, updatedAt: new Date() }).where(eq(vendorCatalogues.id, id)).returning();
    return result[0] || null;
  }

  async deleteVendorCatalogue(id: string): Promise<boolean> {
    const result = await db.delete(vendorCatalogues).where(eq(vendorCatalogues.id, id)).returning();
    return result.length > 0;
  }

  // ========== CUSTOM SERVICE REQUESTS ==========
  async getCustomServiceRequest(id: string): Promise<CustomServiceRequest | undefined> {
    const result = await db.select().from(customServiceRequests).where(eq(customServiceRequests.id, id)).limit(1);
    return result[0];
  }

  async getCustomServiceRequestsByVendor(vendorId: string, status?: string): Promise<CustomServiceRequest[]> {
    if (status) {
      return await db.select().from(customServiceRequests).where(and(
        eq(customServiceRequests.vendorId, vendorId),
        eq(customServiceRequests.status, status)
      ));
    }
    return await db.select().from(customServiceRequests).where(eq(customServiceRequests.vendorId, vendorId));
  }

  async getAllCustomServiceRequests(status?: string): Promise<CustomServiceRequest[]> {
    if (status) {
      return await db.select().from(customServiceRequests).where(eq(customServiceRequests.status, status));
    }
    return await db.select().from(customServiceRequests);
  }

  async createCustomServiceRequest(request: InsertCustomServiceRequest): Promise<CustomServiceRequest> {
    const id = `csr-${nanoid()}`;
    const result = await db.insert(customServiceRequests).values({ ...request, id, createdAt: new Date() }).returning();
    return result[0];
  }

  async updateCustomServiceRequest(id: string, updates: Partial<InsertCustomServiceRequest>): Promise<CustomServiceRequest | null> {
    const result = await db.update(customServiceRequests).set(updates).where(eq(customServiceRequests.id, id)).returning();
    return result[0] || null;
  }

  async deleteCustomServiceRequest(id: string): Promise<boolean> {
    const result = await db.delete(customServiceRequests).where(eq(customServiceRequests.id, id)).returning();
    return result.length > 0;
  }

  // ========== MASTER PRODUCTS ==========
  async getMasterProduct(id: string): Promise<MasterProduct | undefined> {
    const result = await db.select().from(masterProducts).where(eq(masterProducts.id, id)).limit(1);
    return result[0];
  }

  async getAllMasterProducts(isUniversal?: boolean): Promise<MasterProduct[]> {
    if (isUniversal !== undefined) {
      return await db.select().from(masterProducts).where(eq(masterProducts.isUniversal, isUniversal));
    }
    return await db.select().from(masterProducts);
  }

  async getMasterProductsByCategory(category: string, subcategory?: string): Promise<MasterProduct[]> {
    if (subcategory) {
      return await db.select().from(masterProducts)
        .where(and(
          eq(masterProducts.category, category),
          eq(masterProducts.subcategory, subcategory)
        ));
    }
    return await db.select().from(masterProducts).where(eq(masterProducts.category, category));
  }

  async searchMasterProducts(query: string): Promise<MasterProduct[]> {
    const lowerQuery = query.toLowerCase();
    const allProducts = await db.select().from(masterProducts);
    return allProducts.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(lowerQuery)) ||
      p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async createMasterProduct(product: InsertMasterProduct): Promise<MasterProduct> {
    const id = `mp-${nanoid()}`;
    const result = await db.insert(masterProducts).values({ 
      ...product, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    }).returning();
    return result[0];
  }

  async updateMasterProduct(id: string, updates: Partial<InsertMasterProduct>): Promise<MasterProduct | undefined> {
    const result = await db.update(masterProducts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(masterProducts.id, id))
      .returning();
    return result[0];
  }

  async deleteMasterProduct(id: string): Promise<boolean> {
    const result = await db.delete(masterProducts).where(eq(masterProducts.id, id)).returning();
    return result.length > 0;
  }

  // ========== VENDOR PRODUCTS ==========
  async getVendorProduct(id: string): Promise<VendorProduct | undefined> {
    const result = await db.select().from(vendorProducts).where(eq(vendorProducts.id, id)).limit(1);
    return result[0];
  }

  async getVendorProductsByVendor(vendorId: string, filters?: { category?: string; status?: string }): Promise<VendorProduct[]> {
    const conditions = [eq(vendorProducts.vendorId, vendorId)];
    if (filters?.category) conditions.push(eq(vendorProducts.category, filters.category));
    if (filters?.status) conditions.push(eq(vendorProducts.status, filters.status));
    return await db.select().from(vendorProducts).where(and(...conditions));
  }

  async getAllProducts(filters: Partial<any>): Promise<{ products: any[]; total: number }> {
    try {
      // Fetch all products from vendor products
      const allProducts = await db.select().from(vendorProducts).orderBy(desc(vendorProducts.createdAt));
      console.log('[DATABASE] Fetched vendor products from DB:', allProducts.length);
      console.log('[DATABASE] Filters received:', JSON.stringify(filters, null, 2));
      
      // Apply filters in memory for simplicity and reliability
      let filteredProducts = allProducts;

      // Filter by vendor IDs (multi-select)
      if (filters.vendorIds && filters.vendorIds.length > 0) {
        console.log('[DATABASE] Filtering by vendorIds:', filters.vendorIds);
        filteredProducts = filteredProducts.filter((product: any) =>
          filters.vendorIds.includes(product.vendorId)
        );
        console.log('[DATABASE] After vendor filter:', filteredProducts.length);
      }

      // Filter by category IDs (multi-select)
      if (filters.categoryIds && filters.categoryIds.length > 0) {
        console.log('[DATABASE] Filtering by categoryIds:', filters.categoryIds);
        filteredProducts = filteredProducts.filter((product: any) =>
          filters.categoryIds.includes(product.categoryId)
        );
        console.log('[DATABASE] After category filter:', filteredProducts.length);
      }

      // Filter by subcategory IDs (multi-select)
      if (filters.subcategoryIds && filters.subcategoryIds.length > 0) {
        filteredProducts = filteredProducts.filter((product: any) =>
          filters.subcategoryIds.includes(product.subcategoryId)
        );
      }

      // Filter by isActive status
      if (filters.isActive !== undefined) {
        filteredProducts = filteredProducts.filter((product: any) =>
          product.isActive === filters.isActive
        );
      }

      // Filter by requiresPrescription
      if (filters.requiresPrescription !== undefined) {
        filteredProducts = filteredProducts.filter((product: any) =>
          product.requiresPrescription === filters.requiresPrescription
        );
      }

      // Price range filter
      if (filters.priceMin !== undefined) {
        filteredProducts = filteredProducts.filter((product: any) =>
          product.price >= filters.priceMin
        );
      }
      if (filters.priceMax !== undefined) {
        filteredProducts = filteredProducts.filter((product: any) =>
          product.price <= filters.priceMax
        );
      }

      // Stock range filter
      if (filters.stockMin !== undefined) {
        filteredProducts = filteredProducts.filter((product: any) =>
          product.stock >= filters.stockMin
        );
      }
      if (filters.stockMax !== undefined) {
        filteredProducts = filteredProducts.filter((product: any) =>
          product.stock <= filters.stockMax
        );
      }

      // Date range filter
      if (filters.dateRange) {
        if (filters.dateRange.start) {
          const startDate = new Date(filters.dateRange.start);
          filteredProducts = filteredProducts.filter((product: any) =>
            new Date(product.createdAt) >= startDate
          );
        }
        if (filters.dateRange.end) {
          const endDate = new Date(filters.dateRange.end);
          filteredProducts = filteredProducts.filter((product: any) =>
            new Date(product.createdAt) <= endDate
          );
        }
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter((product: any) =>
          product.name?.toLowerCase().includes(searchLower) ||
          product.category?.toLowerCase().includes(searchLower) ||
          product.subcategory?.toLowerCase().includes(searchLower) ||
          product.brand?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          (product.tags && Array.isArray(product.tags) && product.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)))
        );
      }

      // Sorting
      const sortBy = filters.sortBy || 'createdAt';
      const sortOrder = filters.sortOrder || 'desc';
      filteredProducts.sort((a: any, b: any) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (aVal === bVal) return 0;
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      // Pagination
      const limit = filters.limit || 50;
      const offset = filters.offset || 0;
      const paginatedProducts = filteredProducts.slice(offset, offset + limit);

      console.log('[DATABASE] Final results - Total:', filteredProducts.length, 'Returned:', paginatedProducts.length);

      return {
        products: paginatedProducts,
        total: filteredProducts.length,
      };
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      throw error;
    }
  }

  async createVendorProduct(product: InsertVendorProduct): Promise<VendorProduct> {
    const id = `vp-${nanoid()}`;
    const result = await db.insert(vendorProducts).values({ ...product, id, createdAt: new Date(), updatedAt: new Date() }).returning();
    return result[0];
  }

  async updateVendorProduct(id: string, updates: Partial<InsertVendorProduct>): Promise<VendorProduct | null> {
    const result = await db.update(vendorProducts).set({ ...updates, updatedAt: new Date() }).where(eq(vendorProducts.id, id)).returning();
    return result[0] || null;
  }

  async deleteVendorProduct(id: string): Promise<boolean> {
    const result = await db.delete(vendorProducts).where(eq(vendorProducts.id, id)).returning();
    return result.length > 0;
  }

  async getVendorProductsByMasterProduct(masterProductId: string): Promise<VendorProduct[]> {
    return await db.select().from(vendorProducts).where(eq(vendorProducts.masterProductId, masterProductId));
  }

  // ========== STOCK MOVEMENTS ==========
  async recordStockIn(vendorProductId: string, quantity: number, data: Partial<InsertStockMovement>, userId?: string): Promise<{ movement: StockMovement; newStock: number }> {
    // Get current product
    const product = await this.getVendorProduct(vendorProductId);
    if (!product) throw new Error("Product not found");

    const previousStock = product.stock;
    const newStock = previousStock + quantity;

    // Create stock movement record
    const movementId = `sm-${nanoid()}`;
    const movement = await db.insert(stockMovements).values({
      id: movementId,
      vendorId: product.vendorId,
      vendorProductId,
      movementType: 'in',
      quantity,
      previousStock,
      newStock,
      reason: data.reason || 'Stock In',
      supplier: data.supplier,
      userId,
      referenceType: data.referenceType,
      referenceId: data.referenceId,
      createdAt: new Date(),
    } as any).returning();

    // Update product stock
    await db.update(vendorProducts)
      .set({ stock: newStock, updatedAt: new Date() })
      .where(eq(vendorProducts.id, vendorProductId));

    return { movement: movement[0], newStock };
  }

  async recordStockOut(vendorProductId: string, quantity: number, data: Partial<InsertStockMovement>, userId?: string): Promise<{ movement: StockMovement; newStock: number }> {
    // Get current product
    const product = await this.getVendorProduct(vendorProductId);
    if (!product) throw new Error("Product not found");

    const previousStock = product.stock;
    const newStock = Math.max(0, previousStock - quantity);

    // Create stock movement record
    const movementId = `sm-${nanoid()}`;
    const movement = await db.insert(stockMovements).values({
      id: movementId,
      vendorId: product.vendorId,
      vendorProductId,
      movementType: 'out',
      quantity: -quantity, // Negative for stock out
      previousStock,
      newStock,
      reason: data.reason || 'Stock Out',
      supplier: data.supplier,
      userId,
      referenceType: data.referenceType,
      referenceId: data.referenceId,
      createdAt: new Date(),
    } as any).returning();

    // Update product stock
    await db.update(vendorProducts)
      .set({ stock: newStock, updatedAt: new Date() })
      .where(eq(vendorProducts.id, vendorProductId));

    return { movement: movement[0], newStock };
  }

  async getStockMovementsByVendor(vendorId: string, filters?: { productId?: string; movementType?: string; startDate?: Date; endDate?: Date }): Promise<StockMovement[]> {
    const conditions = [eq(stockMovements.vendorId, vendorId)];
    
    if (filters?.productId) conditions.push(eq(stockMovements.vendorProductId, filters.productId));
    if (filters?.movementType) conditions.push(eq(stockMovements.movementType, filters.movementType));
    
    const results = await db.select().from(stockMovements).where(and(...conditions)).orderBy(desc(stockMovements.createdAt));
    
    // Apply date filters in memory if provided
    let movements = results;
    if (filters?.startDate) {
      movements = movements.filter(m => new Date(m.createdAt) >= filters.startDate!);
    }
    if (filters?.endDate) {
      movements = movements.filter(m => new Date(m.createdAt) <= filters.endDate!);
    }
    
    return movements;
  }

  async getStockMovementsByProduct(vendorProductId: string): Promise<StockMovement[]> {
    return await db.select().from(stockMovements).where(eq(stockMovements.vendorProductId, vendorProductId)).orderBy(desc(stockMovements.createdAt));
  }

  // ========== LEDGER & TRANSACTIONS ==========
  async getLedgerTransaction(id: string): Promise<LedgerTransaction | undefined> {
    const result = await db.select().from(ledgerTransactions).where(eq(ledgerTransactions.id, id)).limit(1);
    return result[0];
  }

  async getLedgerTransactionsByVendor(vendorId: string, filters?: { 
    customerId?: string; 
    type?: string; 
    category?: string; 
    paymentMethod?: string; 
    startDate?: Date; 
    endDate?: Date 
  }): Promise<LedgerTransaction[]> {
    const conditions = [eq(ledgerTransactions.vendorId, vendorId)];
    
    if (filters?.customerId) conditions.push(eq(ledgerTransactions.customerId, filters.customerId));
    if (filters?.type) conditions.push(eq(ledgerTransactions.type, filters.type));
    if (filters?.category) conditions.push(eq(ledgerTransactions.category, filters.category));
    if (filters?.paymentMethod) conditions.push(eq(ledgerTransactions.paymentMethod, filters.paymentMethod));
    if (filters?.startDate) conditions.push(gte(ledgerTransactions.transactionDate, filters.startDate));
    if (filters?.endDate) conditions.push(lte(ledgerTransactions.transactionDate, filters.endDate));
    
    console.log(`[DB] getLedgerTransactionsByVendor - Applying ${conditions.length} conditions:`, filters);
    
    return await db.select().from(ledgerTransactions).where(and(...conditions)).orderBy(desc(ledgerTransactions.transactionDate));
  }

  async createLedgerTransaction(transaction: InsertLedgerTransaction): Promise<LedgerTransaction> {
    const id = `lt-${nanoid()}`;
    
    // Create a clean transaction object, excluding supplierId if null to avoid column not found errors
    // The supplierId column may not exist in older database schemas
    const cleanTransaction: any = { ...transaction, id, createdAt: new Date() };
    
    // Remove supplierId if it's null/undefined to prevent insertion errors when column doesn't exist
    if (cleanTransaction.supplierId === null || cleanTransaction.supplierId === undefined) {
      delete cleanTransaction.supplierId;
    }
    
    try {
      const result = await db.insert(ledgerTransactions).values(cleanTransaction).returning();
      return result[0];
    } catch (error: any) {
      // If supplier_id column doesn't exist, retry without it
      if (error?.code === '42703' && error?.message?.includes('supplier_id')) {
        console.log('[DB] supplier_id column not found, retrying without it');
        delete cleanTransaction.supplierId;
        const result = await db.insert(ledgerTransactions).values(cleanTransaction).returning();
        return result[0];
      }
      throw error;
    }
  }

  async getLedgerTransactionsByCustomer(customerId: string): Promise<LedgerTransaction[]> {
    return await db.select().from(ledgerTransactions)
      .where(eq(ledgerTransactions.customerId, customerId))
      .orderBy(desc(ledgerTransactions.transactionDate));
  }

  async getLedgerTransactionsBySupplier(supplierId: string): Promise<LedgerTransaction[]> {
    try {
      return await db.select().from(ledgerTransactions)
        .where(eq(ledgerTransactions.supplierId, supplierId))
        .orderBy(desc(ledgerTransactions.transactionDate));
    } catch (error: any) {
      // If supplier_id column doesn't exist, return empty array
      if (error?.code === '42703' && error?.message?.includes('supplier_id')) {
        console.log('[DB] supplier_id column not found, returning empty array');
        return [];
      }
      throw error;
    }
  }

  async updateLedgerTransaction(id: string, updates: Partial<InsertLedgerTransaction>): Promise<LedgerTransaction | undefined> {
    // Create clean updates object, excluding supplierId if null to avoid column not found errors
    const cleanUpdates: any = { ...updates, updatedAt: new Date() };
    
    // Remove supplierId if it's null/undefined to prevent update errors when column doesn't exist
    if (cleanUpdates.supplierId === null || cleanUpdates.supplierId === undefined) {
      delete cleanUpdates.supplierId;
    }
    
    try {
      const result = await db.update(ledgerTransactions)
        .set(cleanUpdates)
        .where(eq(ledgerTransactions.id, id))
        .returning();
      return result[0];
    } catch (error: any) {
      // If supplier_id column doesn't exist, retry without it
      if (error?.code === '42703' && error?.message?.includes('supplier_id')) {
        console.log('[DB] supplier_id column not found, retrying update without it');
        delete cleanUpdates.supplierId;
        const result = await db.update(ledgerTransactions)
          .set(cleanUpdates)
          .where(eq(ledgerTransactions.id, id))
          .returning();
        return result[0];
      }
      throw error;
    }
  }

  async deleteLedgerTransaction(id: string): Promise<boolean> {
    const result = await db.delete(ledgerTransactions).where(eq(ledgerTransactions.id, id)).returning();
    return result.length > 0;
  }

  async getLedgerSummary(vendorId: string, filters?: { 
    customerId?: string; 
    type?: string; 
    category?: string; 
    paymentMethod?: string; 
    startDate?: Date; 
    endDate?: Date 
  }): Promise<{
    totalIn: number;
    totalOut: number;
    balance: number;
    transactionCount: number;
  }> {
    const conditions = [eq(ledgerTransactions.vendorId, vendorId)];
    
    if (filters?.customerId) conditions.push(eq(ledgerTransactions.customerId, filters.customerId));
    if (filters?.type) conditions.push(eq(ledgerTransactions.type, filters.type));
    if (filters?.category) conditions.push(eq(ledgerTransactions.category, filters.category));
    if (filters?.paymentMethod) conditions.push(eq(ledgerTransactions.paymentMethod, filters.paymentMethod));
    if (filters?.startDate) conditions.push(gte(ledgerTransactions.transactionDate, filters.startDate));
    if (filters?.endDate) conditions.push(lte(ledgerTransactions.transactionDate, filters.endDate));
    
    console.log(`[DB] getLedgerSummary - Applying ${conditions.length} conditions:`, filters);
    
    const transactions = await db.select().from(ledgerTransactions).where(and(...conditions));
    
    console.log(`[DB] getLedgerSummary - Found ${transactions.length} transactions`);
    
    // For balance calculation, exclude transactions marked with excludeFromBalance
    // This excludes POS paid amounts (product exchange) from net balance
    const balanceTransactions = transactions.filter(t => !t.excludeFromBalance);
    
    // Total in/out shows all transactions including excluded ones
    const totalIn = transactions.filter(t => t.type === 'in').reduce((sum, t) => sum + t.amount, 0);
    const totalOut = transactions.filter(t => t.type === 'out').reduce((sum, t) => sum + t.amount, 0);
    
    // Balance only counts non-excluded transactions
    const balanceIn = balanceTransactions.filter(t => t.type === 'in').reduce((sum, t) => sum + t.amount, 0);
    const balanceOut = balanceTransactions.filter(t => t.type === 'out').reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIn,
      totalOut,
      balance: balanceIn - balanceOut,
      transactionCount: transactions.length,
    };
  }

  async getCustomerLedgerBalance(customerId: string): Promise<number> {
    const transactions = await this.getLedgerTransactionsByCustomer(customerId);
    // Customer balance calculation - Khatabook style:
    // "You Gave" (type=out) = Credit given = Customer owes you MORE
    // "You Got" (type=in) = Payment received = Customer owes you LESS
    // Balance = totalGave - totalGot = what customer owes you
    // Positive = "You will GET", Negative = "You will GIVE"
    // POS paid amounts (excludeFromBalance=true) are excluded
    const balanceTransactions = transactions.filter(t => !t.excludeFromBalance);
    const totalGave = balanceTransactions.filter(t => t.type === 'out').reduce((sum, t) => sum + t.amount, 0);
    const totalGot = balanceTransactions.filter(t => t.type === 'in').reduce((sum, t) => sum + t.amount, 0);
    return totalGave - totalGot;
  }

  async getRecurringLedgerTransactions(vendorId: string): Promise<LedgerTransaction[]> {
    return await db.select().from(ledgerTransactions)
      .where(and(
        eq(ledgerTransactions.vendorId, vendorId),
        eq(ledgerTransactions.isRecurring, true)
      ))
      .orderBy(desc(ledgerTransactions.transactionDate));
  }

  // ========== BILLS (POS) ==========
  async getBill(id: string): Promise<Bill | undefined> {
    const result = await db.select().from(bills).where(eq(bills.id, id)).limit(1);
    return result[0];
  }

  async getBillsByVendor(vendorId: string, filters?: { status?: string }): Promise<Bill[]> {
    if (filters?.status) {
      return await db.select().from(bills).where(and(
        eq(bills.vendorId, vendorId),
        eq(bills.status, filters.status)
      )).orderBy(desc(bills.billDate));
    }
    return await db.select().from(bills).where(eq(bills.vendorId, vendorId)).orderBy(desc(bills.billDate));
  }

  async createBill(bill: InsertBill): Promise<Bill> {
    const id = `bill-${nanoid()}`;
    const result = await db.insert(bills).values({ ...bill, id, createdAt: new Date() }).returning();
    return result[0];
  }

  async updateBill(id: string, updates: Partial<InsertBill>): Promise<Bill | null> {
    const result = await db.update(bills).set(updates).where(eq(bills.id, id)).returning();
    return result[0] || null;
  }

  async getBillItems(billId: string): Promise<BillItem[]> {
    return await db.select().from(billItems).where(eq(billItems.billId, billId));
  }

  async createBillItem(item: InsertBillItem): Promise<BillItem> {
    const id = `bi-${nanoid()}`;
    const result = await db.insert(billItems).values({ ...item, id }).returning();
    return result[0];
  }

  // ========== CUSTOMER VISITS & TASKS ==========
  async getCustomerVisit(id: string): Promise<CustomerVisit | undefined> {
    const result = await db.select().from(customerVisits).where(eq(customerVisits.id, id)).limit(1);
    return result[0];
  }

  async getCustomerVisitsByCustomer(customerId: string): Promise<CustomerVisit[]> {
    return await db.select().from(customerVisits).where(eq(customerVisits.customerId, customerId)).orderBy(desc(customerVisits.visitDate));
  }

  async getCustomerVisitsByVendor(vendorId: string): Promise<CustomerVisit[]> {
    return await db.select().from(customerVisits).where(eq(customerVisits.vendorId, vendorId)).orderBy(desc(customerVisits.visitDate));
  }

  async createCustomerVisit(visit: InsertCustomerVisit): Promise<CustomerVisit> {
    const id = `cv-${nanoid()}`;
    const result = await db.insert(customerVisits).values({ ...visit, id, createdAt: new Date() }).returning();
    return result[0];
  }

  async updateCustomerVisit(id: string, updates: Partial<InsertCustomerVisit>): Promise<CustomerVisit | null> {
    const result = await db.update(customerVisits).set(updates).where(eq(customerVisits.id, id)).returning();
    return result[0] || null;
  }

  async getCustomerTask(id: string): Promise<CustomerTask | undefined> {
    const result = await db.select().from(customerTasks).where(eq(customerTasks.id, id)).limit(1);
    return result[0];
  }

  async getCustomerTasksByCustomer(customerId: string): Promise<CustomerTask[]> {
    return await db.select().from(customerTasks).where(eq(customerTasks.customerId, customerId));
  }

  async createCustomerTask(task: InsertCustomerTask): Promise<CustomerTask> {
    const id = `ct-${nanoid()}`;
    const result = await db.insert(customerTasks).values({ ...task, id, createdAt: new Date() }).returning();
    return result[0];
  }

  async updateCustomerTask(id: string, updates: Partial<InsertCustomerTask>): Promise<CustomerTask | null> {
    const result = await db.update(customerTasks).set(updates).where(eq(customerTasks.id, id)).returning();
    return result[0] || null;
  }

  async deleteCustomerTask(id: string): Promise<boolean> {
    const result = await db.delete(customerTasks).where(eq(customerTasks.id, id)).returning();
    return result.length > 0;
  }

  // ========== SUPPLIER PAYMENTS ==========
  async getSupplierPayment(id: string): Promise<SupplierPayment | undefined> {
    const result = await db.select().from(supplierPayments).where(eq(supplierPayments.id, id)).limit(1);
    return result[0];
  }

  async getSupplierPaymentsBySupplier(supplierId: string): Promise<SupplierPayment[]> {
    return await db.select().from(supplierPayments).where(eq(supplierPayments.supplierId, supplierId)).orderBy(desc(supplierPayments.paymentDate));
  }

  async getSupplierPaymentsByVendor(vendorId: string): Promise<SupplierPayment[]> {
    return await db.select().from(supplierPayments).where(eq(supplierPayments.vendorId, vendorId)).orderBy(desc(supplierPayments.paymentDate));
  }

  async createSupplierPayment(payment: InsertSupplierPayment): Promise<SupplierPayment> {
    const id = `sp-${nanoid()}`;
    const result = await db.insert(supplierPayments).values({ ...payment, id, createdAt: new Date() }).returning();
    return result[0];
  }

  async updateSupplierPayment(id: string, updates: Partial<InsertSupplierPayment>): Promise<SupplierPayment | null> {
    const result = await db.update(supplierPayments).set(updates).where(eq(supplierPayments.id, id)).returning();
    return result[0] || null;
  }

  async deleteSupplierPayment(id: string): Promise<boolean> {
    const result = await db.delete(supplierPayments).where(eq(supplierPayments.id, id)).returning();
    return result.length > 0;
  }

  // ========== POS BILLS ==========
  async getBill(id: string): Promise<Bill | undefined> {
    const result = await db.select().from(bills).where(eq(bills.id, id)).limit(1);
    return result[0];
  }

  async getBillsByVendor(vendorId: string, status?: string): Promise<Bill[]> {
    let query = db.select().from(bills).where(eq(bills.vendorId, vendorId));
    if (status) {
      query = query.where(eq(bills.status, status)) as any;
    }
    return await query.orderBy(desc(bills.billDate));
  }

  async getBillsByCustomer(customerId: string): Promise<Bill[]> {
    return await db.select().from(bills).where(eq(bills.customerId, customerId)).orderBy(desc(bills.billDate));
  }

  async createBill(bill: InsertBill): Promise<Bill> {
    const id = `bill-${nanoid()}`;
    const result = await db.insert(bills).values({ ...bill, id, createdAt: new Date() }).returning();
    return result[0];
  }

  async updateBill(id: string, updates: Partial<InsertBill>): Promise<Bill | null> {
    const result = await db.update(bills).set({ ...updates, updatedAt: new Date() }).where(eq(bills.id, id)).returning();
    return result[0] || null;
  }

  async deleteBill(id: string): Promise<boolean> {
    // Delete all related bill items first
    await db.delete(billItems).where(eq(billItems.billId, id));
    // Delete all related bill payments
    await db.delete(billPayments).where(eq(billPayments.billId, id));
    // Delete the bill
    const result = await db.delete(bills).where(eq(bills.id, id)).returning();
    return result.length > 0;
  }

  // ========== BILL ITEMS ==========
  async getBillItem(id: string): Promise<BillItem | undefined> {
    const result = await db.select().from(billItems).where(eq(billItems.id, id)).limit(1);
    return result[0];
  }

  async getBillItems(billId: string): Promise<BillItem[]> {
    return await db.select().from(billItems).where(eq(billItems.billId, billId));
  }

  async addBillItem(item: InsertBillItem): Promise<BillItem> {
    return await this.createBillItem(item);
  }

  async createBillItem(item: InsertBillItem): Promise<BillItem> {
    const id = `bi-${nanoid()}`;
    const result = await db.insert(billItems).values({ ...item, id }).returning();
    return result[0];
  }

  async updateBillItem(id: string, updates: Partial<InsertBillItem>): Promise<BillItem | undefined> {
    const result = await db.update(billItems).set(updates).where(eq(billItems.id, id)).returning();
    return result[0];
  }

  async deleteBillItem(id: string): Promise<void> {
    await db.delete(billItems).where(eq(billItems.id, id));
  }

  async removeBillItem(id: string): Promise<void> {
    await this.deleteBillItem(id);
  }

  // ========== BILL PAYMENTS ==========
  async getBillPayment(id: string): Promise<BillPayment | undefined> {
    const result = await db.select().from(billPayments).where(eq(billPayments.id, id)).limit(1);
    return result[0];
  }

  async getBillPayments(billId: string): Promise<BillPayment[]> {
    return await db.select().from(billPayments).where(eq(billPayments.billId, billId)).orderBy(desc(billPayments.paymentDate));
  }

  async recordPayment(payment: InsertBillPayment): Promise<BillPayment> {
    return await this.createBillPayment(payment);
  }

  async createBillPayment(payment: InsertBillPayment): Promise<BillPayment> {
    const id = `bp-${nanoid()}`;
    const result = await db.insert(billPayments).values({ ...payment, id, createdAt: new Date() }).returning();
    return result[0];
  }

  async updateBillPayment(id: string, updates: Partial<InsertBillPayment>): Promise<BillPayment | null> {
    const result = await db.update(billPayments).set(updates).where(eq(billPayments.id, id)).returning();
    return result[0] || null;
  }

  async deleteBillPayment(id: string): Promise<boolean> {
    const result = await db.delete(billPayments).where(eq(billPayments.id, id)).returning();
    return result.length > 0;
  }

  // ========== NOTIFICATIONS ==========
  async getNotification(id: string): Promise<Notification | undefined> {
    const result = await db.select().from(notifications).where(eq(notifications.id, id)).limit(1);
    return result[0];
  }

  async getNotificationsByVendor(vendorId: string, isRead?: boolean): Promise<Notification[]> {
    let query = db.select().from(notifications).where(eq(notifications.vendorId, vendorId));
    if (isRead !== undefined) {
      query = query.where(eq(notifications.read, isRead)) as any;
    }
    return await query.orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = `notif-${nanoid()}`;
    const result = await db.insert(notifications).values({ ...notification, id, createdAt: new Date() }).returning();
    return result[0];
  }

  async markNotificationAsRead(id: string): Promise<Notification | null> {
    const result = await db.update(notifications).set({ read: true }).where(eq(notifications.id, id)).returning();
    return result[0] || null;
  }

  async updateNotification(id: string, updates: Partial<Notification>): Promise<Notification | null> {
    const result = await db.update(notifications).set(updates).where(eq(notifications.id, id)).returning();
    return result[0] || null;
  }

  async markAllVendorNotificationsAsRead(vendorId: string): Promise<void> {
    await db.update(notifications).set({ read: true }).where(eq(notifications.vendorId, vendorId));
  }

  async deleteNotification(id: string): Promise<boolean> {
    const result = await db.delete(notifications).where(eq(notifications.id, id)).returning();
    return result.length > 0;
  }

  // ========== STOCK ALERTS ==========
  async getStockAlertsByVendor(vendorId: string, filters?: { status?: string; alertType?: string }): Promise<StockAlert[]> {
    let query = db.select().from(stockAlerts).where(eq(stockAlerts.vendorId, vendorId));
    
    if (filters?.status) {
      query = query.where(eq(stockAlerts.status, filters.status)) as any;
    }
    if (filters?.alertType) {
      query = query.where(eq(stockAlerts.alertType, filters.alertType)) as any;
    }
    
    return await query.orderBy(desc(stockAlerts.createdAt));
  }

  async createStockAlert(alert: InsertStockAlert): Promise<StockAlert> {
    const id = `alert-${nanoid()}`;
    const result = await db.insert(stockAlerts).values({ 
      ...alert, 
      id, 
      createdAt: new Date(),
      itemType: alert.itemType || 'product',
    }).returning();
    return result[0];
  }

  async updateStockAlert(id: string, updates: Partial<StockAlert>): Promise<StockAlert | null> {
    const result = await db.update(stockAlerts).set(updates).where(eq(stockAlerts.id, id)).returning();
    return result[0] || null;
  }

  async acknowledgeStockAlert(id: string, userId: string): Promise<StockAlert | null> {
    const result = await db.update(stockAlerts).set({ 
      status: 'acknowledged', 
      acknowledgedBy: userId, 
      acknowledgedAt: new Date() 
    }).where(eq(stockAlerts.id, id)).returning();
    return result[0] || null;
  }

  async resolveStockAlert(id: string): Promise<StockAlert | null> {
    const result = await db.update(stockAlerts).set({ 
      status: 'resolved', 
      resolvedAt: new Date() 
    }).where(eq(stockAlerts.id, id)).returning();
    return result[0] || null;
  }

  async dismissStockAlert(id: string): Promise<StockAlert | null> {
    const result = await db.update(stockAlerts).set({ 
      status: 'dismissed'
    }).where(eq(stockAlerts.id, id)).returning();
    return result[0] || null;
  }

  // ========== ORDER ITEMS ==========
  async getOrderItem(id: string): Promise<OrderItem | undefined> {
    const result = await db.select().from(orderItems).where(eq(orderItems.id, id)).limit(1);
    return result[0];
  }

  async getOrderItemsByOrder(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const id = `oi-${nanoid()}`;
    const result = await db.insert(orderItems).values({ ...item, id, createdAt: new Date() }).returning();
    return result[0];
  }

  async updateOrderItem(id: string, updates: Partial<InsertOrderItem>): Promise<OrderItem | null> {
    const result = await db.update(orderItems).set(updates).where(eq(orderItems.id, id)).returning();
    return result[0] || null;
  }

  async deleteOrderItem(id: string): Promise<boolean> {
    const result = await db.delete(orderItems).where(eq(orderItems.id, id)).returning();
    return result.length > 0;
  }

  // ========== QUOTATION ITEMS ==========
  async getQuotationItem(id: string): Promise<QuotationItem | undefined> {
    const result = await db.select().from(quotationItems).where(eq(quotationItems.id, id)).limit(1);
    return result[0];
  }

  async getQuotationItemsByQuotation(quotationId: string): Promise<QuotationItem[]> {
    return await db.select().from(quotationItems).where(eq(quotationItems.quotationId, quotationId));
  }

  async createQuotationItem(item: InsertQuotationItem): Promise<QuotationItem> {
    const id = `qi-${nanoid()}`;
    const result = await db.insert(quotationItems).values({ ...item, id }).returning();
    return result[0];
  }

  async updateQuotationItem(id: string, updates: Partial<InsertQuotationItem>): Promise<QuotationItem | null> {
    const result = await db.update(quotationItems).set(updates).where(eq(quotationItems.id, id)).returning();
    return result[0] || null;
  }

  async deleteQuotationItem(id: string): Promise<boolean> {
    const result = await db.delete(quotationItems).where(eq(quotationItems.id, id)).returning();
    return result.length > 0;
  }

  // ========== COUPONS ==========
  async getCoupon(id: string): Promise<Coupon | undefined> {
    const result = await db.select().from(coupons).where(eq(coupons.id, id)).limit(1);
    return result[0];
  }

  async getCouponByCode(code: string, vendorId: string): Promise<Coupon | undefined> {
    const result = await db.select().from(coupons)
      .where(and(eq(coupons.code, code), eq(coupons.vendorId, vendorId)))
      .limit(1);
    return result[0];
  }

  async getCouponsByVendor(vendorId: string, status?: string): Promise<Coupon[]> {
    let query = db.select().from(coupons).where(eq(coupons.vendorId, vendorId));
    if (status) {
      query = query.where(eq(coupons.status, status)) as any;
    }
    return await query.orderBy(desc(coupons.createdAt));
  }

  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    const id = `coupon-${nanoid()}`;
    const result = await db.insert(coupons).values({ 
      ...coupon, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    }).returning();
    return result[0];
  }

  async updateCoupon(id: string, updates: Partial<InsertCoupon>): Promise<Coupon | null> {
    const result = await db.update(coupons)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(coupons.id, id))
      .returning();
    return result[0] || null;
  }

  async deleteCoupon(id: string): Promise<boolean> {
    // Delete all related coupon usages first
    await db.delete(couponUsages).where(eq(couponUsages.couponId, id));
    // Delete the coupon
    const result = await db.delete(coupons).where(eq(coupons.id, id)).returning();
    return result.length > 0;
  }

  // ========== COUPON USAGES ==========
  async getCouponUsage(id: string): Promise<CouponUsage | undefined> {
    const result = await db.select().from(couponUsages).where(eq(couponUsages.id, id)).limit(1);
    return result[0];
  }

  async getCouponUsagesByCoupon(couponId: string): Promise<CouponUsage[]> {
    return await db.select().from(couponUsages)
      .where(eq(couponUsages.couponId, couponId))
      .orderBy(desc(couponUsages.usedAt));
  }

  async getCouponUsagesByCustomer(customerId: string): Promise<CouponUsage[]> {
    return await db.select().from(couponUsages)
      .where(eq(couponUsages.customerId, customerId))
      .orderBy(desc(couponUsages.usedAt));
  }

  async createCouponUsage(usage: InsertCouponUsage): Promise<CouponUsage> {
    const id = `cu-${nanoid()}`;
    const result = await db.insert(couponUsages).values({ 
      ...usage, 
      id, 
      usedAt: new Date() 
    }).returning();
    
    // Increment the used count on the coupon
    await db.update(coupons)
      .set({ usedCount: sql`${coupons.usedCount} + 1` })
      .where(eq(coupons.id, usage.couponId));
    
    return result[0];
  }

  // ========== DEMO REQUESTS ==========
  async getDemoRequest(id: string): Promise<DemoRequest | undefined> {
    try {
      const result = await db.select().from(demoRequests).where(eq(demoRequests.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error('[DATABASE] Error fetching demo request:', error);
      return undefined;
    }
  }

  async getAllDemoRequests(filters?: { status?: string }): Promise<DemoRequest[]> {
    try {
      console.log('[DATABASE] Fetching demo requests with filters:', filters);
      let query = db.select().from(demoRequests);
      
      const conditions: any[] = [];
      if (filters?.status) {
        conditions.push(eq(demoRequests.status, filters.status));
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }
      
      const results = await query.orderBy(desc(demoRequests.createdAt));
      console.log(`[DATABASE] Found ${results.length} demo requests`);
      return results;
    } catch (error) {
      console.error('[DATABASE] Error fetching demo requests:', error);
      return [];
    }
  }

  async createDemoRequest(insertData: InsertDemoRequest): Promise<DemoRequest> {
    console.log('[DATABASE] Creating demo request:', insertData.name, insertData.phone);
    const id = `demo-${nanoid()}`;
    const now = new Date();
    
    const newRequest: typeof demoRequests.$inferInsert = {
      id,
      name: insertData.name,
      phone: insertData.phone,
      email: insertData.email || null,
      businessName: insertData.businessName || null,
      source: insertData.source || "landing_page",
      status: insertData.status || "new",
      notes: insertData.notes || null,
      scheduledAt: insertData.scheduledAt || null,
      completedAt: insertData.completedAt || null,
      createdAt: now,
      updatedAt: now,
    };
    
    const result = await db.insert(demoRequests).values(newRequest).returning();
    console.log('[DATABASE] Demo request created:', result[0]?.id);
    return result[0];
  }

  async updateDemoRequest(id: string, updates: Partial<InsertDemoRequest>): Promise<DemoRequest | undefined> {
    try {
      console.log('[DATABASE] Updating demo request:', id);
      const result = await db
        .update(demoRequests)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(demoRequests.id, id))
        .returning();
      
      return result[0];
    } catch (error) {
      console.error('[DATABASE] Error updating demo request:', error);
      return undefined;
    }
  }

  async deleteDemoRequest(id: string): Promise<boolean> {
    try {
      console.log('[DATABASE] Deleting demo request:', id);
      await db.delete(demoRequests).where(eq(demoRequests.id, id));
      return true;
    } catch (error) {
      console.error('[DATABASE] Error deleting demo request:', error);
      return false;
    }
  }

  // ========== GREETING TEMPLATES ==========
  async getGreetingTemplate(id: string): Promise<GreetingTemplate | undefined> {
    const result = await db.select().from(greetingTemplates).where(eq(greetingTemplates.id, id)).limit(1);
    return result[0];
  }

  async getAllGreetingTemplates(filters?: {
    status?: string;
    occasions?: string[];
    offerTypes?: string[];
    industries?: string[];
    isTrending?: boolean;
  }): Promise<GreetingTemplate[]> {
    try {
      console.log('📝 [SupabaseStorage] getAllGreetingTemplates called with filters:', filters);

      let query = db.select().from(greetingTemplates);

      // Fetch all templates from database
      const allTemplates = await query;
      console.log(`📝 [SupabaseStorage] Fetched ${allTemplates.length} templates from database`);

      // Apply in-memory filtering for complex array operations
      let filteredTemplates = allTemplates;

      if (filters?.status) {
        filteredTemplates = filteredTemplates.filter(t => t.status === filters.status);
      }

      if (filters?.isTrending !== undefined) {
        filteredTemplates = filteredTemplates.filter(t => t.isTrending === filters.isTrending);
      }

      // Array overlap filters
      if (filters?.occasions && filters.occasions.length > 0) {
        filteredTemplates = filteredTemplates.filter(t => 
          t.occasions.some(o => filters.occasions!.includes(o))
        );
      }

      if (filters?.offerTypes && filters.offerTypes.length > 0) {
        filteredTemplates = filteredTemplates.filter(t => 
          t.offerTypes.some(o => filters.offerTypes!.includes(o))
        );
      }

      if (filters?.industries && filters.industries.length > 0) {
        filteredTemplates = filteredTemplates.filter(t => 
          t.industries.some(i => filters.industries!.includes(i))
        );
      }

      // Sort by: 1) Trending first, 2) Newest first (createdAt), 3) Download count
      filteredTemplates.sort((a, b) => {
        // Trending templates come first
        if (a.isTrending && !b.isTrending) return -1;
        if (!a.isTrending && b.isTrending) return 1;
        
        // Then sort by creation date (newest first)
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        if (dateB !== dateA) return dateB - dateA;
        
        // Finally by download count
        return b.downloadCount - a.downloadCount;
      });

      console.log(`📝 [SupabaseStorage] Returning ${filteredTemplates.length} filtered templates`);
      return filteredTemplates;
    } catch (error) {
      console.error('❌ [SupabaseStorage] Error fetching greeting templates:', error);
      // Return empty array instead of throwing to prevent 500 errors
      return [];
    }
  }

  async searchGreetingTemplates(query: string, filters?: {
    occasions?: string[];
    offerTypes?: string[];
    industries?: string[];
  }): Promise<GreetingTemplate[]> {
    const allTemplates = await db.select().from(greetingTemplates)
      .where(
        or(
          like(greetingTemplates.title, `%${query}%`),
          like(greetingTemplates.description, `%${query}%`)
        )
      );

    let filteredTemplates = allTemplates;

    if (filters?.occasions && filters.occasions.length > 0) {
      filteredTemplates = filteredTemplates.filter(t => 
        t.occasions.some(o => filters.occasions!.includes(o))
      );
    }

    if (filters?.offerTypes && filters.offerTypes.length > 0) {
      filteredTemplates = filteredTemplates.filter(t => 
        t.offerTypes.some(o => filters.offerTypes!.includes(o))
      );
    }

    if (filters?.industries && filters.industries.length > 0) {
      filteredTemplates = filteredTemplates.filter(t => 
        t.industries.some(i => filters.industries!.includes(i))
      );
    }

    return filteredTemplates;
  }

  async createGreetingTemplate(template: InsertGreetingTemplate): Promise<GreetingTemplate> {
    try {
      console.log('📝 [SupabaseStorage] createGreetingTemplate called');
      const id = `gt-${nanoid()}`;
      const now = new Date();
      
      const newTemplate: typeof greetingTemplates.$inferInsert = {
        ...template,
        id,
        createdAt: now,
        updatedAt: now,
      };

      const result = await db.insert(greetingTemplates).values(newTemplate).returning();
      console.log('✅ [SupabaseStorage] Greeting template created:', result[0]?.id);
      return result[0];
    } catch (error) {
      console.error('❌ [SupabaseStorage] Error creating greeting template:', error);
      throw error;
    }
  }

  async updateGreetingTemplate(id: string, updates: Partial<InsertGreetingTemplate>): Promise<GreetingTemplate | undefined> {
    console.log('📝 [SupabaseStorage] updateGreetingTemplate called for:', id);
    const result = await db
      .update(greetingTemplates)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(greetingTemplates.id, id))
      .returning();
    
    console.log('✅ [SupabaseStorage] Greeting template updated:', result[0]?.id);
    return result[0];
  }

  async deleteGreetingTemplate(id: string): Promise<boolean> {
    console.log('📝 [SupabaseStorage] deleteGreetingTemplate called for:', id);
    const result = await db.delete(greetingTemplates).where(eq(greetingTemplates.id, id));
    console.log('✅ [SupabaseStorage] Greeting template deleted');
    return true;
  }

  async incrementTemplateDownload(id: string): Promise<void> {
    await db
      .update(greetingTemplates)
      .set({ 
        downloadCount: sql`${greetingTemplates.downloadCount} + 1` 
      })
      .where(eq(greetingTemplates.id, id));
  }

  async incrementTemplateShare(id: string): Promise<void> {
    await db
      .update(greetingTemplates)
      .set({ 
        shareCount: sql`${greetingTemplates.shareCount} + 1` 
      })
      .where(eq(greetingTemplates.id, id));
  }

  // ========== ADDITIONAL SERVICES ==========
  async getAllAdditionalServices(activeOnly: boolean = false): Promise<AdditionalService[]> {
    if (activeOnly) {
      return await db.select().from(additionalServices).where(eq(additionalServices.isActive, true));
    }
    return await db.select().from(additionalServices);
  }

  async getAdditionalService(id: string): Promise<AdditionalService | undefined> {
    const result = await db.select().from(additionalServices).where(eq(additionalServices.id, id)).limit(1);
    return result[0];
  }

  async createAdditionalService(service: InsertAdditionalService): Promise<AdditionalService> {
    const result = await db.insert(additionalServices).values(service).returning();
    return result[0];
  }

  async updateAdditionalService(id: string, updates: Partial<InsertAdditionalService>): Promise<AdditionalService | undefined> {
    const result = await db
      .update(additionalServices)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(additionalServices.id, id))
      .returning();
    return result[0];
  }

  async deleteAdditionalService(id: string): Promise<boolean> {
    const result = await db.delete(additionalServices).where(eq(additionalServices.id, id)).returning();
    return result.length > 0;
  }

  // ========== ADDITIONAL SERVICE INQUIRIES ==========
  async getAllAdditionalServiceInquiries(): Promise<AdditionalServiceInquiry[]> {
    return await db.select().from(additionalServiceInquiries).orderBy(desc(additionalServiceInquiries.createdAt));
  }

  async getAdditionalServiceInquiry(id: string): Promise<AdditionalServiceInquiry | undefined> {
    const result = await db.select().from(additionalServiceInquiries).where(eq(additionalServiceInquiries.id, id)).limit(1);
    return result[0];
  }

  async createAdditionalServiceInquiry(inquiry: InsertAdditionalServiceInquiry): Promise<AdditionalServiceInquiry> {
    const result = await db.insert(additionalServiceInquiries).values(inquiry).returning();
    return result[0];
  }

  async updateAdditionalServiceInquiry(id: string, updates: Partial<InsertAdditionalServiceInquiry>): Promise<AdditionalServiceInquiry | undefined> {
    const result = await db
      .update(additionalServiceInquiries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(additionalServiceInquiries.id, id))
      .returning();
    return result[0];
  }

  async getGreetingTemplateUsage(id: string): Promise<GreetingTemplateUsage | undefined> {
    const result = await db.select().from(greetingTemplateUsage).where(eq(greetingTemplateUsage.id, id)).limit(1);
    return result[0];
  }

  async getGreetingTemplateUsagesByTemplate(templateId: string): Promise<GreetingTemplateUsage[]> {
    return db.select().from(greetingTemplateUsage).where(eq(greetingTemplateUsage.templateId, templateId));
  }

  async getGreetingTemplateUsagesByVendor(vendorId: string): Promise<GreetingTemplateUsage[]> {
    return db.select().from(greetingTemplateUsage).where(eq(greetingTemplateUsage.vendorId, vendorId));
  }

  async createGreetingTemplateUsage(usage: InsertGreetingTemplateUsage): Promise<GreetingTemplateUsage> {
    const id = `gtu-${nanoid()}`;
    const now = new Date();
    
    const newUsage: typeof greetingTemplateUsage.$inferInsert = {
      ...usage,
      id,
      createdAt: now,
    };

    const result = await db.insert(greetingTemplateUsage).values(newUsage).returning();
    return result[0];
  }

  // ========== SUBSCRIPTION PLANS ==========
  async getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined> {
    try {
      console.log(`[DATABASE] Fetching subscription plan ${id} from subscription_plans table`);
      const result = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id)).limit(1);
      const plan = result[0];

      if (!plan) {
        console.warn(`[WARNING] Subscription plan ${id} not found in database`);
      } else {
        console.log(`[DATABASE] Found subscription plan: ${plan.displayName}`);
      }

      return plan;
    } catch (error: any) {
      console.error(`[DATABASE ERROR] Failed to fetch subscription plan ${id}:`, error);
      console.error('[DATABASE ERROR] Details:', {
        message: error?.message,
        detail: error?.detail,
        code: error?.code,
        stack: error?.stack,
      });
      throw error;
    }
  }

  async getAllSubscriptionPlans(activeOnly: boolean = false): Promise<SubscriptionPlan[]> {
    try {
      console.log('[DATABASE] Fetching subscription plans from subscription_plans table');

      let result: SubscriptionPlan[];
      if (activeOnly) {
        result = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));
      } else {
        result = await db.select().from(subscriptionPlans);
      }

      // Sort by display order, then by created date (newest first)
      result.sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      console.log(`[DATABASE] Fetched ${result.length} subscription plans from database`);

      if (result.length === 0) {
        console.warn('[WARNING] No subscription plans found in database');
        console.warn('[SUGGESTION] Create plans via POST /api/subscription-plans or check if subscription_plans table has data');
      }

      return result;
    } catch (error: any) {
      console.error('[DATABASE ERROR] Failed to fetch subscription plans:', error);
      console.error('[DATABASE ERROR] Details:', {
        message: error?.message,
        detail: error?.detail,
        code: error?.code,
        stack: error?.stack,
      });
      throw error;
    }
  }

  async createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    try {
      console.log('[DATABASE] Creating subscription plan:', plan.name);
      const result = await db.insert(subscriptionPlans).values(plan).returning();
      console.log('[DATABASE] Subscription plan created:', result[0].id);
      return result[0];
    } catch (error: any) {
      console.error('[DATABASE ERROR] Failed to create subscription plan:', error);
      throw error;
    }
  }

  async updateSubscriptionPlan(id: string, updates: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan | undefined> {
    try {
      const result = await db
        .update(subscriptionPlans)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(subscriptionPlans.id, id))
        .returning();
      return result[0];
    } catch (error: any) {
      console.error('[DATABASE ERROR] Failed to update subscription plan:', error);
      throw error;
    }
  }

  async deleteSubscriptionPlan(id: string): Promise<boolean> {
    try {
      const result = await db.delete(subscriptionPlans).where(eq(subscriptionPlans.id, id)).returning();
      return result.length > 0;
    } catch (error: any) {
      console.error('[DATABASE ERROR] Failed to delete subscription plan:', error);
      throw error;
    }
  }

  // ========== VENDOR SUBSCRIPTIONS ==========
  async getVendorSubscription(id: string): Promise<VendorSubscription | undefined> {
    try {
      // Direct fetch - bypass RLS
      const result = await db.select().from(vendorSubscriptions).where(eq(vendorSubscriptions.id, id)).limit(1);
      return result[0];
    } catch (error: any) {
      console.error('[DATABASE ERROR] Failed to fetch vendor subscription:', error);
      throw error;
    }
  }

  async getVendorSubscriptionByVendor(vendorId: string): Promise<VendorSubscription | undefined> {
    try {
      // Direct fetch - get all subscriptions for this vendor and pick the best one
      const allSubs = await db.select().from(vendorSubscriptions)
        .where(eq(vendorSubscriptions.vendorId, vendorId))
        .orderBy(desc(vendorSubscriptions.updatedAt));
      
      if (allSubs.length === 0) return undefined;
      
      // Prioritize: active > pending > others, then by most recent
      const activeSub = allSubs.find(s => s.status === 'active' && s.paymentStatus === 'completed');
      if (activeSub) return activeSub;
      
      // Return most recently updated subscription
      return allSubs[0];
    } catch (error: any) {
      console.error('[DATABASE ERROR] Failed to fetch vendor subscription by vendor:', error);
      throw error;
    }
  }

  async getAllVendorSubscriptions(status?: string): Promise<VendorSubscription[]> {
    try {
      console.log('[DATABASE] Fetching vendor subscriptions from vendor_subscriptions table', status ? `with status: ${status}` : '');
      if (status) {
        console.log('[SQL] SELECT * FROM vendor_subscriptions WHERE status = $1');
        const result = await db.select().from(vendorSubscriptions).where(eq(vendorSubscriptions.status, status));
        console.log('[DATABASE] Fetched', result.length, 'vendor subscriptions from database');
        
        // If no subscriptions found, return dummy data
        if (result.length === 0) {
          console.log('[DATABASE] No subscriptions found, generating dummy subscriptions...');
          return await this.generateDummySubscriptions(status);
        }
        return result;
      } else {
        console.log('[SQL] SELECT * FROM vendor_subscriptions');
        const result = await db.select().from(vendorSubscriptions);
        console.log('[DATABASE] Fetched', result.length, 'vendor subscriptions from database');
        
        // If no subscriptions found, return dummy data
        if (result.length === 0) {
          console.log('[DATABASE] No subscriptions found, generating dummy subscriptions...');
          return await this.generateDummySubscriptions();
        }
        return result;
      }
    } catch (error: any) {
      console.error('[DATABASE ERROR] Failed to fetch vendor subscriptions:', error);
      console.error('[DATABASE ERROR] Details:', {
        message: error?.message,
        detail: error?.detail,
        code: error?.code,
        stack: error?.stack,
      });
      throw error;
    }
  }

  private async generateDummySubscriptions(statusFilter?: string): Promise<VendorSubscription[]> {
    try {
      // Get all vendors
      const allVendors = await db.select().from(vendors);
      if (allVendors.length === 0) {
        console.log('[DUMMY] No vendors found, returning empty array');
        return [];
      }

      // Get or create a default plan
      let defaultPlan = await db.select().from(subscriptionPlans).limit(1);
      if (defaultPlan.length === 0) {
        console.log('[DUMMY] Creating default subscription plan...');
        const newPlan = await db.insert(subscriptionPlans).values({
          name: 'Basic Plan',
          displayName: 'Basic',
          description: 'Basic subscription plan',
          price: 999,
          billingInterval: 'monthly',
          maxOrders: 100,
          maxBookings: 50,
          maxAppointments: 50,
          maxProducts: 100,
          maxEmployees: 5,
          maxCustomers: 200,
          isActive: true,
        }).returning();
        defaultPlan = newPlan;
      }

      const planId = defaultPlan[0].id;
      const statuses = ['active', 'trial', 'active', 'active', 'trial'];
      const dummySubscriptions: VendorSubscription[] = [];

      for (let i = 0; i < allVendors.length; i++) {
        const vendor = allVendors[i];
        const status = statuses[i % statuses.length];
        
        // Skip if status filter doesn't match
        if (statusFilter && status !== statusFilter) {
          continue;
        }

        const now = new Date();
        const startDate = new Date(now);
        const currentPeriodStart = new Date(now);
        const currentPeriodEnd = new Date(now);
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
        const trialEndDate = status === 'trial' ? new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) : null;

        // Create subscription in database
        const subscription = await db.insert(vendorSubscriptions).values({
          vendorId: vendor.id,
          planId: planId,
          status: status,
          startDate: startDate,
          currentPeriodStart: currentPeriodStart,
          currentPeriodEnd: currentPeriodEnd,
          trialEndDate: trialEndDate,
          autoRenew: true,
        }).returning();

        dummySubscriptions.push(subscription[0]);
        console.log(`[DUMMY] Created ${status} subscription for vendor: ${vendor.businessName}`);
      }

      console.log(`[DUMMY] Generated ${dummySubscriptions.length} dummy subscriptions`);
      return dummySubscriptions;
    } catch (error: any) {
      console.error('[DUMMY ERROR] Failed to generate dummy subscriptions:', error);
      return [];
    }
  }

  async createVendorSubscription(subscription: InsertVendorSubscription): Promise<VendorSubscription> {
    try {
      const result = await db.insert(vendorSubscriptions).values(subscription).returning();
      return result[0];
    } catch (error: any) {
      console.error('[DATABASE ERROR] Failed to create vendor subscription:', error);
      throw error;
    }
  }

  async updateVendorSubscription(id: string, updates: Partial<InsertVendorSubscription>): Promise<VendorSubscription | undefined> {
    try {
      const result = await db
        .update(vendorSubscriptions)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(vendorSubscriptions.id, id))
        .returning();
      return result[0];
    } catch (error: any) {
      console.error('[DATABASE ERROR] Failed to update vendor subscription:', error);
      throw error;
    }
  }

  async cancelVendorSubscription(id: string): Promise<VendorSubscription | undefined> {
    try {
      const result = await db
        .update(vendorSubscriptions)
        .set({ 
          status: 'canceled',
          canceledAt: new Date(),
          updatedAt: new Date() 
        })
        .where(eq(vendorSubscriptions.id, id))
        .returning();
      return result[0];
    } catch (error: any) {
      console.error('[DATABASE ERROR] Failed to cancel vendor subscription:', error);
      throw error;
    }
  }

  // ========== PASSWORD RESET TOKENS ==========

  async createPasswordResetToken(data: InsertPasswordResetToken): Promise<PasswordResetToken> {
    try {
      // First, invalidate any existing tokens for this email
      await db
        .update(passwordResetTokens)
        .set({ used: true })
        .where(and(
          eq(passwordResetTokens.email, data.email.toLowerCase()),
          eq(passwordResetTokens.used, false)
        ));

      // Create new token
      const result = await db
        .insert(passwordResetTokens)
        .values({
          ...data,
          email: data.email.toLowerCase(),
        })
        .returning();
      console.log('[DATABASE] Created password reset token for:', data.email);
      return result[0];
    } catch (error: any) {
      console.error('[DATABASE ERROR] Failed to create password reset token:', error);
      throw error;
    }
  }

  async getPasswordResetToken(email: string, otp: string): Promise<PasswordResetToken | undefined> {
    try {
      const result = await db
        .select()
        .from(passwordResetTokens)
        .where(and(
          eq(passwordResetTokens.email, email.toLowerCase()),
          eq(passwordResetTokens.otp, otp),
          eq(passwordResetTokens.used, false)
        ))
        .orderBy(desc(passwordResetTokens.createdAt))
        .limit(1);
      return result[0];
    } catch (error: any) {
      console.error('[DATABASE ERROR] Failed to get password reset token:', error);
      throw error;
    }
  }

  async verifyPasswordResetToken(email: string, otp: string): Promise<PasswordResetToken | undefined> {
    try {
      const result = await db
        .update(passwordResetTokens)
        .set({ verified: true })
        .where(and(
          eq(passwordResetTokens.email, email.toLowerCase()),
          eq(passwordResetTokens.otp, otp),
          eq(passwordResetTokens.used, false)
        ))
        .returning();
      return result[0];
    } catch (error: any) {
      console.error('[DATABASE ERROR] Failed to verify password reset token:', error);
      throw error;
    }
  }

  async markPasswordResetTokenUsed(email: string, otp: string): Promise<boolean> {
    try {
      const result = await db
        .update(passwordResetTokens)
        .set({ used: true })
        .where(and(
          eq(passwordResetTokens.email, email.toLowerCase()),
          eq(passwordResetTokens.otp, otp)
        ))
        .returning();
      return result.length > 0;
    } catch (error: any) {
      console.error('[DATABASE ERROR] Failed to mark password reset token as used:', error);
      throw error;
    }
  }

  async cleanupExpiredTokens(): Promise<number> {
    try {
      const result = await db
        .delete(passwordResetTokens)
        .where(lte(passwordResetTokens.expiresAt, new Date()))
        .returning();
      if (result.length > 0) {
        console.log('[DATABASE] Cleaned up', result.length, 'expired password reset tokens');
      }
      return result.length;
    } catch (error: any) {
      console.error('[DATABASE ERROR] Failed to cleanup expired tokens:', error);
      return 0;
    }
  }
}

export const supabaseStorage = new SupabaseStorage();
