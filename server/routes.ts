import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { nanoid } from "nanoid";
import { storage } from "./storage";
import { signUp, signIn, signOut, getCurrentUser } from "./auth";
// import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage"; // Object Storage requires bucket setup - using local data URLs for now
import {
  insertCategorySchema,
  insertSubcategorySchema,
  insertBrandSchema,
  insertUnitSchema,
  insertMasterServiceSchema,
  insertVendorCatalogueSchema,
  insertCustomServiceRequestSchema,
  insertBookingSchema,
  insertAppointmentSchema,
  insertEmployeeSchema,
  insertTaskSchema,
  insertAttendanceSchema,
  insertCustomerAttendanceSchema,
  insertLeaveSchema,
  insertLeaveBalanceSchema,
  insertPayrollSchema,
  insertHolidaySchema,
  insertCouponSchema,
  insertVendorSchema,
  insertMasterProductSchema,
  insertVendorProductSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertInventoryLocationSchema,
  insertStockBatchSchema,
  insertStockMovementSchema,
  insertStockConfigSchema,
  insertStockAlertSchema,
  insertGreetingTemplateSchema,
  insertGreetingTemplateUsageSchema,
  insertBillSchema,
  insertBillItemSchema,
  insertBillPaymentSchema,
  INDUSTRY_CATEGORIES,
  adminLeadsFilterSchema,
  adminCustomersFilterSchema,
} from "@shared/schema";
import Razorpay from "razorpay";
import { insertVendorSubscriptionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  console.log('[ROUTES] Starting route registration...');

  // Initialize subscription plans on startup
  try {
    console.log('[INIT] Checking subscription plans...');
    const existingPlans = await storage.getAllSubscriptionPlans();
    const proExists = existingPlans.some(p => p.name.toLowerCase() === 'pro');
    const freeExists = existingPlans.some(p => p.name.toLowerCase() === 'free');
    
    if (!freeExists) {
      console.log('[INIT] Creating Free plan...');
      await storage.createSubscriptionPlan({
        name: "Free",
        displayName: "Free Plan",
        description: "Basic features - Customers, Leads, Suppliers",
        price: "0",
        currency: "INR",
        billingInterval: "month",
        maxServices: 10,
        maxProducts: 10,
        maxEmployees: 2,
        maxCustomers: 100,
        maxOrders: 50,
        maxBookings: 20,
        maxAppointments: 20,
        maxStorageGB: 1,
        hasAdvancedAnalytics: false,
        hasPrioritySupport: false,
        hasCustomDomain: false,
        hasMiniWebsite: false,
        hasWhiteLabel: false,
        hasAPI: false,
        hasMultiLocation: false,
        isActive: true,
        isPopular: false,
        displayOrder: 0,
        trialDays: 0,
      });
      console.log('[INIT] Free plan created!');
    }
    
    if (!proExists) {
      console.log('[INIT] Creating Pro plan...');
      await storage.createSubscriptionPlan({
        name: "Pro",
        displayName: "Vyora Pro",
        description: "All features unlocked - Orders, POS, Analytics, Marketing & more",
        price: "399",
        currency: "INR",
        billingInterval: "month",
        maxServices: -1,
        maxProducts: -1,
        maxEmployees: -1,
        maxCustomers: -1,
        maxOrders: -1,
        maxBookings: -1,
        maxAppointments: -1,
        maxStorageGB: 10,
        hasAdvancedAnalytics: true,
        hasPrioritySupport: true,
        hasCustomDomain: true,
        hasMiniWebsite: true,
        hasWhiteLabel: false,
        hasAPI: true,
        hasMultiLocation: true,
        isActive: true,
        isPopular: true,
        displayOrder: 1,
        trialDays: 0,
      });
      console.log('[INIT] Pro plan created!');
    }
    
    console.log('[INIT] Subscription plans ready:', existingPlans.length + (proExists ? 0 : 1) + (freeExists ? 0 : 1), 'plans');
  } catch (error) {
    console.error('[INIT ERROR] Failed to initialize subscription plans:', error);
  }

  // Test endpoint to verify routes are working
  app.get("/api/test", (req, res) => {
    res.json({ message: "API is working", timestamp: new Date().toISOString() });
  });
  
  // ====================
  // MASTER DATA MANAGEMENT MODULE
  // ====================
  
  // ===== CATEGORIES =====
  
  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const { vendorId } = req.query;
      
      // If vendorId is provided, fetch both global and vendor-specific categories
      if (vendorId && typeof vendorId === 'string') {
        const categories = await storage.getCategoriesByCreator(vendorId);
        res.json(categories);
      } else {
        const categories = await storage.getAllCategories();
        res.json(categories);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Get categories by creator (global + vendor-specific)
  app.get("/api/categories/creator/:creatorId", async (req, res) => {
    try {
      const categories = await storage.getCategoriesByCreator(req.params.creatorId);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Create category
  app.post("/api/categories", async (req, res) => {
    try {
      console.log('[Categories] Creating category with data:', req.body);
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      console.log('[Categories] Category created:', category.id);
      res.status(201).json(category);
    } catch (error: any) {
      console.error('[Categories] Validation error:', error);
      res.status(400).json({ 
        error: "Invalid category data",
        details: error.message || error.errors || error
      });
    }
  });

  // Update category
  app.patch("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.updateCategory(req.params.id, req.body);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: "Failed to update category" });
    }
  });

  // Delete category
  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCategory(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // ===== SUBCATEGORIES =====
  
  // Get all subcategories
  app.get("/api/subcategories", async (req, res) => {
    try {
      const { vendorId, categoryId } = req.query;
      
      // If vendorId is provided, fetch both global and vendor-specific subcategories
      if (vendorId && typeof vendorId === 'string') {
        const subcategories = await storage.getSubcategoriesByCreator(
          vendorId,
          categoryId && typeof categoryId === 'string' ? categoryId : undefined
        );
        
        // Enrich with category names
        const categories = await storage.getCategoriesByCreator(vendorId);
        const enrichedSubcategories = subcategories.map(sub => ({
          ...sub,
          categoryName: categories.find(c => c.id === sub.categoryId)?.name || 'Unknown'
        }));
        
        res.json(enrichedSubcategories);
      } else {
        const subcategories = await storage.getAllSubcategories();
        res.json(subcategories);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subcategories" });
    }
  });

  // Get subcategories by category
  app.get("/api/subcategories/category/:categoryId", async (req, res) => {
    try {
      const subcategories = await storage.getSubcategoriesByCategory(req.params.categoryId);
      res.json(subcategories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subcategories" });
    }
  });

  // Get subcategories by creator
  app.get("/api/subcategories/creator/:creatorId", async (req, res) => {
    try {
      const { categoryId } = req.query;
      const subcategories = await storage.getSubcategoriesByCreator(
        req.params.creatorId,
        categoryId as string | undefined
      );
      res.json(subcategories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subcategories" });
    }
  });

  // Create subcategory
  app.post("/api/subcategories", async (req, res) => {
    try {
      console.log('[Subcategories] Creating subcategory with data:', req.body);
      const validatedData = insertSubcategorySchema.parse(req.body);
      const subcategory = await storage.createSubcategory(validatedData);
      console.log('[Subcategories] Subcategory created:', subcategory.id);
      res.status(201).json(subcategory);
    } catch (error: any) {
      console.error('[Subcategories] Validation error:', error);
      res.status(400).json({ 
        error: "Invalid subcategory data",
        details: error.message || error.errors || error
      });
    }
  });

  // Update subcategory
  app.patch("/api/subcategories/:id", async (req, res) => {
    try {
      const subcategory = await storage.updateSubcategory(req.params.id, req.body);
      if (!subcategory) {
        return res.status(404).json({ error: "Subcategory not found" });
      }
      res.json(subcategory);
    } catch (error) {
      res.status(400).json({ error: "Failed to update subcategory" });
    }
  });

  // Delete subcategory
  app.delete("/api/subcategories/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteSubcategory(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Subcategory not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete subcategory" });
    }
  });

  // ===== BRANDS =====
  
  // Get all brands
  app.get("/api/brands", async (req, res) => {
    try {
      const { categoryId } = req.query;
      
      if (categoryId && typeof categoryId === 'string') {
        const brands = await storage.getBrandsByCategory(categoryId);
        res.json(brands);
      } else {
        const brands = await storage.getAllBrands();
        res.json(brands);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brands" });
    }
  });

  // Get brands by category
  app.get("/api/brands/category/:categoryId", async (req, res) => {
    try {
      const brands = await storage.getBrandsByCategory(req.params.categoryId);
      res.json(brands);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brands" });
    }
  });

  // Create brand
  app.post("/api/brands", async (req, res) => {
    try {
      console.log('[Brands] Creating brand with data:', req.body);
      const validatedData = insertBrandSchema.parse(req.body);
      console.log('[Brands] Validated data:', validatedData);
      const brand = await storage.createBrand(validatedData);
      console.log('[Brands] Brand created successfully:', brand.id);
      res.status(201).json(brand);
    } catch (error: any) {
      console.error('[Brands] Error creating brand:', error);
      console.error('[Brands] Error stack:', error.stack);
      
      // Check if it's a database error
      if (error.code === '42P01') {
        return res.status(500).json({ 
          error: "Database table not found",
          details: "The brands table does not exist. Please run the migration: migrations/0005_create_brands.sql",
          code: error.code
        });
      }
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid brand data",
          details: error.errors
        });
      }
      
      res.status(500).json({ 
        error: "Failed to create brand",
        details: error.message || String(error)
      });
    }
  });

  // Update brand
  app.patch("/api/brands/:id", async (req, res) => {
    try {
      const brand = await storage.updateBrand(req.params.id, req.body);
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }
      res.json(brand);
    } catch (error) {
      res.status(400).json({ error: "Failed to update brand" });
    }
  });

  // Delete brand
  app.delete("/api/brands/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteBrand(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Brand not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete brand" });
    }
  });

  // ===== UNITS =====
  
  // Get all units
  app.get("/api/units", async (req, res) => {
    try {
      const units = await storage.getAllUnits();
      res.json(units);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch units" });
    }
  });

  // Get units by subcategory
  app.get("/api/units/subcategory/:subcategoryId", async (req, res) => {
    try {
      const units = await storage.getUnitsBySubcategory(req.params.subcategoryId);
      res.json(units);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch units" });
    }
  });

  // Get units by creator
  app.get("/api/units/creator/:creatorId", async (req, res) => {
    try {
      const { subcategoryId } = req.query;
      const units = await storage.getUnitsByCreator(
        req.params.creatorId,
        subcategoryId as string | undefined
      );
      res.json(units);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch units" });
    }
  });

  // Create unit
  app.post("/api/units", async (req, res) => {
    try {
      const validatedData = insertUnitSchema.parse(req.body);
      const unit = await storage.createUnit(validatedData);
      res.status(201).json(unit);
    } catch (error) {
      res.status(400).json({ error: "Invalid unit data" });
    }
  });

  // Update unit
  app.patch("/api/units/:id", async (req, res) => {
    try {
      const unit = await storage.updateUnit(req.params.id, req.body);
      if (!unit) {
        return res.status(404).json({ error: "Unit not found" });
      }
      res.json(unit);
    } catch (error) {
      res.status(400).json({ error: "Failed to update unit" });
    }
  });

  // Delete unit
  app.delete("/api/units/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteUnit(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Unit not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete unit" });
    }
  });

  // ====================
  // MASTER SERVICES (Admin)
  // ====================
  
  // Get all master services
  app.get("/api/master-services", async (req, res) => {
    try {
      const { universal } = req.query;
      const isUniversal = universal === "true" ? true : universal === "false" ? false : undefined;
      const services = await storage.getAllMasterServices(isUniversal);
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch master services" });
    }
  });

  // Get single master service
  app.get("/api/master-services/:id", async (req, res) => {
    try {
      const service = await storage.getMasterService(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  // Search master services
  app.get("/api/master-services/search/:query", async (req, res) => {
    try {
      const services = await storage.searchMasterServices(req.params.query);
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to search services" });
    }
  });

  // Create master service (Admin only)
  app.post("/api/master-services", async (req, res) => {
    try {
      const validatedData = insertMasterServiceSchema.parse(req.body);
      const service = await storage.createMasterService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      res.status(400).json({ error: "Invalid service data" });
    }
  });

  // Update master service (Admin only)
  app.patch("/api/master-services/:id", async (req, res) => {
    try {
      const service = await storage.updateMasterService(req.params.id, req.body);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(400).json({ error: "Failed to update service" });
    }
  });

  // Delete master service (Admin only)
  app.delete("/api/master-services/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteMasterService(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  // Duplicate master service (Admin only)
  app.post("/api/master-services/:id/duplicate", async (req, res) => {
    try {
      const duplicated = await storage.duplicateMasterService(req.params.id);
      if (!duplicated) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.status(201).json(duplicated);
    } catch (error) {
      res.status(500).json({ error: "Failed to duplicate service" });
    }
  });

  // Get all vendor catalogue services with advanced filtering and pagination (Admin)
  app.get("/api/admin/catalogue", async (req, res) => {
    try {
      // Parse query parameters
      const filters: any = {};
      
      if (req.query.vendorIds) {
        filters.vendorIds = Array.isArray(req.query.vendorIds) 
          ? req.query.vendorIds 
          : [req.query.vendorIds];
      }
      
      if (req.query.categoryIds) {
        filters.categoryIds = Array.isArray(req.query.categoryIds) 
          ? req.query.categoryIds 
          : [req.query.categoryIds];
      }
      
      if (req.query.subcategoryIds) {
        filters.subcategoryIds = Array.isArray(req.query.subcategoryIds) 
          ? req.query.subcategoryIds 
          : [req.query.subcategoryIds];
      }
      
      if (req.query.serviceType) {
        filters.serviceType = Array.isArray(req.query.serviceType) 
          ? req.query.serviceType 
          : [req.query.serviceType];
      }
      
      if (req.query.unitIds) {
        filters.unitIds = Array.isArray(req.query.unitIds) 
          ? req.query.unitIds 
          : [req.query.unitIds];
      }
      
      if (req.query.priceMin) {
        filters.priceMin = Number(req.query.priceMin);
      }
      
      if (req.query.priceMax) {
        filters.priceMax = Number(req.query.priceMax);
      }
      
      if (req.query.startDate || req.query.endDate) {
        filters.dateRange = {};
        if (req.query.startDate) filters.dateRange.start = req.query.startDate;
        if (req.query.endDate) filters.dateRange.end = req.query.endDate;
      }
      
      if (req.query.search) {
        filters.search = req.query.search;
      }
      
      if (req.query.sortBy) {
        filters.sortBy = req.query.sortBy;
      }
      
      if (req.query.sortOrder) {
        filters.sortOrder = req.query.sortOrder;
      }
      
      if (req.query.limit) {
        filters.limit = Number(req.query.limit);
      }
      
      if (req.query.offset) {
        filters.offset = Number(req.query.offset);
      }
      
      // Fetch catalogue with filters
      const result = await storage.getAllCatalogue(filters);
      res.json(result);
    } catch (error) {
      console.error("Admin catalogue fetch error:", error);
      res.status(400).json({ 
        error: "Failed to fetch catalogue",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Get all vendor products with advanced filtering and pagination (Admin)
  app.get("/api/admin/products", async (req, res) => {
    try {
      // Parse query parameters
      const filters: any = {};
      
      if (req.query.vendorIds) {
        filters.vendorIds = Array.isArray(req.query.vendorIds) 
          ? req.query.vendorIds 
          : [req.query.vendorIds];
      }
      
      if (req.query.categoryIds) {
        filters.categoryIds = Array.isArray(req.query.categoryIds) 
          ? req.query.categoryIds 
          : [req.query.categoryIds];
      }
      
      if (req.query.subcategoryIds) {
        filters.subcategoryIds = Array.isArray(req.query.subcategoryIds) 
          ? req.query.subcategoryIds 
          : [req.query.subcategoryIds];
      }
      
      if (req.query.isActive) {
        filters.isActive = req.query.isActive === 'true';
      }
      
      if (req.query.requiresPrescription) {
        filters.requiresPrescription = req.query.requiresPrescription === 'true';
      }
      
      if (req.query.priceMin) {
        filters.priceMin = Number(req.query.priceMin);
      }
      
      if (req.query.priceMax) {
        filters.priceMax = Number(req.query.priceMax);
      }
      
      if (req.query.stockMin) {
        filters.stockMin = Number(req.query.stockMin);
      }
      
      if (req.query.stockMax) {
        filters.stockMax = Number(req.query.stockMax);
      }
      
      if (req.query.startDate || req.query.endDate) {
        filters.dateRange = {};
        if (req.query.startDate) filters.dateRange.start = req.query.startDate;
        if (req.query.endDate) filters.dateRange.end = req.query.endDate;
      }
      
      if (req.query.search) {
        filters.search = req.query.search;
      }
      
      if (req.query.sortBy) {
        filters.sortBy = req.query.sortBy;
      }
      
      if (req.query.sortOrder) {
        filters.sortOrder = req.query.sortOrder;
      }
      
      if (req.query.limit) {
        filters.limit = Number(req.query.limit);
      }
      
      if (req.query.offset) {
        filters.offset = Number(req.query.offset);
      }
      
      // Fetch products with filters
      const result = await storage.getAllProducts(filters);
      res.json(result);
    } catch (error) {
      console.error("Admin products fetch error:", error);
      res.status(400).json({ 
        error: "Failed to fetch products",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Update product active status (Admin)
  app.patch("/api/admin/products/:id/status", async (req, res) => {
    try {
      const { isActive } = req.body;
      const product = await storage.updateVendorProduct(req.params.id, { isActive });
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: "Failed to update product status" });
    }
  });

  // ====================
  // VENDOR CATALOGUES
  // ====================

  // Get vendor's catalogue
  app.get("/api/vendors/:vendorId/catalogue", async (req, res) => {
    try {
      const catalogues = await storage.getVendorCataloguesByVendor(req.params.vendorId);
      res.json(catalogues);
    } catch (error: any) {
      console.error("❌ Error fetching vendor catalogue:", error);
      console.error("Error details:", error.message, error.stack);
      res.status(500).json({ error: "Failed to fetch vendor catalogue", message: error.message });
    }
  });

  // Add service to vendor catalogue (with customizations)
  app.post("/api/vendors/:vendorId/catalogue", async (req, res) => {
    try {
      const validatedData = insertVendorCatalogueSchema.parse({
        ...req.body,
        vendorId: req.params.vendorId,
      });
      const catalogue = await storage.createVendorCatalogue(validatedData);
      res.status(201).json(catalogue);
    } catch (error) {
      console.error("Error adding service to vendor catalogue:", error);
      res.status(400).json({ error: "Invalid catalogue data", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Get single vendor catalogue item
  app.get("/api/vendor-catalogue/:id", async (req, res) => {
    try {
      const catalogue = await storage.getVendorCatalogue(req.params.id);
      if (!catalogue) {
        return res.status(404).json({ error: "Catalogue item not found" });
      }
      res.json(catalogue);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch catalogue item" });
    }
  });

  // Update vendor catalogue item
  app.patch("/api/vendor-catalogue/:id", async (req, res) => {
    try {
      const catalogue = await storage.updateVendorCatalogue(req.params.id, req.body);
      if (!catalogue) {
        return res.status(404).json({ error: "Catalogue item not found" });
      }
      res.json(catalogue);
    } catch (error) {
      res.status(400).json({ error: "Failed to update catalogue" });
    }
  });

  // Delete vendor catalogue item
  app.delete("/api/vendor-catalogue/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteVendorCatalogue(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Catalogue item not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete catalogue item" });
    }
  });

  // Duplicate vendor catalogue item
  app.post("/api/vendor-catalogue/:id/duplicate", async (req, res) => {
    try {
      const duplicated = await storage.duplicateVendorCatalogue(req.params.id);
      if (!duplicated) {
        return res.status(404).json({ error: "Catalogue item not found" });
      }
      res.status(201).json(duplicated);
    } catch (error) {
      res.status(500).json({ error: "Failed to duplicate catalogue item" });
    }
  });

  // ====================
  // CUSTOM SERVICE REQUESTS
  // ====================

  // Get all custom service requests (Admin)
  app.get("/api/custom-service-requests", async (req, res) => {
    try {
      const { status } = req.query;
      const requests = await storage.getAllCustomServiceRequests(status as string);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  });

  // Get vendor's custom service requests
  app.get("/api/vendors/:vendorId/custom-service-requests", async (req, res) => {
    try {
      const requests = await storage.getCustomServiceRequestsByVendor(req.params.vendorId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  });

  // Create custom service request
  app.post("/api/vendors/:vendorId/custom-service-requests", async (req, res) => {
    try {
      const validatedData = insertCustomServiceRequestSchema.parse({
        ...req.body,
        vendorId: req.params.vendorId,
      });
      const request = await storage.createCustomServiceRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  // Update custom service request (Admin approve/reject)
  app.patch("/api/custom-service-requests/:id", async (req, res) => {
    try {
      const { status, madeUniversal, reviewedBy, adminNotes } = req.body;
      
      const updates: any = { status, adminNotes };
      if (reviewedBy) updates.reviewedBy = reviewedBy;
      if (status === "approved") {
        updates.reviewedAt = new Date();
        if (madeUniversal) {
          updates.madeUniversal = true;
        }
      }

      const request = await storage.updateCustomServiceRequest(req.params.id, updates);
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }

      // If approved and made universal, create master service
      if (status === "approved" && madeUniversal) {
        await storage.createMasterService({
          name: request.name,
          category: request.category,
          icon: request.icon,
          description: request.description,
          inclusions: request.inclusions,
          exclusions: request.exclusions,
          tags: request.tags,
          sampleType: request.sampleType,
          tat: request.tat,
          basePrice: request.basePrice,
          isUniversal: true,
          createdBy: reviewedBy,
        });
      }

      // If approved (universal or not), add to vendor's catalogue
      if (status === "approved") {
        await storage.createVendorCatalogue({
          vendorId: request.vendorId,
          masterServiceId: null,
          customServiceRequestId: request.id,
          name: request.name,
          category: request.category,
          icon: request.icon,
          description: request.description,
          inclusions: request.inclusions,
          exclusions: request.exclusions,
          tags: request.tags,
          sampleType: request.sampleType,
          tat: request.tat,
          price: request.basePrice || 0,
          homeCollectionAvailable: false,
          homeCollectionCharges: 0,
          isActive: true,
          discountPercentage: 0,
        });
      }

      res.json(request);
    } catch (error) {
      res.status(400).json({ error: "Failed to update request" });
    }
  });

  // ====================
  // USERS
  // ====================

  // Get user by ID
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Create user
  app.post("/api/users", async (req, res) => {
    try {
      const { insertUserSchema } = await import("@shared/schema");
      const validatedData = insertUserSchema.parse(req.body);
      
      const user = await storage.createUser({
        ...validatedData,
        id: req.body.id, // Supabase user ID
      });
      
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ 
        error: "Invalid user data",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Get all employees (users with role='employee') - Admin only
  app.get("/api/admin/employees", async (req, res) => {
    try {
      if (!storage.getUsersByRole) {
        // Fallback: query all users and filter
        const allUsers = await (storage as any).getAllUsers?.() || [];
        const employees = allUsers.filter((u: any) => u.role === "employee");
        console.log(`[API] Found ${employees.length} employees (fallback)`);
        return res.json(employees);
      }
      const employees = await storage.getUsersByRole("employee");
      console.log(`[API] Found ${employees.length} employees from database`);
      console.log(`[API] Employee data sample:`, employees.length > 0 ? {
        id: employees[0].id,
        username: employees[0].username,
        email: employees[0].email,
        name: (employees[0] as any).name,
        phone: (employees[0] as any).phone,
        modulePermissions: employees[0].modulePermissions
      } : 'No employees');
      res.json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });

  // Create employee - Admin only
  app.post("/api/admin/employees", async (req, res) => {
    try {
      const { username, email, password, name, phone, department, role, modulePermissions } = req.body;

      // Validation
      if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email, and password are required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }

      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ error: "Username already taken" });
      }

      // Hash password
      const { hashPassword } = await import('./auth');
      const passwordHash = await hashPassword(password);

      // Prepare user data - ensure modulePermissions is properly formatted
      const userData: any = {
        username,
        email: email.toLowerCase(),
        passwordHash,
        role: "employee",
        name: name || null,
        phone: phone || null,
        department: department || null,
        jobRole: role || null,
      };

      // Add modulePermissions if provided (handle JSON field properly)
      if (modulePermissions && Array.isArray(modulePermissions)) {
        userData.modulePermissions = modulePermissions;
      } else {
        userData.modulePermissions = [];
      }

      // Create user with employee role and all details
      const user = await storage.createUser(userData);

      res.status(201).json(user);
    } catch (error: any) {
      console.error("Error creating employee:", error);
      const errorMessage = error?.message || error?.detail || "Failed to create employee";
      console.error("Error details:", {
        message: error?.message,
        detail: error?.detail,
        code: error?.code,
        stack: error?.stack,
      });
      res.status(500).json({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error?.detail : undefined
      });
    }
  });

  // Update user module permissions - Admin only
  app.patch("/api/admin/users/:userId/permissions", async (req, res) => {
    try {
      const { modulePermissions } = req.body;
      
      if (!Array.isArray(modulePermissions)) {
        return res.status(400).json({ error: "modulePermissions must be an array" });
      }

      const user = await storage.updateUser(req.params.userId, {
        modulePermissions: modulePermissions as any,
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error updating permissions:", error);
      res.status(500).json({ error: "Failed to update permissions" });
    }
  });

  // ====================
  // VENDORS
  // ====================

  // Get all vendors - Simple fetch from vendors table
  app.get("/api/vendors", async (req, res) => {
    const apiStartTime = Date.now();
    try {
      console.log('[API] GET /api/vendors - Request received at', new Date().toISOString());
      const vendors = await storage.getAllVendors();
      const apiTime = Date.now() - apiStartTime;
      console.log('[API] Returning', vendors.length, 'vendors in', apiTime, 'ms');
      res.json(vendors);
    } catch (error: any) {
      const apiTime = Date.now() - apiStartTime;
      console.error("[API] Error fetching vendors after", apiTime, "ms:", error);
      res.status(500).json({
        error: "Failed to fetch vendors",
        message: error?.message || "Unknown error"
      });
    }
  });

  // ===== VENDOR SUBSCRIPTIONS =====

  // Get vendor's current subscription (MUST come before the general /subscription route)
  app.get("/api/vendors/:vendorId/subscription", async (req, res) => {
    try {
      console.log('[API] GET /api/vendors/:vendorId/subscription for vendor:', req.params.vendorId);
      const subscription = await storage.getVendorSubscriptionByVendor(req.params.vendorId);
      if (!subscription) {
        return res.status(404).json({ error: "No subscription found for vendor" });
      }

      // Also fetch the plan details
      const plan = await storage.getSubscriptionPlan(subscription.planId);
      console.log('[API] Found subscription:', subscription.id, 'with plan:', plan?.name);
      res.json({ subscription, plan });
    } catch (error: any) {
      console.error("Error fetching vendor subscription:", error);
      res.status(500).json({ error: "Failed to fetch vendor subscription" });
    }
  });

  // Get all vendor subscriptions - Simple fetch from vendor_subscriptions table
  app.get("/api/vendors/subscription", async (req, res) => {
    try {
      console.log('[API] GET /api/vendors/subscription');
      const { status } = req.query;
      const subscriptions = await storage.getAllVendorSubscriptions(status as string | undefined);
      console.log('[API] Returning', subscriptions.length, 'vendor subscriptions');
      res.json(subscriptions);
    } catch (error: any) {
      console.error("[API] Error fetching vendor subscriptions:", error);
      res.status(500).json({
        error: "Failed to fetch vendor subscriptions",
        message: error?.message || "Unknown error"
      });
    }
  });

  // Get vendor stats for a specific vendor (Admin)
  app.get("/api/admin/vendors/:vendorId/stats", async (req, res) => {
    try {
      const { vendorId } = req.params;
      console.log('[ADMIN] Fetching stats for vendor:', vendorId);
      
      // Fetch all counts in parallel
      const [products, services, leads, customers, suppliers, orders] = await Promise.all([
        storage.getVendorProductsByVendor ? storage.getVendorProductsByVendor(vendorId) : [],
        storage.getVendorCataloguesByVendor ? storage.getVendorCataloguesByVendor(vendorId) : [],
        storage.getLeadsByVendor ? storage.getLeadsByVendor(vendorId) : [],
        storage.getCustomersByVendor ? storage.getCustomersByVendor(vendorId) : [],
        storage.getSuppliersByVendor ? storage.getSuppliersByVendor(vendorId) : [],
        storage.getOrdersByVendor ? storage.getOrdersByVendor(vendorId) : [],
      ]);

      const stats = {
        productsCount: (products as any[]).length,
        servicesCount: (services as any[]).length,
        leadsCount: (leads as any[]).length,
        customersCount: (customers as any[]).length,
        suppliersCount: (suppliers as any[]).length,
        ordersCount: (orders as any[]).length,
      };

      console.log('[ADMIN] Vendor stats:', stats);
      res.json(stats);
    } catch (error: any) {
      console.error("[ADMIN] Error fetching vendor stats:", error);
      res.status(500).json({ error: "Failed to fetch vendor stats" });
    }
  });

  // Get single vendor
  app.get("/api/vendors/:id", async (req, res) => {
    try {
      const vendor = await storage.getVendor(req.params.id);
      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }
      res.json(vendor);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vendor" });
    }
  });

  // Get vendor by user ID
  app.get("/api/vendors/user/:userId", async (req, res) => {
    try {
      const vendor = await storage.getVendorByUserId(req.params.userId);
      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found for this user" });
      }
      res.json(vendor);
    } catch (error) {
      console.error("Error fetching vendor by user ID:", error);
      res.status(500).json({ error: "Failed to fetch vendor" });
    }
  });

  // Create vendor
  app.post("/api/vendors", async (req, res) => {
    try {
      const validatedData = insertVendorSchema.parse(req.body);
      const vendor = await storage.createVendor(validatedData);
      res.status(201).json(vendor);
    } catch (error: any) {
      console.error("Error creating vendor:", error);

      // Extract specific validation errors
      let validationErrors: any[] = [];
      if (error?.issues) {
        // Zod validation errors - format them nicely
        validationErrors = error.issues.map((issue: any) => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
          expected: issue.expected,
          received: issue.received
        }));
      }

      res.status(400).json({
        error: "Invalid vendor data",
        message: "Please check the required fields and data formats",
        validationErrors: validationErrors,
        summary: validationErrors.length > 0
          ? `${validationErrors.length} field(s) have validation errors`
          : "Validation failed",
        requiredFields: [
          "userId", "businessName", "ownerName", "category", "subcategory",
          "email", "phone", "whatsappNumber", "street", "city", "state",
          "pincode", "address", "description"
        ],
        optionalFields: [
          "customCategory", "customSubcategory", "logo", "banner",
          "licenseNumber", "gstNumber", "latitude", "longitude",
          "bankAccountName", "bankAccountNumber", "bankIfscCode"
        ]
      });
    }
  });

  // Update vendor
  app.patch("/api/vendors/:id", async (req, res) => {
    try {
      const vendor = await storage.updateVendor(req.params.id, req.body);
      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }
      res.json(vendor);
    } catch (error: any) {
      console.error("Error updating vendor:", error);

      // Extract specific validation errors
      let validationErrors: any[] = [];
      if (error?.issues) {
        // Zod validation errors - format them nicely
        validationErrors = error.issues.map((issue: any) => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
          expected: issue.expected,
          received: issue.received
        }));
      }

      res.status(400).json({
        error: "Failed to update vendor",
        message: "Please check the data formats",
        validationErrors: validationErrors,
        summary: validationErrors.length > 0
          ? `${validationErrors.length} field(s) have validation errors`
          : "Validation failed"
      });
    }
  });

  // Get industry categories and subcategories
  // Get industry categories from database (organized by category->subcategories)
  app.get("/api/industry-categories", async (req, res) => {
    try {
      // Fetch all categories and subcategories from database
      const categories = await storage.getAllCategories();
      const subcategories = await storage.getAllSubcategories();
      
      // Organize into nested structure: { Category: [Subcategories] }
      const organized: Record<string, string[]> = {};
      
      for (const category of categories) {
        const categorySubcats = subcategories
          .filter(sub => sub.categoryId === category.id)
          .map(sub => sub.name);
        
        organized[category.name] = categorySubcats;
      }
      
      // If database is empty, seed it first
      if (Object.keys(organized).length === 0) {
        console.log("📊 No categories found in database, seeding...");
        
        // Seed categories from hardcoded list
        for (const [categoryName, subcategoryNames] of Object.entries(INDUSTRY_CATEGORIES)) {
          const category = await storage.createCategory({
            name: categoryName,
            description: `${categoryName} industry services`,
          });
          
          for (const subcategoryName of subcategoryNames) {
            await storage.createSubcategory({
              categoryId: category.id,
              name: subcategoryName,
              description: `${subcategoryName} services`,
            });
          }
          
          organized[categoryName] = subcategoryNames;
        }
        
        console.log("✅ Categories seeded successfully!");
      }
      
      res.json(organized);
    } catch (error) {
      console.error("Error fetching industry categories:", error);
      // Fallback to hardcoded categories on error
      res.json(INDUSTRY_CATEGORIES);
    }
  });
  
  // Endpoint to manually seed categories (admin only in production)
  app.post("/api/seed-categories", async (req, res) => {
    try {
      const existingCategories = await storage.getAllCategories();
      if (existingCategories.length > 0) {
        return res.json({ 
          message: "Categories already exist",
          count: existingCategories.length 
        });
      }

      let totalCategories = 0;
      let totalSubcategories = 0;

      for (const [categoryName, subcategoryNames] of Object.entries(INDUSTRY_CATEGORIES)) {
        const category = await storage.createCategory({
          name: categoryName,
          description: `${categoryName} industry services`,
        });
        
        totalCategories++;

        for (const subcategoryName of subcategoryNames) {
          await storage.createSubcategory({
            categoryId: category.id,
            name: subcategoryName,
            description: `${subcategoryName} services`,
          });
          
          totalSubcategories++;
        }
      }

      res.json({ 
        message: "Categories seeded successfully",
        categories: totalCategories,
        subcategories: totalSubcategories
      });
    } catch (error) {
      console.error("Error seeding categories:", error);
      res.status(500).json({ error: "Failed to seed categories" });
    }
  });

  // ====================
  // BOOKINGS (Service Bookings)
  // ====================

  // Get all bookings (Admin)
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  // Get vendor's bookings
  app.get("/api/vendors/:vendorId/bookings", async (req, res) => {
    try {
      const bookings = await storage.getBookingsByVendor(req.params.vendorId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  // Create booking
  app.post("/api/bookings", async (req, res) => {
    try {
      console.log("📅 Creating booking for vendor:", req.body.vendorId);
      
      // Convert date strings to Date objects
      const processedBody = {
        ...req.body,
        bookingDate: req.body.bookingDate ? new Date(req.body.bookingDate) : new Date(),
      };
      
      const validatedData = insertBookingSchema.parse(processedBody);
      const booking = await storage.createBooking(validatedData);
      console.log("✅ Booking created:", booking.id);
      res.status(201).json(booking);
    } catch (error: any) {
      console.error("❌ Booking creation error:", error);
      if (error.name === 'ZodError') {
        console.error("Validation errors:", JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ 
          error: "Invalid booking data", 
          details: error.errors,
          message: error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')
        });
      }
      res.status(400).json({ 
        error: "Invalid booking data",
        message: error.message 
      });
    }
  });

  // Update booking
  app.patch("/api/bookings/:id", async (req, res) => {
    try {
      // Convert date strings to Date objects
      const processedBody = { ...req.body };
      if (req.body.bookingDate) processedBody.bookingDate = new Date(req.body.bookingDate);
      
      const booking = await storage.updateBooking(req.params.id, processedBody);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error: any) {
      console.error("❌ Booking update error:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          error: "Failed to update booking", 
          details: error.errors,
          message: error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')
        });
      }
      res.status(400).json({ 
        error: "Failed to update booking",
        message: error.message 
      });
    }
  });

  // ====================
  // APPOINTMENTS (Physical Visit Appointments)
  // ====================

  // Get all appointments (Admin)
  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  // Get vendor's appointments
  app.get("/api/vendors/:vendorId/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAppointmentsByVendor(req.params.vendorId);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  // Create appointment
  app.post("/api/appointments", async (req, res) => {
    try {
      console.log("📅 Creating appointment for vendor:", req.body.vendorId);
      console.log("📅 Request body:", JSON.stringify(req.body, null, 2));
      
      // Convert date strings to Date objects
      const processedBody = {
        ...req.body,
        appointmentDate: req.body.appointmentDate ? new Date(req.body.appointmentDate) : new Date(),
        followUpDate: req.body.followUpDate ? new Date(req.body.followUpDate) : undefined,
      };
      
      const validatedData = insertAppointmentSchema.parse(processedBody);
      console.log("✅ Validation passed, creating appointment...");
      
      const appointment = await storage.createAppointment(validatedData);
      console.log("✅ Appointment created:", appointment.id);
      res.status(201).json(appointment);
    } catch (error: any) {
      console.error("❌ Appointment creation error:", error);
      if (error.name === 'ZodError') {
        console.error("Validation errors:", JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ 
          error: "Invalid appointment data", 
          details: error.errors,
          message: error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')
        });
      }
      res.status(400).json({ 
        error: "Invalid appointment data",
        message: error.message 
      });
    }
  });

  // Update appointment
  app.patch("/api/appointments/:id", async (req, res) => {
    try {
      // Convert date strings to Date objects
      const processedBody = { ...req.body };
      if (req.body.appointmentDate) processedBody.appointmentDate = new Date(req.body.appointmentDate);
      if (req.body.followUpDate) processedBody.followUpDate = new Date(req.body.followUpDate);
      
      const appointment = await storage.updateAppointment(req.params.id, processedBody);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error: any) {
      console.error("❌ Appointment update error:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          error: "Failed to update appointment", 
          details: error.errors,
          message: error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')
        });
      }
      res.status(400).json({ 
        error: "Failed to update appointment",
        message: error.message 
      });
    }
  });

  // ====================
  // ORDERS (Product Orders)
  // ====================

  // Get all orders (Admin)
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Get vendor's orders
  app.get("/api/vendors/:vendorId/orders", async (req, res) => {
    try {
      const orders = await storage.getOrdersByVendor(req.params.vendorId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Create order from POS
  app.post("/api/vendors/:vendorId/orders", async (req, res) => {
    try {
      console.log('📦 [POS] Creating order for vendor:', req.params.vendorId);
      console.log('📦 [POS] Order data:', JSON.stringify(req.body, null, 2));
      
      const { vendorId } = req.params;
      const orderData = req.body;

      // Generate order ID
      const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const order = {
        id: orderId,
        vendorId: vendorId,
        customerId: orderData.customerId || null,
        customerName: orderData.customerName || 'Walk-in Customer',
        customerPhone: orderData.customerPhone || '',
        customerEmail: orderData.customerEmail || null,
        deliveryAddress: orderData.deliveryAddress || 'Counter Sale',
        city: orderData.city || 'N/A',
        state: orderData.state || 'N/A',
        pincode: orderData.pincode || '000000',
        status: orderData.status || 'pending',
        paymentStatus: orderData.paymentStatus || 'pending',
        paymentMethod: orderData.paymentMethod || null,
        subtotal: orderData.subtotal || 0,
        deliveryCharges: orderData.deliveryCharges || 0,
        totalAmount: orderData.totalAmount || 0,
        notes: orderData.notes || null,
        source: orderData.source || 'pos',
        prescriptionRequired: orderData.prescriptionRequired || false,
        prescriptionImage: orderData.prescriptionImage || null,
      };

      console.log('📦 [POS] Creating order with data:', order);
      const createdOrder = await storage.createOrder(order);
      console.log('✅ [POS] Order created:', createdOrder.id);

      res.status(201).json(createdOrder);
    } catch (error: any) {
      console.error('❌ [POS] Failed to create order:', error);
      res.status(500).json({ 
        error: "Failed to create order",
        message: error.message 
      });
    }
  });

  // Get vendor dashboard analytics
  app.get("/api/vendors/:vendorId/analytics", async (req, res) => {
    try {
      const { vendorId } = req.params;
      const { period = 'this-month' } = req.query;

      // Calculate date ranges based on period
      const now = new Date();
      let startDate = new Date();
      let previousStartDate = new Date();
      let previousEndDate = new Date();

      switch (period) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          previousStartDate = new Date(startDate);
          previousStartDate.setDate(previousStartDate.getDate() - 1);
          previousEndDate = new Date(startDate);
          break;
        case 'this-week':
          const dayOfWeek = now.getDay();
          startDate.setDate(now.getDate() - dayOfWeek);
          startDate.setHours(0, 0, 0, 0);
          previousStartDate = new Date(startDate);
          previousStartDate.setDate(previousStartDate.getDate() - 7);
          previousEndDate = new Date(startDate);
          break;
        case 'this-month':
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          previousEndDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'this-year':
          startDate = new Date(now.getFullYear(), 0, 1);
          previousStartDate = new Date(now.getFullYear() - 1, 0, 1);
          previousEndDate = new Date(now.getFullYear(), 0, 1);
          break;
      }

      // Fetch all data
      const [orders, customers, bookings, leads, appointments, coupons] = await Promise.all([
        storage.getOrdersByVendor(vendorId),
        storage.getCustomersByVendor(vendorId),
        storage.getBookingsByVendor ? storage.getBookingsByVendor(vendorId) : Promise.resolve([]),
        storage.getLeadsByVendor ? storage.getLeadsByVendor(vendorId) : Promise.resolve([]),
        storage.getAppointmentsByVendor ? storage.getAppointmentsByVendor(vendorId) : Promise.resolve([]),
        storage.getCouponsByVendor ? storage.getCouponsByVendor(vendorId) : Promise.resolve([]),
      ]);

      // Filter current period data
      const currentOrders = orders.filter(o => new Date(o.createdAt) >= startDate);
      const currentCustomers = customers.filter(c => new Date(c.createdAt) >= startDate);
      const currentBookings = bookings.filter(b => new Date(b.createdAt) >= startDate);
      const currentLeads = leads.filter(l => new Date(l.createdAt) >= startDate);
      const currentAppointments = appointments.filter(a => new Date(a.createdAt) >= startDate);

      // Filter previous period data for comparison
      const previousOrders = orders.filter(o => {
        const date = new Date(o.createdAt);
        return date >= previousStartDate && date < previousEndDate;
      });
      const previousCustomers = customers.filter(c => {
        const date = new Date(c.createdAt);
        return date >= previousStartDate && date < previousEndDate;
      });
      const previousBookings = bookings.filter(b => {
        const date = new Date(b.createdAt);
        return date >= previousStartDate && date < previousEndDate;
      });
      const previousLeads = leads.filter(l => {
        const date = new Date(l.createdAt);
        return date >= previousStartDate && date < previousEndDate;
      });
      const previousAppointments = appointments.filter(a => {
        const date = new Date(a.createdAt);
        return date >= previousStartDate && date < previousEndDate;
      });

      // Calculate metrics
      const totalSales = currentOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const previousSales = previousOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const salesChange = previousSales > 0 ? ((totalSales - previousSales) / previousSales * 100).toFixed(1) : '0.0';

      const totalOrders = currentOrders.length;
      const ordersChange = previousOrders.length > 0 ? ((totalOrders - previousOrders.length) / previousOrders.length * 100).toFixed(1) : '0.0';

      const totalBookings = currentBookings.length;
      const bookingsChange = previousBookings.length > 0 ? ((totalBookings - previousBookings.length) / previousBookings.length * 100).toFixed(1) : '0.0';

      const totalCustomers = currentCustomers.length;
      const customersChange = previousCustomers.length > 0 ? ((totalCustomers - previousCustomers.length) / previousCustomers.length * 100).toFixed(1) : '0.0';

      const totalLeads = currentLeads.length;
      const leadsChange = previousLeads.length > 0 ? ((totalLeads - previousLeads.length) / previousLeads.length * 100).toFixed(1) : '0.0';

      const totalAppointments = currentAppointments.length;
      const appointmentsChange = previousAppointments.length > 0 ? ((totalAppointments - previousAppointments.length) / previousAppointments.length * 100).toFixed(1) : '0.0';

      // Active coupons (valid and not expired)
      const activeCoupons = coupons.filter(c => 
        c.status === 'active' && (!c.expiryDate || new Date(c.expiryDate) > now)
      );
      const expiredCoupons = coupons.filter(c => 
        c.expiryDate && new Date(c.expiryDate) <= now
      );

      res.json({
        totalSales: {
          value: totalSales,
          change: parseFloat(salesChange),
          changeText: `${salesChange > 0 ? '+' : ''}${salesChange}%`,
          positive: parseFloat(salesChange) >= 0,
        },
        totalOrders: {
          value: totalOrders,
          change: parseFloat(ordersChange),
          changeText: `${ordersChange > 0 ? '+' : ''}${ordersChange}%`,
          positive: parseFloat(ordersChange) >= 0,
        },
        totalBookings: {
          value: totalBookings,
          change: parseFloat(bookingsChange),
          changeText: `${bookingsChange > 0 ? '+' : ''}${bookingsChange}%`,
          positive: parseFloat(bookingsChange) >= 0,
        },
        totalCustomers: {
          value: totalCustomers,
          change: parseFloat(customersChange),
          changeText: `${customersChange > 0 ? '+' : ''}${customersChange}%`,
          positive: parseFloat(customersChange) >= 0,
        },
        totalLeads: {
          value: totalLeads,
          change: parseFloat(leadsChange),
          changeText: `${leadsChange > 0 ? '+' : ''}${leadsChange}%`,
          positive: parseFloat(leadsChange) >= 0,
        },
        totalAppointments: {
          value: totalAppointments,
          change: parseFloat(appointmentsChange),
          changeText: `${appointmentsChange > 0 ? '+' : ''}${appointmentsChange}%`,
          positive: parseFloat(appointmentsChange) >= 0,
        },
        activeCoupons: {
          value: activeCoupons.length,
          change: -expiredCoupons.length,
          changeText: expiredCoupons.length > 0 ? `-${expiredCoupons.length} expired` : 'All active',
          positive: expiredCoupons.length === 0,
        },
      });
    } catch (error: any) {
      console.error("Failed to fetch analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics", message: error.message });
    }
  });

  // Get admin dashboard analytics
  app.get("/api/admin/analytics", async (req, res) => {
    try {
      const { period = 'this-month' } = req.query;

      // Calculate date ranges based on period
      const now = new Date();
      let startDate = new Date();
      let previousStartDate = new Date();
      let previousEndDate = new Date();

      switch (period) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          previousStartDate = new Date(startDate);
          previousStartDate.setDate(previousStartDate.getDate() - 1);
          previousEndDate = new Date(startDate);
          break;
        case 'this-week':
          const dayOfWeek = now.getDay();
          startDate.setDate(now.getDate() - dayOfWeek);
          startDate.setHours(0, 0, 0, 0);
          previousStartDate = new Date(startDate);
          previousStartDate.setDate(previousStartDate.getDate() - 7);
          previousEndDate = new Date(startDate);
          break;
        case 'this-month':
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          previousEndDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'this-year':
          startDate = new Date(now.getFullYear(), 0, 1);
          previousStartDate = new Date(now.getFullYear() - 1, 0, 1);
          previousEndDate = new Date(now.getFullYear(), 0, 1);
          break;
      }

      // Fetch all data across all vendors
      const [allVendors, allOrdersResult, allBookings, allCategories, allServices] = await Promise.all([
        storage.getAllVendors(),
        storage.getAllOrders ? storage.getAllOrders({}) : Promise.resolve({ orders: [], total: 0 }),
        storage.getAllBookings ? storage.getAllBookings() : Promise.resolve([]),
        storage.getAllCategories ? storage.getAllCategories() : Promise.resolve([]),
        storage.getAllMasterServices ? storage.getAllMasterServices() : Promise.resolve([]),
      ]);

      // Extract orders array from result
      const allOrders = allOrdersResult.orders || [];

      // Filter current period data
      const currentOrders = allOrders.filter(o => new Date(o.createdAt) >= startDate);
      const currentBookings = allBookings.filter(b => new Date(b.createdAt) >= startDate);
      const currentVendors = allVendors.filter(v => new Date(v.createdAt) >= startDate);

      // Filter previous period data
      const previousOrders = allOrders.filter(o => {
        const date = new Date(o.createdAt);
        return date >= previousStartDate && date < previousEndDate;
      });
      const previousBookings = allBookings.filter(b => {
        const date = new Date(b.createdAt);
        return date >= previousStartDate && date < previousEndDate;
      });

      // Calculate metrics
      const totalRevenue = currentOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const previousRevenue = previousOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const revenueChange = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue * 100).toFixed(1) : '0.0';

      const totalBookings = currentBookings.length;
      const previousBookingsCount = previousBookings.length;
      const bookingsChange = previousBookingsCount > 0 ? ((totalBookings - previousBookingsCount) / previousBookingsCount * 100).toFixed(1) : '0.0';

      const activeVendors = allVendors.filter(v => v.status === 'approved').length;
      const newVendors = currentVendors.filter(v => v.status === 'approved').length;

      // Calculate platform growth (overall)
      const totalCurrentActivity = currentOrders.length + currentBookings.length;
      const totalPreviousActivity = previousOrders.length + previousBookings.length;
      const platformGrowth = totalPreviousActivity > 0 
        ? ((totalCurrentActivity - totalPreviousActivity) / totalPreviousActivity * 100).toFixed(1) 
        : '0.0';

      // Category distribution (based on services)
      const categoryMap = new Map<string, number>();
      allServices.forEach(service => {
        const category = service.category || 'Others';
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });
      
      const categoryDistribution = Array.from(categoryMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Top 5 categories

      // Marketplace performance by month (last 6 months)
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        
        const monthOrders = allOrders.filter(o => {
          const orderDate = new Date(o.createdAt);
          return orderDate >= monthDate && orderDate < nextMonthDate;
        });
        
        const monthBookings = allBookings.filter(b => {
          const bookingDate = new Date(b.createdAt);
          return bookingDate >= monthDate && bookingDate < nextMonthDate;
        });
        
        const monthRevenue = monthOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        
        monthlyData.push({
          month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
          revenue: monthRevenue,
          bookings: monthBookings.length,
        });
      }

      res.json({
        totalRevenue: {
          value: totalRevenue,
          change: parseFloat(revenueChange),
          changeText: `${revenueChange > 0 ? '+' : ''}${revenueChange}%`,
          positive: parseFloat(revenueChange) >= 0,
        },
        activeVendors: {
          value: activeVendors,
          newVendors: newVendors,
          changeText: `${newVendors} new`,
        },
        totalBookings: {
          value: totalBookings,
          change: parseFloat(bookingsChange),
          changeText: `${bookingsChange > 0 ? '+' : ''}${bookingsChange}%`,
          positive: parseFloat(bookingsChange) >= 0,
        },
        platformGrowth: {
          value: `${platformGrowth > 0 ? '+' : ''}${platformGrowth}%`,
          change: parseFloat(platformGrowth),
        },
        categoryDistribution,
        marketplacePerformance: monthlyData,
      });
    } catch (error: any) {
      console.error("Failed to fetch admin analytics:", error);
      res.status(500).json({ error: "Failed to fetch admin analytics", message: error.message });
    }
  });

  // Get single order by ID
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  // Get order items for a specific order
  app.get("/api/orders/:id/items", async (req, res) => {
    try {
      const orderItems = await storage.getOrderItems(req.params.id);
      res.json(orderItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order items" });
    }
  });

  // Create order item (for POS and other sources)
  app.post("/api/orders/:orderId/items", async (req, res) => {
    try {
      const { orderId } = req.params;
      const itemData = req.body;

      console.log('📦 [Order Items] Creating item for order:', orderId);
      console.log('📦 [Order Items] Item data:', JSON.stringify(itemData, null, 2));

      // Validate required fields
      if (!itemData.vendorProductId) {
        return res.status(400).json({ 
          error: "Missing required field: vendorProductId" 
        });
      }

      // ✅ VALIDATE STOCK AVAILABILITY
      const product = await storage.getVendorProduct(itemData.vendorProductId);
      if (!product) {
        console.error(`❌ Product not found: ${itemData.vendorProductId}`);
        return res.status(404).json({ 
          error: "Product not found",
          message: `Product ${itemData.productName} not found in inventory`
        });
      }
      
      if (product.stock === 0) {
        console.error(`❌ Out of stock: ${product.name} (Stock: 0)`);
        return res.status(400).json({ 
          error: "Out of stock",
          message: `${product.name} is currently out of stock`,
          productName: product.name,
          availableStock: 0
        });
      }
      
      if (product.stock < itemData.quantity) {
        console.error(`❌ Insufficient stock: ${product.name} (Available: ${product.stock}, Requested: ${itemData.quantity})`);
        return res.status(400).json({ 
          error: "Insufficient stock",
          message: `${product.name} - Only ${product.stock} available, but ${itemData.quantity} requested`,
          productName: product.name,
          availableStock: product.stock,
          requestedQuantity: itemData.quantity
        });
      }
      
      console.log(`✅ Stock validation passed: ${product.name} (Available: ${product.stock}, Requested: ${itemData.quantity})`);

      const orderItem = {
        orderId: orderId,
        vendorProductId: itemData.vendorProductId, // Changed from productId
        productName: itemData.productName || '',
        productBrand: itemData.productBrand || null,
        productUnit: itemData.productUnit || 'pcs',
        quantity: itemData.quantity || 1,
        pricePerUnit: itemData.pricePerUnit || 0,
        totalPrice: itemData.totalPrice || 0,
      };

      console.log('📦 [Order Items] Creating order item with data:', JSON.stringify(orderItem, null, 2));
      
      const createdItem = await storage.createOrderItem(orderItem);
      console.log('✅ [Order Items] Item created:', createdItem.id);

      res.status(201).json(createdItem);
    } catch (error: any) {
      console.error('❌ [Order Items] Failed to create item:', error);
      console.error('❌ [Order Items] Error stack:', error.stack);
      res.status(500).json({ 
        error: "Failed to create order item",
        message: error.message 
      });
    }
  });

  // Update order (status, tracking, etc.)
  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const updates = { ...req.body };
      if (req.body.status === "delivered") {
        updates.deliveredAt = new Date();
      }

      // Get the existing order to check previous status
      const existingOrder = await storage.getOrder(req.params.id);
      if (!existingOrder) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Auto-deduct stock when order is confirmed, completed, or delivered (if not already done)
      const shouldDeductStock = (
        (req.body.status === "confirmed" || req.body.status === "completed" || req.body.status === "delivered") &&
        (existingOrder.status !== "confirmed" && existingOrder.status !== "completed" && existingOrder.status !== "delivered")
      );

      if (shouldDeductStock) {
        // Get order items to deduct stock
        const orderItems = await storage.getOrderItems(req.params.id);
        
        // Deduct stock for each item - abort order update if stock deduction fails
        try {
          for (const item of orderItems) {
            await storage.recordStockOut(
              item.vendorProductId,
              item.quantity,
              {
                movementType: 'sale',
                referenceType: 'order',
                referenceId: req.params.id,
                reason: `Order ${req.params.id} confirmed`,
                notes: `Auto-deducted for order ${req.params.id}`,
              }
            );
          }
        } catch (stockError) {
          console.error(`Failed to deduct stock for order ${req.params.id}:`, stockError);
          return res.status(500).json({ 
            error: "Failed to deduct stock for order",
            details: stockError instanceof Error ? stockError.message : String(stockError)
          });
        }
      }

      const order = await storage.updateOrder(req.params.id, updates);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: "Failed to update order" });
    }
  });

  // ====================
  // EMPLOYEES
  // ====================

  // Get vendor's employees
  app.get("/api/vendors/:vendorId/employees", async (req, res) => {
    try {
      const employees = await storage.getEmployeesByVendor(req.params.vendorId);
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });

  // Create employee
  app.post("/api/vendors/:vendorId/employees", async (req, res) => {
    try {
      const validatedData = insertEmployeeSchema.parse({
        ...req.body,
        vendorId: req.params.vendorId,
      });
      const employee = await storage.createEmployee(validatedData);
      res.status(201).json(employee);
    } catch (error) {
      res.status(400).json({ error: "Invalid employee data" });
    }
  });

  // Update employee
  app.patch("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.updateEmployee(req.params.id, req.body);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(400).json({ error: "Failed to update employee" });
    }
  });

  // Delete employee
  app.delete("/api/employees/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteEmployee(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete employee" });
    }
  });

  // ====================
  // TASKS
  // ====================

  // Get vendor's tasks
  app.get("/api/vendors/:vendorId/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasksByVendor(req.params.vendorId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  // Create task
  app.post("/api/vendors/:vendorId/tasks", async (req, res) => {
    try {
      console.log("[TASK] Creating task with body:", JSON.stringify(req.body, null, 2));
      
      const vendorId = req.params.vendorId;
      
      // Build task data with vendorId as default createdBy if not provided
      const taskData = {
        ...req.body,
        vendorId,
        // Use vendorId as createdBy if not provided (since vendor is creating the task)
        createdBy: req.body.createdBy || vendorId,
      };
      
      // If assignedTo is empty string, set to null
      if (taskData.assignedTo === "") {
        taskData.assignedTo = null;
      }
      
      const validatedData = insertTaskSchema.parse(taskData);
      
      // Verify the createdBy user/vendor exists before inserting
      if (validatedData.createdBy && validatedData.createdBy !== vendorId) {
        try {
          const userExists = await storage.getUser(validatedData.createdBy);
          if (!userExists) {
            console.warn('[TASK] User not found for createdBy:', validatedData.createdBy);
            // Fallback to vendorId if user doesn't exist
            (validatedData as any).createdBy = vendorId;
          }
        } catch (userCheckError) {
          console.error('[TASK] Error checking user:', userCheckError);
          (validatedData as any).createdBy = vendorId;
        }
      }
      
      // Similarly, verify assignedTo employee exists if provided
      if (validatedData.assignedTo) {
        try {
          const employeeExists = await storage.getEmployee(validatedData.assignedTo);
          if (!employeeExists) {
            console.warn('[TASK] Employee not found for assignedTo:', validatedData.assignedTo);
            (validatedData as any).assignedTo = null;
          }
        } catch (employeeCheckError) {
          console.error('[TASK] Error checking employee:', employeeCheckError);
        }
      }
      
      const task = await storage.createTask(validatedData);
      console.log('[TASK] Task created successfully:', task.id);
      res.status(201).json(task);
    } catch (error: any) {
      console.error("[TASK] Task creation error:", error);
      if (error instanceof Error) {
        console.error("[TASK] Error message:", error.message);
        console.error("[TASK] Error stack:", error.stack);
      }
      
      // Handle foreign key constraint errors
      let errorDetails = error instanceof Error ? error.message : String(error);
      if (error.code === '23503' || errorDetails.includes('foreign key constraint')) {
        console.error("[TASK] Foreign key constraint violation");
        errorDetails = "Invalid user, employee, or vendor reference. Please check the IDs.";
      }
      
      res.status(400).json({ error: "Invalid task data", details: errorDetails });
    }
  });

  // Update task
  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const updates = { ...req.body };
      if (req.body.status === "completed") {
        updates.completedAt = new Date();
      }
      const task = await storage.updateTask(req.params.id, updates);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: "Failed to update task" });
    }
  });

  // Delete task
  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTask(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // ====================
  // COUPONS
  // ====================

  // Get vendor's coupons
  app.get("/api/vendors/:vendorId/coupons", async (req, res) => {
    try {
      const coupons = await storage.getCouponsByVendor(req.params.vendorId);
      res.json(coupons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch coupons" });
    }
  });

  // Validate coupon by code
  app.get("/api/coupons/validate/:code", async (req, res) => {
    try {
      const { vendorId, subtotal } = req.query;
      
      if (!vendorId) {
        return res.status(400).json({ error: "vendorId query parameter is required" });
      }
      
      console.log(`🎟️  Validating coupon: ${req.params.code} for vendor: ${vendorId}`);
      
      const coupon = await storage.getCouponByCode(req.params.code, vendorId as string);
      if (!coupon) {
        return res.status(404).json({ error: "Coupon not found" });
      }
      
      // Check if coupon belongs to vendor
      if (coupon.vendorId !== vendorId) {
        return res.status(404).json({ error: "Coupon not found for this vendor" });
      }
      
      // Check if active
      if (coupon.status !== "active") {
        return res.status(400).json({ error: "Coupon is not active" });
      }
      
      // Check if expired
      if (new Date(coupon.expiryDate) < new Date()) {
        return res.status(400).json({ error: "Coupon has expired" });
      }

      // Check if max usage reached
      if (coupon.usedCount >= coupon.maxUsage) {
        return res.status(400).json({ error: "Coupon usage limit reached" });
      }

      // Check minimum order amount if subtotal is provided
      if (subtotal && parseFloat(subtotal as string) < coupon.minOrderAmount) {
        return res.status(400).json({ 
          error: `Minimum order amount is ₹${coupon.minOrderAmount}`,
          minOrderAmount: coupon.minOrderAmount
        });
      }

      console.log(`✅ Coupon valid: ${coupon.code} - ${coupon.discountType} ${coupon.discountValue}`);
      res.json(coupon);
    } catch (error) {
      console.error('❌ Coupon validation error:', error);
      res.status(500).json({ error: "Failed to validate coupon" });
    }
  });

  // Create coupon
  app.post("/api/vendors/:vendorId/coupons", async (req, res) => {
    try {
      const validatedData = insertCouponSchema.parse({
        ...req.body,
        vendorId: req.params.vendorId,
      });
      const coupon = await storage.createCoupon(validatedData);
      res.status(201).json(coupon);
    } catch (error) {
      console.error("Coupon validation error:", error);
      res.status(400).json({ error: "Invalid coupon data", details: error instanceof Error ? error.message : "Validation failed" });
    }
  });

  // Update coupon
  app.patch("/api/coupons/:id", async (req, res) => {
    try {
      const coupon = await storage.updateCoupon(req.params.id, req.body);
      if (!coupon) {
        return res.status(404).json({ error: "Coupon not found" });
      }
      res.json(coupon);
    } catch (error) {
      res.status(400).json({ error: "Failed to update coupon" });
    }
  });

  // Delete coupon
  app.delete("/api/coupons/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCoupon(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Coupon not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete coupon" });
    }
  });

  // ====================
  // TRANSACTIONS
  // ====================

  // Get vendor's transactions
  app.get("/api/vendors/:vendorId/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactionsByVendor(req.params.vendorId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  // ====================
  // NOTIFICATIONS
  // ====================

  // Get user's notifications
  app.get("/api/users/:userId/notifications", async (req, res) => {
    try {
      const notifications = await storage.getNotificationsByUser(req.params.userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  // Mark notification as read
  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const success = await storage.markNotificationAsRead(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Notification not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  // Get vendor's notifications
  app.get("/api/vendors/:vendorId/notifications", async (req, res) => {
    try {
      const vendorId = req.params.vendorId;
      console.log(`[NOTIFICATIONS] Fetching notifications for vendor: ${vendorId}`);
      
      const notifications = await storage.getNotificationsByVendor(vendorId);
      console.log(`[NOTIFICATIONS] Found ${notifications.length} notifications`);
      
      // Sort by createdAt desc (newest first)
      const sortedNotifications = notifications.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      res.json(sortedNotifications);
    } catch (error) {
      console.error("Failed to fetch vendor notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  // Update notification (mark as read)
  app.patch("/api/notifications/:id", async (req, res) => {
    try {
      const notification = await storage.updateNotification(req.params.id, req.body);
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }
      res.json(notification);
    } catch (error) {
      console.error("Failed to update notification:", error);
      res.status(500).json({ error: "Failed to update notification" });
    }
  });

  // Mark all vendor notifications as read
  app.patch("/api/vendors/:vendorId/notifications/mark-all-read", async (req, res) => {
    try {
      await storage.markAllVendorNotificationsAsRead(req.params.vendorId);
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      res.status(500).json({ error: "Failed to mark notifications as read" });
    }
  });

  // Create notification (for module integrations)
  app.post("/api/notifications", async (req, res) => {
    try {
      console.log('[NOTIFICATIONS] Creating notification:', req.body);
      const notificationData = {
        ...req.body,
        id: `notif-${nanoid()}`,
        createdAt: new Date(),
        read: false,
      };
      const notification = await storage.createNotification(notificationData);
      console.log('[NOTIFICATIONS] Notification created:', notification.id);
      res.status(201).json(notification);
    } catch (error) {
      console.error("Failed to create notification:", error);
      res.status(500).json({ error: "Failed to create notification" });
    }
  });

  // Delete notification
  app.delete("/api/notifications/:id", async (req, res) => {
    try {
      const success = await storage.deleteNotification(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Notification not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete notification:", error);
      res.status(500).json({ error: "Failed to delete notification" });
    }
  });

  // Create test notification (for debugging)
  app.post("/api/vendors/:vendorId/notifications/test", async (req, res) => {
    try {
      const vendorId = req.params.vendorId;
      const testNotification = {
        userId: null, // System notification
        vendorId: vendorId,
        title: "🔔 Test Notification",
        message: "This is a test notification to verify the notification bell is working correctly!",
        type: "info",
        read: false,
        link: "/vendor/dashboard",
      };
      
      const notification = await storage.createNotification(testNotification);
      console.log('[DEBUG] Test notification created:', notification);
      res.json(notification);
    } catch (error) {
      console.error("Failed to create test notification:", error);
      res.status(500).json({ error: "Failed to create test notification" });
    }
  });

  // ====================
  // MASTER PRODUCTS (Admin)
  // ====================

  // Get all master products
  app.get("/api/master-products", async (req, res) => {
    try {
      const { universal } = req.query;
      const isUniversal = universal === "true" ? true : universal === "false" ? false : undefined;
      const products = await storage.getAllMasterProducts(isUniversal);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch master products" });
    }
  });

  // Get single master product
  app.get("/api/master-products/:id", async (req, res) => {
    try {
      const product = await storage.getMasterProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Create master product
  app.post("/api/master-products", async (req, res) => {
    try {
      const validatedData = insertMasterProductSchema.parse(req.body);
      const product = await storage.createMasterProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  // Update master product
  app.patch("/api/master-products/:id", async (req, res) => {
    try {
      const product = await storage.updateMasterProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: "Failed to update product" });
    }
  });

  // Delete master product
  app.delete("/api/master-products/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteMasterProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // ====================
  // VENDOR PRODUCTS
  // ====================

  // Get vendor's products
  app.get("/api/vendors/:vendorId/products", async (req, res) => {
    try {
      const products = await storage.getVendorProductsByVendor(req.params.vendorId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vendor products" });
    }
  });

  // Create vendor product
  app.post("/api/vendors/:vendorId/products", async (req, res) => {
    try {
      console.log("📦 Creating vendor product for vendor:", req.params.vendorId);
      console.log("📦 Request body:", JSON.stringify(req.body, null, 2));
      
      const validatedData = insertVendorProductSchema.parse({
        ...req.body,
        vendorId: req.params.vendorId,
      });
      
      console.log("✅ Validation passed, creating product...");
      const product = await storage.createVendorProduct(validatedData);
      console.log("✅ Product created:", product.id);
      res.status(201).json(product);
    } catch (error: any) {
      console.error("❌ Vendor product creation error:", error);
      if (error.name === 'ZodError') {
        console.error("Validation errors:", JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ 
          error: "Invalid product data", 
          details: error.errors,
          message: error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')
        });
      }
      res.status(400).json({ 
        error: "Invalid product data",
        message: error.message 
      });
    }
  });

  // Update vendor product
  app.patch("/api/vendor-products/:id", async (req, res) => {
    try {
      const product = await storage.updateVendorProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: "Failed to update product" });
    }
  });

  // Delete vendor product
  app.delete("/api/vendor-products/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteVendorProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // ====================
  // EMPLOYEES
  // ====================

  // Get all employees for a vendor
  app.get("/api/vendors/:vendorId/employees", async (req, res) => {
    try {
      const employees = await storage.getEmployeesByVendor(req.params.vendorId);
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });

  // Get single employee
  app.get("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.getEmployee(req.params.id);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employee" });
    }
  });

  // Create employee
  app.post("/api/vendors/:vendorId/employees", async (req, res) => {
    try {
      const validatedData = insertEmployeeSchema.parse({
        ...req.body,
        vendorId: req.params.vendorId,
      });
      const employee = await storage.createEmployee(validatedData);
      res.status(201).json(employee);
    } catch (error) {
      res.status(400).json({ error: "Invalid employee data" });
    }
  });

  // Update employee
  app.patch("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.updateEmployee(req.params.id, req.body);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(400).json({ error: "Failed to update employee" });
    }
  });

  // Delete employee
  app.delete("/api/employees/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteEmployee(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete employee" });
    }
  });

  // ====================
  // TASKS (Additional Routes)
  // ====================

  // Get tasks for an employee
  app.get("/api/employees/:employeeId/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasksByEmployee(req.params.employeeId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employee tasks" });
    }
  });

  // Get single task by ID
  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.getTask(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch task" });
    }
  });

  // ====================
  // ATTENDANCE
  // ====================

  // Get all attendance records for a vendor
  app.get("/api/vendors/:vendorId/attendance", async (req, res) => {
    try {
      const records = await storage.getAttendanceByVendor(req.params.vendorId);
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch attendance records" });
    }
  });

  // Get attendance records for an employee
  app.get("/api/employees/:employeeId/attendance", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      let records;
      
      if (startDate && endDate) {
        records = await storage.getAttendanceByDateRange(
          req.params.employeeId,
          new Date(startDate as string),
          new Date(endDate as string)
        );
      } else {
        records = await storage.getAttendanceByEmployee(req.params.employeeId);
      }
      
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employee attendance" });
    }
  });

  // Create attendance record (clock-in)
  app.post("/api/employees/:employeeId/attendance", async (req, res) => {
    try {
      const validatedData = insertAttendanceSchema.parse({
        ...req.body,
        employeeId: req.params.employeeId,
      });
      const record = await storage.createAttendance(validatedData);
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ error: "Invalid attendance data" });
    }
  });

  // Update attendance record (clock-out, status)
  app.patch("/api/attendance/:id", async (req, res) => {
    try {
      const record = await storage.updateAttendance(req.params.id, req.body);
      if (!record) {
        return res.status(404).json({ error: "Attendance record not found" });
      }
      res.json(record);
    } catch (error) {
      res.status(400).json({ error: "Failed to update attendance" });
    }
  });

  // Delete attendance record
  app.delete("/api/attendance/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAttendance(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Attendance record not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete attendance record" });
    }
  });

  // ====================
  // LEAVES
  // ====================

  // Get all leave requests for a vendor
  app.get("/api/vendors/:vendorId/leaves", async (req, res) => {
    try {
      const leaves = await storage.getLeavesByVendor(req.params.vendorId);
      res.json(leaves);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leave requests" });
    }
  });

  // Get leave requests for an employee
  app.get("/api/employees/:employeeId/leaves", async (req, res) => {
    try {
      const leaves = await storage.getLeavesByEmployee(req.params.employeeId);
      res.json(leaves);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employee leaves" });
    }
  });

  // Create leave request
  app.post("/api/employees/:employeeId/leaves", async (req, res) => {
    try {
      const validatedData = insertLeaveSchema.parse({
        ...req.body,
        employeeId: req.params.employeeId,
      });
      const leave = await storage.createLeave(validatedData);
      res.status(201).json(leave);
    } catch (error) {
      res.status(400).json({ error: "Invalid leave data" });
    }
  });

  // Update leave request (approve/reject)
  app.patch("/api/leaves/:id", async (req, res) => {
    try {
      const leave = await storage.updateLeave(req.params.id, req.body);
      if (!leave) {
        return res.status(404).json({ error: "Leave request not found" });
      }
      res.json(leave);
    } catch (error) {
      res.status(400).json({ error: "Failed to update leave request" });
    }
  });

  // Delete leave request
  app.delete("/api/leaves/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteLeave(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Leave request not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete leave request" });
    }
  });

  // ====================
  // LEAVE BALANCES
  // ====================

  // Get leave balances for an employee
  app.get("/api/employees/:employeeId/leave-balances", async (req, res) => {
    try {
      const balances = await storage.getLeaveBalancesByEmployee(req.params.employeeId);
      res.json(balances);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leave balances" });
    }
  });

  // Create leave balance
  app.post("/api/employees/:employeeId/leave-balances", async (req, res) => {
    try {
      const validatedData = insertLeaveBalanceSchema.parse({
        ...req.body,
        employeeId: req.params.employeeId,
      });
      const balance = await storage.createLeaveBalance(validatedData);
      res.status(201).json(balance);
    } catch (error) {
      res.status(400).json({ error: "Invalid leave balance data" });
    }
  });

  // Update leave balance
  app.patch("/api/leave-balances/:id", async (req, res) => {
    try {
      const balance = await storage.updateLeaveBalance(req.params.id, req.body);
      if (!balance) {
        return res.status(404).json({ error: "Leave balance not found" });
      }
      res.json(balance);
    } catch (error) {
      res.status(400).json({ error: "Failed to update leave balance" });
    }
  });

  // ====================
  // PAYROLL
  // ====================

  // Get all payroll records for a vendor
  app.get("/api/vendors/:vendorId/payroll", async (req, res) => {
    try {
      const payroll = await storage.getPayrollByVendor(req.params.vendorId);
      res.json(payroll);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payroll records" });
    }
  });

  // Get payroll records for an employee
  app.get("/api/employees/:employeeId/payroll", async (req, res) => {
    try {
      const payroll = await storage.getPayrollByEmployee(req.params.employeeId);
      res.json(payroll);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employee payroll" });
    }
  });

  // Create payroll record
  app.post("/api/employees/:employeeId/payroll", async (req, res) => {
    try {
      const validatedData = insertPayrollSchema.parse({
        ...req.body,
        employeeId: req.params.employeeId,
      });
      const payroll = await storage.createPayroll(validatedData);
      res.status(201).json(payroll);
    } catch (error) {
      res.status(400).json({ error: "Invalid payroll data" });
    }
  });

  // Update payroll record
  app.patch("/api/payroll/:id", async (req, res) => {
    try {
      const payroll = await storage.updatePayroll(req.params.id, req.body);
      if (!payroll) {
        return res.status(404).json({ error: "Payroll record not found" });
      }
      res.json(payroll);
    } catch (error) {
      res.status(400).json({ error: "Failed to update payroll" });
    }
  });

  // Delete payroll record
  app.delete("/api/payroll/:id", async (req, res) => {
    try {
      const deleted = await storage.deletePayroll(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Payroll record not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete payroll record" });
    }
  });

  // ====================
  // HOLIDAYS
  // ====================

  // Get all holidays for a vendor
  app.get("/api/vendors/:vendorId/holidays", async (req, res) => {
    try {
      const holidays = await storage.getHolidaysByVendor(req.params.vendorId);
      res.json(holidays);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch holidays" });
    }
  });

  // Create holiday
  app.post("/api/vendors/:vendorId/holidays", async (req, res) => {
    try {
      const validatedData = insertHolidaySchema.parse({
        ...req.body,
        vendorId: req.params.vendorId,
      });
      const holiday = await storage.createHoliday(validatedData);
      res.status(201).json(holiday);
    } catch (error) {
      res.status(400).json({ error: "Invalid holiday data" });
    }
  });

  // Update holiday
  app.patch("/api/holidays/:id", async (req, res) => {
    try {
      const holiday = await storage.updateHoliday(req.params.id, req.body);
      if (!holiday) {
        return res.status(404).json({ error: "Holiday not found" });
      }
      res.json(holiday);
    } catch (error) {
      res.status(400).json({ error: "Failed to update holiday" });
    }
  });

  // Delete holiday
  app.delete("/api/holidays/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteHoliday(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Holiday not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete holiday" });
    }
  });

  // ========== Customer Management Routes ==========

  // Get all customers for a vendor
  app.get("/api/vendors/:vendorId/customers", async (req, res) => {
    try {
      const { status, search } = req.query;
      let customers;
      
      if (search && typeof search === "string") {
        customers = await storage.searchCustomers(req.params.vendorId, search);
      } else if (status && typeof status === "string") {
        customers = await storage.getCustomersByVendor(req.params.vendorId, status);
      } else {
        customers = await storage.getCustomersByVendor(req.params.vendorId);
      }
      
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  // Get single customer
  app.get("/api/customers/:id", async (req, res) => {
    try {
      const customer = await storage.getCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer" });
    }
  });

  // Create customer
  app.post("/api/vendors/:vendorId/customers", async (req, res) => {
    try {
      const { insertCustomerSchema } = await import("@shared/schema");
      const validatedData = insertCustomerSchema.parse({
        ...req.body,
        vendorId: req.params.vendorId,
      });
      const customer = await storage.createCustomer(validatedData);
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ error: "Invalid customer data" });
    }
  });

  // Update customer
  app.patch("/api/customers/:id", async (req, res) => {
    try {
      const customer = await storage.updateCustomer(req.params.id, req.body);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      res.status(400).json({ error: "Failed to update customer" });
    }
  });

  // Delete customer
  app.delete("/api/customers/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCustomer(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete customer" });
    }
  });

  // Get customer's order history (products)
  app.get("/api/customers/:id/orders", async (req, res) => {
    try {
      const customer = await storage.getCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      // Only return orders for this vendor to ensure data isolation
      const orders = await storage.getCustomerOrders(customer.phone, customer.vendorId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer orders" });
    }
  });

  // Get customer's booking history (services)
  app.get("/api/customers/:id/bookings", async (req, res) => {
    try {
      const customer = await storage.getCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      // Only return bookings for this vendor to ensure data isolation
      const bookings = await storage.getCustomerBookings(customer.phone, customer.vendorId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer bookings" });
    }
  });

  // ========== Supplier Management Routes ==========

  // Get all suppliers for a vendor
  app.get("/api/vendors/:vendorId/suppliers", async (req, res) => {
    try {
      const { search, status, category } = req.query;
      let suppliers;

      if (search) {
        suppliers = await storage.searchSuppliers(req.params.vendorId, search as string);
      } else {
        suppliers = await storage.getSuppliersByVendor(req.params.vendorId, {
          status: status as string,
          category: category as string
        });
      }

      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch suppliers" });
    }
  });

  // Get single supplier (vendor-scoped)
  app.get("/api/vendors/:vendorId/suppliers/:id", async (req, res) => {
    try {
      const supplier = await storage.getSupplier(req.params.id);
      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      // Enforce vendor isolation - ensure supplier belongs to requesting vendor
      if (supplier.vendorId !== req.params.vendorId) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch supplier" });
    }
  });

  // Create supplier
  app.post("/api/vendors/:vendorId/suppliers", async (req, res) => {
    try {
      const { insertSupplierSchema } = await import("@shared/schema");
      
      // Prepare data with vendorId from URL
      const supplierData = {
        ...req.body,
        vendorId: req.params.vendorId,
      };
      
      // Validate the data
      const validatedData = insertSupplierSchema.parse(supplierData);
      
      const supplier = await storage.createSupplier(validatedData);
      res.status(201).json(supplier);
    } catch (error: any) {
      console.error("Supplier creation error:", error);
      
      // Return more detailed error message
      if (error.name === 'ZodError') {
        const issues = error.issues?.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ');
        return res.status(400).json({ error: `Validation failed: ${issues}` });
      }
      
      res.status(400).json({ error: error.message || "Invalid supplier data" });
    }
  });

  // Update supplier (vendor-scoped)
  app.patch("/api/vendors/:vendorId/suppliers/:id", async (req, res) => {
    try {
      // First verify supplier exists and check vendor ownership
      const existingSupplier = await storage.getSupplier(req.params.id);
      if (!existingSupplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      // Enforce vendor isolation
      if (existingSupplier.vendorId !== req.params.vendorId) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      // Don't allow vendorId to be changed via update
      const { vendorId, ...updateData } = req.body;
      const supplier = await storage.updateSupplier(req.params.id, updateData);
      res.json(supplier);
    } catch (error: any) {
      console.error("Supplier update error:", error);
      res.status(400).json({ error: error.message || "Failed to update supplier" });
    }
  });

  // Delete supplier (vendor-scoped)
  app.delete("/api/vendors/:vendorId/suppliers/:id", async (req, res) => {
    try {
      // First verify supplier exists and check vendor ownership
      const existingSupplier = await storage.getSupplier(req.params.id);
      if (!existingSupplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      // Enforce vendor isolation
      if (existingSupplier.vendorId !== req.params.vendorId) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      const deleted = await storage.deleteSupplier(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete supplier" });
    }
  });

  // ========== Supplier Payments Routes ==========

  // Get payments for a supplier (vendor-scoped)
  app.get("/api/vendors/:vendorId/suppliers/:supplierId/payments", async (req, res) => {
    try {
      // First verify supplier exists and check vendor ownership
      const supplier = await storage.getSupplier(req.params.supplierId);
      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      // Enforce vendor isolation
      if (supplier.vendorId !== req.params.vendorId) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      const payments = await storage.getSupplierPayments(req.params.supplierId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  // Get all payments for a vendor
  app.get("/api/vendors/:vendorId/supplier-payments", async (req, res) => {
    try {
      const payments = await storage.getPaymentsByVendor(req.params.vendorId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  // Create supplier payment (vendor-scoped)
  app.post("/api/vendors/:vendorId/suppliers/:supplierId/payments", async (req, res) => {
    try {
      // First verify supplier exists and check vendor ownership
      const supplier = await storage.getSupplier(req.params.supplierId);
      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      // Enforce vendor isolation
      if (supplier.vendorId !== req.params.vendorId) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      
      // Derive vendorId from supplier record (trusted source) instead of accepting from client
      const { insertSupplierPaymentSchema } = await import("@shared/schema");
      const validatedData = insertSupplierPaymentSchema.parse({
        ...req.body,
        supplierId: req.params.supplierId,
        vendorId: supplier.vendorId, // Use trusted vendorId from supplier record
      });
      const payment = await storage.createSupplierPayment(validatedData);
      res.status(201).json(payment);
    } catch (error) {
      res.status(400).json({ error: "Invalid payment data" });
    }
  });

  // Delete supplier payment (vendor-scoped)
  app.delete("/api/vendors/:vendorId/suppliers/:supplierId/payments/:paymentId", async (req, res) => {
    try {
      // First verify payment exists and get supplier info for vendor check
      const payment = await storage.getSupplierPayment(req.params.paymentId);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      
      // Verify supplier ownership
      const supplier = await storage.getSupplier(payment.supplierId);
      if (!supplier || supplier.vendorId !== req.params.vendorId) {
        return res.status(404).json({ error: "Payment not found" });
      }
      
      // Verify payment belongs to this supplier
      if (payment.supplierId !== req.params.supplierId) {
        return res.status(404).json({ error: "Payment not found" });
      }
      
      const deleted = await storage.deleteSupplierPayment(req.params.paymentId);
      if (!deleted) {
        return res.status(404).json({ error: "Payment not found" });
      }
      res.json({ message: "Payment deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete payment" });
    }
  });

  // ========== Expense Routes ==========

  // Get all expenses for a vendor with filtering
  app.get("/api/vendors/:vendorId/expenses", async (req, res) => {
    try {
      const { category, paymentType, status, supplierId, department, isRecurring, startDate, endDate, search } = req.query;
      
      if (search && typeof search === 'string') {
        const expenses = await storage.searchExpenses(req.params.vendorId, search);
        return res.json(expenses);
      }
      
      const filters: any = {};
      if (category) filters.category = category;
      if (paymentType) filters.paymentType = paymentType;
      if (status) filters.status = status;
      if (supplierId) filters.supplierId = supplierId;
      if (department) filters.department = department;
      if (isRecurring !== undefined) filters.isRecurring = isRecurring === 'true';
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      
      const expenses = await storage.getExpensesByVendor(req.params.vendorId, filters);
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expenses" });
    }
  });

  // Get a single expense (vendor-scoped)
  app.get("/api/vendors/:vendorId/expenses/:id", async (req, res) => {
    try {
      const expense = await storage.getExpense(req.params.id);
      if (!expense) {
        return res.status(404).json({ error: "Expense not found" });
      }
      // Enforce vendor isolation
      if (expense.vendorId !== req.params.vendorId) {
        return res.status(404).json({ error: "Expense not found" });
      }
      res.json(expense);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expense" });
    }
  });

  // Get recurring expenses for a vendor
  app.get("/api/vendors/:vendorId/expenses/recurring/all", async (req, res) => {
    try {
      const expenses = await storage.getRecurringExpenses(req.params.vendorId);
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recurring expenses" });
    }
  });

  // Get upcoming recurring expenses for a vendor
  app.get("/api/vendors/:vendorId/expenses/recurring/upcoming", async (req, res) => {
    try {
      const daysAhead = req.query.daysAhead ? parseInt(req.query.daysAhead as string) : 30;
      const expenses = await storage.getUpcomingRecurringExpenses(req.params.vendorId, daysAhead);
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch upcoming recurring expenses" });
    }
  });

  // Get expenses for a specific supplier
  app.get("/api/suppliers/:supplierId/expenses", async (req, res) => {
    try {
      const expenses = await storage.getExpensesBySupplier(req.params.supplierId);
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch supplier expenses" });
    }
  });

  // Create expense (vendor-scoped)
  app.post("/api/vendors/:vendorId/expenses", async (req, res) => {
    try {
      const { insertExpenseSchema } = await import("@shared/schema");
      
      console.log("📝 Creating expense for vendor:", req.params.vendorId);
      console.log("📝 Request body:", JSON.stringify(req.body, null, 2));
      
      // Convert date strings to Date objects
      const processedBody = {
        ...req.body,
        vendorId: req.params.vendorId,
        expenseDate: req.body.expenseDate ? new Date(req.body.expenseDate) : new Date(),
        recurringStartDate: req.body.recurringStartDate ? new Date(req.body.recurringStartDate) : undefined,
        recurringEndDate: req.body.recurringEndDate ? new Date(req.body.recurringEndDate) : undefined,
        nextDueDate: req.body.nextDueDate ? new Date(req.body.nextDueDate) : undefined,
      };
      
      const validatedData = insertExpenseSchema.parse(processedBody);
      
      console.log("✅ Validation passed, creating expense...");
      
      // If supplier is linked, verify vendor ownership
      if (validatedData.supplierId) {
        const supplier = await storage.getSupplier(validatedData.supplierId);
        if (!supplier || supplier.vendorId !== req.params.vendorId) {
          console.error("❌ Invalid supplier:", validatedData.supplierId);
          return res.status(400).json({ error: "Invalid supplier" });
        }
      }
      
      const expense = await storage.createExpense(validatedData);
      console.log("✅ Expense created:", expense.id);
      res.status(201).json(expense);
    } catch (error: any) {
      console.error("❌ Expense creation error:", error);
      if (error.name === 'ZodError') {
        console.error("Validation errors:", JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ 
          error: "Invalid expense data", 
          details: error.errors,
          message: error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')
        });
      }
      res.status(400).json({ 
        error: "Invalid expense data",
        message: error.message 
      });
    }
  });

  // Update expense (vendor-scoped)
  app.patch("/api/vendors/:vendorId/expenses/:id", async (req, res) => {
    try {
      // First verify expense exists and check vendor ownership
      const existing = await storage.getExpense(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Expense not found" });
      }
      if (existing.vendorId !== req.params.vendorId) {
        return res.status(404).json({ error: "Expense not found" });
      }
      
      // Convert date strings to Date objects
      const processedBody = { ...req.body };
      if (req.body.expenseDate) processedBody.expenseDate = new Date(req.body.expenseDate);
      if (req.body.recurringStartDate) processedBody.recurringStartDate = new Date(req.body.recurringStartDate);
      if (req.body.recurringEndDate) processedBody.recurringEndDate = new Date(req.body.recurringEndDate);
      if (req.body.nextDueDate) processedBody.nextDueDate = new Date(req.body.nextDueDate);
      
      const { insertExpenseSchema } = await import("@shared/schema");
      const validatedData = insertExpenseSchema.partial().parse(processedBody);
      
      const updated = await storage.updateExpense(req.params.id, validatedData);
      if (!updated) {
        return res.status(404).json({ error: "Expense not found" });
      }
      res.json(updated);
    } catch (error: any) {
      console.error("❌ Expense update error:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          error: "Invalid expense data", 
          details: error.errors,
          message: error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')
        });
      }
      res.status(400).json({ error: "Invalid expense data", message: error.message });
    }
  });

  // Delete expense (vendor-scoped)
  app.delete("/api/vendors/:vendorId/expenses/:id", async (req, res) => {
    try {
      // First verify expense exists and check vendor ownership
      const expense = await storage.getExpense(req.params.id);
      if (!expense) {
        return res.status(404).json({ error: "Expense not found" });
      }
      if (expense.vendorId !== req.params.vendorId) {
        return res.status(404).json({ error: "Expense not found" });
      }
      
      const deleted = await storage.deleteExpense(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Expense not found" });
      }
      res.json({ message: "Expense deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete expense" });
    }
  });

  // ========== Customer Visits Routes ==========

  // Get visits for a customer
  app.get("/api/customers/:customerId/visits", async (req, res) => {
    try {
      const visits = await storage.getCustomerVisits(req.params.customerId);
      res.json(visits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch visits" });
    }
  });

  // Get all visits for a vendor
  app.get("/api/vendors/:vendorId/visits", async (req, res) => {
    try {
      const visits = await storage.getVisitsByVendor(req.params.vendorId);
      res.json(visits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch visits" });
    }
  });

  // Create visit
  app.post("/api/customers/:customerId/visits", async (req, res) => {
    try {
      const { insertCustomerVisitSchema } = await import("@shared/schema");
      const validatedData = insertCustomerVisitSchema.parse({
        ...req.body,
        customerId: req.params.customerId,
      });
      const visit = await storage.createCustomerVisit(validatedData);
      res.status(201).json(visit);
    } catch (error) {
      res.status(400).json({ error: "Invalid visit data" });
    }
  });

  // ========== Customer Tasks Routes ==========

  // Get tasks for a customer
  app.get("/api/customers/:customerId/tasks", async (req, res) => {
    try {
      const tasks = await storage.getCustomerTasks(req.params.customerId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  // Get all tasks for a vendor
  app.get("/api/vendors/:vendorId/customer-tasks", async (req, res) => {
    try {
      const { status } = req.query;
      const tasks = await storage.getTasksByVendor(
        req.params.vendorId,
        status as string | undefined
      );
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  // Create customer task
  app.post("/api/vendors/:vendorId/customer-tasks", async (req, res) => {
    try {
      const { insertCustomerTaskSchema } = await import("@shared/schema");
      const validatedData = insertCustomerTaskSchema.parse({
        ...req.body,
        vendorId: req.params.vendorId,
      });
      const task = await storage.createCustomerTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  // Update customer task
  app.patch("/api/customer-tasks/:id", async (req, res) => {
    try {
      const task = await storage.updateCustomerTask(req.params.id, req.body);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: "Failed to update task" });
    }
  });

  // Delete customer task
  app.delete("/api/customer-tasks/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCustomerTask(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // ========== DEMO REQUEST ROUTES ==========

  // Get all demo requests (admin only)
  app.get("/api/demo-requests", async (req, res) => {
    try {
      const { status } = req.query;
      const requests = await storage.getAllDemoRequests(
        status ? { status: status as string } : undefined
      );
      res.json(requests);
    } catch (error) {
      console.error("Failed to fetch demo requests:", error);
      res.status(500).json({ error: "Failed to fetch demo requests" });
    }
  });

  // Get single demo request
  app.get("/api/demo-requests/:id", async (req, res) => {
    try {
      const request = await storage.getDemoRequest(req.params.id);
      if (!request) {
        return res.status(404).json({ error: "Demo request not found" });
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch demo request" });
    }
  });

  // Create demo request (public - from landing page)
  app.post("/api/demo-requests", async (req, res) => {
    try {
      const { insertDemoRequestSchema } = await import("@shared/schema");
      const validatedData = insertDemoRequestSchema.parse(req.body);
      const request = await storage.createDemoRequest(validatedData);
      console.log('[DEMO] New demo request created:', request.id, request.name, request.phone);
      res.status(201).json(request);
    } catch (error: any) {
      console.error("Demo request creation error:", error);
      if (error.name === 'ZodError') {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(400).json({ error: "Failed to create demo request", message: error.message });
      }
    }
  });

  // Update demo request (admin only)
  app.patch("/api/demo-requests/:id", async (req, res) => {
    try {
      const request = await storage.updateDemoRequest(req.params.id, req.body);
      if (!request) {
        return res.status(404).json({ error: "Demo request not found" });
      }
      res.json(request);
    } catch (error) {
      res.status(400).json({ error: "Failed to update demo request" });
    }
  });

  // Delete demo request (admin only)
  app.delete("/api/demo-requests/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDemoRequest(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Demo request not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete demo request" });
    }
  });

  // ========== LEAD MANAGEMENT ROUTES ==========

  // Get all leads for a vendor with optional filters
  app.get("/api/vendors/:vendorId/leads", async (req, res) => {
    try {
      const { status, source, assignedEmployeeId } = req.query;
      const leads = await storage.getLeadsByVendor(req.params.vendorId, {
        status: status as string | undefined,
        source: source as string | undefined,
        assignedEmployeeId: assignedEmployeeId as string | undefined,
      });
      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  // Search leads
  app.get("/api/vendors/:vendorId/leads/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ error: "Search query required" });
      }
      const leads = await storage.searchLeads(req.params.vendorId, q as string);
      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: "Failed to search leads" });
    }
  });

  // Get single lead
  app.get("/api/leads/:id", async (req, res) => {
    try {
      const lead = await storage.getLead(req.params.id);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lead" });
    }
  });

  // Create lead
  app.post("/api/vendors/:vendorId/leads", async (req, res) => {
    try {
      const { insertLeadSchema } = await import("@shared/schema");
      const validatedData = insertLeadSchema.parse({
        ...req.body,
        vendorId: req.params.vendorId,
      });
      const lead = await storage.createLead(validatedData);
      res.status(201).json(lead);
    } catch (error: any) {
      console.error("❌ Lead creation error:", error);
      if (error.name === 'ZodError') {
        console.error("Validation errors:", JSON.stringify(error.errors, null, 2));
        res.status(400).json({ error: "Invalid lead data", details: error.errors });
      } else {
        res.status(400).json({ error: "Invalid lead data", message: error.message });
      }
    }
  });

  // Update lead
  app.patch("/api/leads/:id", async (req, res) => {
    try {
      const lead = await storage.updateLead(req.params.id, req.body);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      res.status(400).json({ error: "Failed to update lead" });
    }
  });

  // Delete lead
  app.delete("/api/leads/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteLead(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete lead" });
    }
  });

  // Convert lead to customer
  app.post("/api/leads/:id/convert", async (req, res) => {
    try {
      const { customerId } = req.body;
      if (!customerId) {
        return res.status(400).json({ error: "customerId required" });
      }
      const lead = await storage.convertLeadToCustomer(req.params.id, customerId);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: "Failed to convert lead" });
    }
  });

  // ========== Lead Communications Routes ==========

  // Get communications for a lead
  app.get("/api/leads/:leadId/communications", async (req, res) => {
    try {
      const communications = await storage.getLeadCommunications(req.params.leadId);
      res.json(communications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch communications" });
    }
  });

  // Create lead communication
  app.post("/api/leads/:leadId/communications", async (req, res) => {
    try {
      const { insertLeadCommunicationSchema } = await import("@shared/schema");
      const validatedData = insertLeadCommunicationSchema.parse({
        ...req.body,
        leadId: req.params.leadId,
      });
      const communication = await storage.createLeadCommunication(validatedData);
      res.status(201).json(communication);
    } catch (error) {
      res.status(400).json({ error: "Invalid communication data" });
    }
  });

  // ========== Lead Tasks Routes ==========

  // Get tasks for a lead
  app.get("/api/leads/:leadId/tasks", async (req, res) => {
    try {
      const { status } = req.query;
      const tasks = await storage.getLeadTasks(
        req.params.leadId,
        status as string | undefined
      );
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  // Get tasks assigned to an employee
  app.get("/api/employees/:employeeId/lead-tasks", async (req, res) => {
    try {
      const tasks = await storage.getLeadTasksByEmployee(req.params.employeeId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employee tasks" });
    }
  });

  // Create lead task
  app.post("/api/leads/:leadId/tasks", async (req, res) => {
    try {
      const { insertLeadTaskSchema } = await import("@shared/schema");
      const validatedData = insertLeadTaskSchema.parse({
        ...req.body,
        leadId: req.params.leadId,
      });
      const task = await storage.createLeadTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  // Update lead task
  app.patch("/api/lead-tasks/:id", async (req, res) => {
    try {
      const task = await storage.updateLeadTask(req.params.id, req.body);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: "Failed to update task" });
    }
  });

  // Delete lead task
  app.delete("/api/lead-tasks/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteLeadTask(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // ========== Coupon Usage Routes ==========

  // Get usage for a coupon
  app.get("/api/coupons/:couponId/usages", async (req, res) => {
    try {
      const usages = await storage.getCouponUsages(req.params.couponId);
      res.json(usages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch coupon usages" });
    }
  });

  // Get customer's coupon usages
  app.get("/api/customers/:customerId/coupon-usages", async (req, res) => {
    try {
      const usages = await storage.getCustomerCouponUsages(req.params.customerId);
      res.json(usages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer coupon usages" });
    }
  });

  // Create coupon usage
  app.post("/api/coupon-usages", async (req, res) => {
    try {
      console.log('🎟️  Recording coupon usage:', req.body);
      const { insertCouponUsageSchema } = await import("@shared/schema");
      const validatedData = insertCouponUsageSchema.parse(req.body);
      const usage = await storage.createCouponUsage(validatedData);
      console.log(`✅ Coupon usage recorded: ${usage.id} (Coupon: ${validatedData.couponId})`);
      res.status(201).json(usage);
    } catch (error) {
      console.error('❌ Failed to record coupon usage:', error);
      res.status(400).json({ 
        error: "Invalid coupon usage data",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // ========== Quotation Routes ==========

  // Get all quotations for a vendor
  app.get("/api/vendors/:vendorId/quotations", async (req, res) => {
    try {
      const { vendorId } = req.params;
      const { status, customerId } = req.query as { status?: string; customerId?: string };
      
      const quotations = await storage.getQuotationsByVendor(vendorId, {
        status,
        customerId,
      });
      
      res.json(quotations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quotations" });
    }
  });

  // Get single quotation with items
  app.get("/api/quotations/:id", async (req, res) => {
    try {
      const quotation = await storage.getQuotation(req.params.id);
      if (!quotation) {
        return res.status(404).json({ error: "Quotation not found" });
      }
      
      // Note: In production, verify req.user.vendorId === quotation.vendorId
      // This prevents cross-tenant data access
      
      const items = await storage.getQuotationItems(quotation.id);
      res.json({ ...quotation, items });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quotation" });
    }
  });

  // Generate quotation number
  app.post("/api/vendors/:vendorId/quotations/generate-number", async (req, res) => {
    try {
      const quotationNumber = await storage.generateQuotationNumber(req.params.vendorId);
      res.json({ quotationNumber });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate quotation number" });
    }
  });

  // Create new quotation
  app.post("/api/vendors/:vendorId/quotations", async (req, res) => {
    try {
      const { insertQuotationSchema } = await import("@shared/schema");
      
      // Parse date strings to Date objects
      const data = { ...req.body };
      if (data.quotationDate && typeof data.quotationDate === 'string') {
        data.quotationDate = new Date(data.quotationDate);
      }
      if (data.validUntil && typeof data.validUntil === 'string') {
        data.validUntil = new Date(data.validUntil);
      }
      if (data.sentAt && typeof data.sentAt === 'string') {
        data.sentAt = new Date(data.sentAt);
      }
      if (data.acceptedAt && typeof data.acceptedAt === 'string') {
        data.acceptedAt = new Date(data.acceptedAt);
      }
      if (data.rejectedAt && typeof data.rejectedAt === 'string') {
        data.rejectedAt = new Date(data.rejectedAt);
      }
      
      // SECURITY: Override vendorId from path parameter to prevent cross-tenant data manipulation
      data.vendorId = req.params.vendorId;
      
      const validatedData = insertQuotationSchema.parse(data);
      
      // Generate quotation number if not provided
      if (!validatedData.quotationNumber) {
        validatedData.quotationNumber = await storage.generateQuotationNumber(req.params.vendorId);
      }
      
      const quotation = await storage.createQuotation(validatedData);
      res.status(201).json(quotation);
    } catch (error) {
      console.error("Create quotation error:", error);
      res.status(400).json({ error: "Invalid quotation data" });
    }
  });

  // Update quotation
  app.patch("/api/quotations/:id", async (req, res) => {
    try {
      // SECURITY: Verify quotation belongs to vendor before allowing update
      const existingQuotation = await storage.getQuotation(req.params.id);
      if (!existingQuotation) {
        return res.status(404).json({ error: "Quotation not found" });
      }
      
      // Note: In production, verify req.user.vendorId === existingQuotation.vendorId
      // For now, this prevents cross-tenant updates if vendorId is sent in body
      if (req.body.vendorId && req.body.vendorId !== existingQuotation.vendorId) {
        return res.status(403).json({ error: "Unauthorized to update this quotation" });
      }
      
      const quotation = await storage.updateQuotation(req.params.id, req.body);
      res.json(quotation);
    } catch (error) {
      res.status(400).json({ error: "Failed to update quotation" });
    }
  });

  // Delete quotation
  app.delete("/api/quotations/:id", async (req, res) => {
    try {
      // SECURITY: Verify quotation belongs to vendor before allowing deletion
      const existingQuotation = await storage.getQuotation(req.params.id);
      if (!existingQuotation) {
        return res.status(404).json({ error: "Quotation not found" });
      }
      
      // Note: In production, verify req.user.vendorId === existingQuotation.vendorId
      // For now, this check is documented for future auth implementation
      
      const deleted = await storage.deleteQuotation(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete quotation" });
    }
  });

  // ========== Quotation Item Routes ==========

  // Get items for a quotation
  app.get("/api/quotations/:quotationId/items", async (req, res) => {
    try {
      const items = await storage.getQuotationItems(req.params.quotationId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quotation items" });
    }
  });

  // Create quotation item
  app.post("/api/quotations/:quotationId/items", async (req, res) => {
    try {
      // SECURITY: Verify quotation exists and belongs to vendor
      const quotation = await storage.getQuotation(req.params.quotationId);
      if (!quotation) {
        return res.status(404).json({ error: "Quotation not found" });
      }
      
      // Note: In production, verify req.user.vendorId === quotation.vendorId
      
      const { insertQuotationItemSchema } = await import("@shared/schema");
      const validatedData = insertQuotationItemSchema.parse(req.body);
      const item = await storage.createQuotationItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      console.error("Create quotation item error:", error);
      res.status(400).json({ error: "Invalid quotation item data" });
    }
  });

  // Update quotation item
  app.patch("/api/quotation-items/:id", async (req, res) => {
    try {
      // SECURITY: Verify item exists and its quotation belongs to vendor
      const item = await storage.getQuotationItem(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Quotation item not found" });
      }
      
      const quotation = await storage.getQuotation(item.quotationId);
      if (!quotation) {
        return res.status(404).json({ error: "Associated quotation not found" });
      }
      
      // Note: In production, verify req.user.vendorId === quotation.vendorId
      
      const updatedItem = await storage.updateQuotationItem(req.params.id, req.body);
      res.json(updatedItem);
    } catch (error) {
      res.status(400).json({ error: "Failed to update quotation item" });
    }
  });

  // Delete quotation item
  app.delete("/api/quotation-items/:id", async (req, res) => {
    try {
      // SECURITY: Verify item exists and its quotation belongs to vendor
      const item = await storage.getQuotationItem(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Quotation item not found" });
      }
      
      const quotation = await storage.getQuotation(item.quotationId);
      if (!quotation) {
        return res.status(404).json({ error: "Associated quotation not found" });
      }
      
      // Note: In production, verify req.user.vendorId === quotation.vendorId
      
      const deleted = await storage.deleteQuotationItem(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete quotation item" });
    }
  });

  // ========== FILE UPLOAD ROUTES ==========
  
  const { createUploadMiddleware, createUploadRoute, genericUploadHandler, handleFileUpload } = await import("./uploads");

  // Public image upload handler - uploads to public-assets bucket with no signature required
  app.post("/api/upload/public", createUploadMiddleware(), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      // Get vendorId and category from form data
      const vendorId = req.body.vendorId as string || req.query.vendorId as string || "vendor-1";
      const category = req.body.category as string || "products";
      
      // Validate vendorId format to prevent path traversal
      if (!/^[a-zA-Z0-9_-]+$/.test(vendorId)) {
        return res.status(400).json({ error: "Invalid vendor identifier" });
      }
      
      // Only allow public categories
      const validPublicCategories = ["logo", "hero", "banner", "gallery", "products", "services"];
      if (!validPublicCategories.includes(category)) {
        return res.status(400).json({ error: "Invalid upload category for public uploads" });
      }
      
      const result = await handleFileUpload(req.file, {
        vendorId,
        category,
        isPrivate: false, // Always public for this endpoint
      });
      
      res.json(result);
    } catch (error) {
      console.error("Public file upload error:", error);
      const message = error instanceof Error ? error.message : "Failed to upload file";
      res.status(400).json({ error: message });
    }
  });
  
  // Generic file upload handler for mini-website assets
  app.post("/api/upload/:category", createUploadMiddleware(), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      const { category } = req.params;
      // Get vendorId from query parameter (sent from client localStorage)
      const vendorId = req.query.vendorId as string || "vendor-1"; // Fallback for compatibility''
      console.log('vendorId##############', vendorId);
      
      // Validate vendorId format to prevent path traversal
      if (!/^[a-zA-Z0-9_-]+$/.test(vendorId)) {
        return res.status(400).json({ error: "Invalid vendor identifier" });
      }
      
      // Strict category whitelist
      const validCategories = ["logo", "hero", "team", "testimonial", "coupon", "banner", "products", "services", "gallery"];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ error: "Invalid upload category" });
      }
      
      const result = await handleFileUpload(req.file, {
        vendorId,
        category,
        isPrivate: false,
      });
      
      res.json(result);
    } catch (error) {
      console.error("File upload error:", error);
      const message = error instanceof Error ? error.message : "Failed to upload file";
      res.status(400).json({ error: message });
    }
  });

  // Ledger attachment upload handler (supports images and PDFs)
  app.post("/api/upload/ledger-attachment", createUploadMiddleware(20 * 1024 * 1024), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Get vendorId from query parameter (sent from client localStorage)
      const vendorId = req.query.vendorId as string || "vendor-1"; // Fallback for compatibility
      
      // Validate vendorId format to prevent path traversal
      if (!/^[a-zA-Z0-9_-]+$/.test(vendorId)) {
        return res.status(400).json({ error: "Invalid vendor identifier" });
      }
      
      const result = await handleFileUpload(req.file, {
        vendorId,
        category: "ledger-attachments",
        isPrivate: false, // Changed to false so images are publicly accessible
        maxSize: 20 * 1024 * 1024, // 20MB for documents
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"],
        allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf"],
        filenamePrefix: "ledger",
      });
      
      res.json(result);
    } catch (error) {
      console.error("Ledger attachment upload error:", error);
      const message = error instanceof Error ? error.message : "Failed to upload attachment";
      res.status(400).json({ error: message });
    }
  });

  // Delete file from Supabase Storage
  app.delete("/api/upload/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const { filePath } = req.body;
      
      if (!filePath) {
        return res.status(400).json({ error: "File path is required" });
      }

      // Validate category
      const validCategories = ["logo", "hero", "team", "testimonial", "coupon", "banner", "products", "services", "gallery", "ledger-attachments"];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ error: "Invalid category" });
      }

      // Determine if file is private
      const privateCategories = ["ledger-attachments", "invoices", "licenses", "documents"];
      const isPrivate = privateCategories.includes(category);

      // Import delete function
      const { deleteFile } = await import("./uploads");
      
      await deleteFile(filePath, category, isPrivate);
      
      res.json({ success: true, message: "File deleted successfully" });
    } catch (error) {
      console.error("File delete error:", error);
      const message = error instanceof Error ? error.message : "Failed to delete file";
      res.status(400).json({ error: message });
    }
  });

  // ========== MINI-WEBSITE BUILDER ROUTES ==========

  // Get vendor's mini-website
  app.get("/api/vendors/:vendorId/mini-website", async (req, res) => {
    try {
      const miniWebsite = await storage.getMiniWebsiteByVendor(req.params.vendorId);
      if (!miniWebsite) {
        return res.status(404).json({ error: "Mini-website not found" });
      }
      res.json(miniWebsite);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mini-website" });
    }
  });

  // Create or update mini-website
  app.post("/api/vendors/:vendorId/mini-website", async (req, res) => {
    try {
      console.log("[mini-website] POST /api/vendors/:vendorId/mini-website", {
        vendorId: req.params.vendorId,
        body: req.body,
      });

      const { insertMiniWebsiteSchema } = await import("@shared/schema");
      const data = { ...req.body, vendorId: req.params.vendorId };
      
      console.log("[mini-website] Data to validate:", data);
      const validatedData = insertMiniWebsiteSchema.parse(data);
      console.log("[mini-website] Validated data:", validatedData);

      // Check if mini-website exists
      const existing = await storage.getMiniWebsiteByVendor(req.params.vendorId);
      console.log("[mini-website] Existing mini-website:", existing ? existing.id : "none");
      
      let miniWebsite;
      if (existing) {
        miniWebsite = await storage.updateMiniWebsite(existing.id, validatedData);
        console.log("[mini-website] Updated mini-website:", miniWebsite?.id);
      } else {
        miniWebsite = await storage.createMiniWebsite(validatedData);
        console.log("[mini-website] Created mini-website:", miniWebsite.id);
      }
      
      res.status(existing ? 200 : 201).json(miniWebsite);
    } catch (error) {
      console.error("Save mini-website error:", error);
      res.status(400).json({ error: "Invalid mini-website data", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Publish mini-website
  app.post("/api/vendors/:vendorId/mini-website/publish", async (req, res) => {
    try {
      const miniWebsite = await storage.getMiniWebsiteByVendor(req.params.vendorId);
      if (!miniWebsite) {
        return res.status(404).json({ error: "Mini-website not found" });
      }

      const published = await storage.publishMiniWebsite(miniWebsite.id);
      res.json(published);
    } catch (error) {
      res.status(500).json({ error: "Failed to publish mini-website" });
    }
  });

  console.log('[ROUTES] Registering check-subdomain endpoint...');

  // Check subdomain availability (public endpoint)
  app.get("/api/check-subdomain/:subdomain", async (req, res) => {
    console.log("[DEBUG] Check subdomain endpoint hit:", req.params.subdomain);
    try {
      const { subdomain } = req.params;

      // Validate subdomain format
      if (!subdomain || subdomain.length < 3 || subdomain.length > 50) {
        console.log("[DEBUG] Subdomain validation failed - length:", subdomain?.length);
        return res.status(400).json({
          error: "Invalid subdomain",
          message: "Subdomain must be between 3 and 50 characters"
        });
      }

      // Check if subdomain contains only valid characters (letters, numbers, hyphens)
      const subdomainRegex = /^[a-zA-Z0-9-]+$/;
      if (!subdomainRegex.test(subdomain)) {
        return res.status(400).json({
          error: "Invalid subdomain",
          message: "Subdomain can only contain letters, numbers, and hyphens"
        });
      }

      // Check if subdomain is already taken
      const existingWebsite = await storage.getMiniWebsiteBySubdomain(subdomain.toLowerCase());

      if (existingWebsite) {
        return res.status(200).json({
          available: false,
          message: "This subdomain is already taken"
        });
      }

      // Check for reserved subdomains
      const reservedSubdomains = ['admin', 'api', 'app', 'www', 'mail', 'ftp', 'test', 'demo', 'staging', 'dev', 'blog', 'help', 'support'];
      if (reservedSubdomains.includes(subdomain.toLowerCase())) {
        return res.status(200).json({
          available: false,
          message: "This subdomain is reserved"
        });
      }

      return res.status(200).json({
        available: true,
        message: "Subdomain is available"
      });

    } catch (error) {
      console.error("Subdomain check error:", error);
      res.status(500).json({ error: "Failed to check subdomain availability" });
    }
  });

  console.log('[ROUTES] Check-subdomain endpoint registered successfully');

  // Get mini-website by subdomain (public endpoint)
  app.get("/api/mini-website/:subdomain", async (req, res) => {
    try {
      console.log("[PUBLIC API] Looking up mini-website by subdomain:", req.params.subdomain);
      const miniWebsite = await storage.getMiniWebsiteBySubdomain(req.params.subdomain);
      console.log("[PUBLIC API] Found mini-website:", miniWebsite ? `id=${miniWebsite.id}, status=${miniWebsite.status}` : "NOT FOUND");
      
      if (!miniWebsite || miniWebsite.status !== "published") {
        return res.status(404).json({ error: "Mini-website not found" });
      }
      
      console.log("[PUBLIC API] Fetching reviews for mini-website:", miniWebsite.id);
      // Get approved reviews
      const reviews = await storage.getReviewsByMiniWebsite(miniWebsite.id, true);
      
      console.log("[PUBLIC API] Fetching services for vendor:", miniWebsite.vendorId);
      // Get vendor services/products from catalog
      const allServices = await storage.getVendorCataloguesByVendor(miniWebsite.vendorId);
      console.log("[PUBLIC API] Fetching products for vendor:", miniWebsite.vendorId);
      const allProducts = await storage.getVendorProductsByVendor(miniWebsite.vendorId);
      
      // Filter services and products by selected IDs from the website configuration
      const selectedCatalog = (miniWebsite as any).selectedCatalog || {};
      const selectedServiceIds = selectedCatalog.services || [];
      const selectedProductIds = selectedCatalog.products || [];
      
      // Filter only active items first
      const activeServices = allServices.filter((s: any) => s.isActive !== false);
      const activeProducts = allProducts.filter((p: any) => p.isActive !== false);
      
      // If specific items are selected, filter; otherwise show all active items
      const services = selectedServiceIds.length > 0 
        ? activeServices.filter((s: any) => selectedServiceIds.includes(s.id))
        : activeServices;
      const products = selectedProductIds.length > 0 
        ? activeProducts.filter((p: any) => selectedProductIds.includes(p.id))
        : activeProducts;
      
      console.log("[PUBLIC API] Filtered to", services.length, "services and", products.length, "products");
      
      // Fetch coupons for the vendor and filter by selectedCouponIds
      console.log("[PUBLIC API] Fetching coupons for vendor:", miniWebsite.vendorId);
      let coupons: any[] = [];
      try {
        const allCoupons = await storage.getCouponsByVendor(miniWebsite.vendorId);
        const selectedCouponIds = (miniWebsite as any).selectedCouponIds || [];
        
        // If selectedCouponIds exists, filter to only selected coupons; otherwise use all active coupons
        if (selectedCouponIds.length > 0) {
          coupons = allCoupons.filter((c: any) => 
            selectedCouponIds.includes(c.id) && 
            c.status === 'active' && 
            (!c.expiryDate || new Date(c.expiryDate) > new Date())
          );
        } else {
          // Fallback: show all active coupons if no specific selection
          coupons = allCoupons.filter((c: any) => 
            c.status === 'active' && 
            (!c.expiryDate || new Date(c.expiryDate) > new Date())
          );
        }
        console.log("[PUBLIC API] Found", coupons.length, "active coupons");
      } catch (err) {
        console.error("[PUBLIC API] Error fetching coupons:", err);
        coupons = [];
      }
      
      console.log("[PUBLIC API] Returning mini-website data");
      res.json({ ...miniWebsite, reviews, services, products, coupons });
    } catch (error) {
      console.error("[PUBLIC API] Error fetching mini-website:", error);
      res.status(500).json({ error: "Failed to fetch mini-website" });
    }
  });

  // Submit review on mini-website (public endpoint)
  app.post("/api/mini-website/:subdomain/reviews", async (req, res) => {
    try {
      const miniWebsite = await storage.getMiniWebsiteBySubdomain(req.params.subdomain);
      if (!miniWebsite) {
        return res.status(404).json({ error: "Mini-website not found" });
      }

      const { insertMiniWebsiteReviewSchema } = await import("@shared/schema");
      const data = { ...req.body, miniWebsiteId: miniWebsite.id };
      const validatedData = insertMiniWebsiteReviewSchema.parse(data);

      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ error: "Failed to submit review" });
    }
  });

  // Get reviews for vendor's mini-website
  app.get("/api/vendors/:vendorId/mini-website/reviews", async (req, res) => {
    try {
      const miniWebsite = await storage.getMiniWebsiteByVendor(req.params.vendorId);
      if (!miniWebsite) {
        return res.status(404).json({ error: "Mini-website not found" });
      }

      const reviews = await storage.getReviewsByMiniWebsite(miniWebsite.id);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  // Approve review
  app.post("/api/mini-website/reviews/:reviewId/approve", async (req, res) => {
    try {
      const review = await storage.approveReview(req.params.reviewId);
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: "Failed to approve review" });
    }
  });

  // Submit lead from mini-website (public endpoint)
  app.post("/api/mini-website/:subdomain/leads", async (req, res) => {
    try {
      const miniWebsite = await storage.getMiniWebsiteBySubdomain(req.params.subdomain);
      if (!miniWebsite) {
        return res.status(404).json({ error: "Mini-website not found" });
      }

      const { name, email, phone, message } = req.body;

      // Check if customer is authenticated
      let authenticatedCustomerId: string | null = null;
      if (req.headers.authorization?.startsWith('Bearer ')) {
        try {
          const token = req.headers.authorization.substring(7);
          const { verifyToken } = await import('./auth');
          const decoded = verifyToken(token) as any;
          if (decoded?.role === 'customer' && decoded?.customerId) {
            authenticatedCustomerId = decoded.customerId;
            console.log('✅ [Lead] Authenticated customer:', authenticatedCustomerId);
          }
        } catch {
          // Not authenticated, proceed as guest
          console.log('📝 [Lead] Guest submission (no valid token)');
        }
      }

      let customerId = authenticatedCustomerId;

      // For guest customers, check if exists by phone or create new
      if (!customerId && phone) {
        const customers = await storage.getCustomersByVendor(miniWebsite.vendorId);
        let existingCustomer = customers.find(c => c.phone === phone);

        if (!existingCustomer && email) {
          existingCustomer = customers.find(c => c.email === email);
        }

        if (existingCustomer) {
          customerId = existingCustomer.id;
          console.log('✅ [Lead] Found existing customer by phone/email:', customerId);
        } else {
          // Create a new guest customer
          const newCustomerId = `cust-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          const newCustomer = await storage.createCustomer({
            id: newCustomerId,
            vendorId: miniWebsite.vendorId,
            name: name || 'Guest Customer',
            phone: phone || '',
            email: email || null,
            source: 'website',
            leadStatus: 'new',
            createdAt: new Date(),
          });
          customerId = newCustomer.id;
          console.log('✅ [Lead] Created new guest customer:', customerId);
        }
      }

      // 1. Create main Lead in leads table (visible in vendor leads section)
      const { insertLeadSchema, insertMiniWebsiteLeadSchema } = await import("@shared/schema");
      
      const mainLeadId = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const mainLeadData = {
        id: mainLeadId,
        vendorId: miniWebsite.vendorId,
        name: name || 'Guest',
        phone: phone || '',
        email: email || null,
        source: 'website' as const,
        sourceDetails: `Website enquiry from ${miniWebsite.subdomain}`,
        status: 'new' as const,
        interestType: 'unknown' as const,
        interestDescription: message || '',
        priority: 'medium' as const,
        notes: message || '',
        convertedToCustomerId: customerId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      let mainLead;
      try {
        mainLead = await storage.createLead(mainLeadData);
        console.log('✅ [Lead] Created main lead:', mainLead.id);
      } catch (mainLeadError) {
        console.error('⚠️ [Lead] Failed to create main lead:', mainLeadError);
        // Continue even if main lead creation fails
      }
      
      // 2. Create MiniWebsiteLead (for mini-website specific tracking)
      const miniWebsiteLeadData = { 
        ...req.body, 
        miniWebsiteId: miniWebsite.id,
        vendorId: miniWebsite.vendorId,
        source: 'website',
        convertedToLeadId: mainLead?.id || null,
      };
      const validatedData = insertMiniWebsiteLeadSchema.parse(miniWebsiteLeadData);

      const miniWebsiteLead = await storage.createMiniWebsiteLead(validatedData);

      // 3. Create notification for vendor
      try {
        const notificationId = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        await storage.createNotification({
          id: notificationId,
          userId: miniWebsite.vendorId,
          vendorId: miniWebsite.vendorId,
          type: "lead",
          title: `New Enquiry from Website`,
          message: `New enquiry from ${name} (${phone}) via ${miniWebsite.subdomain}.vendorhub.com: "${message?.substring(0, 100) || 'No message'}"`,
          link: `/vendor/leads`, // Direct link to leads page
          createdAt: new Date(),
          read: false,
        });
        console.log('✅ [Lead] Notification created for vendor');
      } catch (notifError) {
        console.error('⚠️ [Lead] Failed to create notification:', notifError);
        // Don't fail the request if notification fails
      }

      res.status(201).json({ ...miniWebsiteLead, customerId, leadId: mainLead?.id });
    } catch (error) {
      console.error('❌ [Lead] Error:', error);
      res.status(400).json({ error: "Failed to submit lead" });
    }
  });

  // Submit order from mini-website (requires customer authentication)
  app.post("/api/mini-website/:subdomain/orders", async (req, res) => {
    try {
      console.log('🛒 Received order request for subdomain:', req.params.subdomain);
      console.log('🛒 Request body:', JSON.stringify(req.body, null, 2));
      
      const miniWebsite = await storage.getMiniWebsiteBySubdomain(req.params.subdomain);
      if (!miniWebsite) {
        return res.status(404).json({ error: "Mini-website not found" });
      }

      // REQUIRE AUTHENTICATION - Check for customer token
      if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Authentication required. Please login to place an order." });
      }

      let authenticatedCustomerId = null;
      try {
        const token = req.headers.authorization.substring(7);
        const { verifyToken } = await import('./auth');
        const decoded = verifyToken(token) as any;
        
        if (!decoded || decoded.role !== 'customer' || !decoded.customerId) {
          return res.status(403).json({ error: "Invalid customer credentials. Please login again." });
        }
        
        authenticatedCustomerId = decoded.customerId;
        console.log('✅ [Order] Authenticated customer:', authenticatedCustomerId);
      } catch (error) {
        console.error('❌ [Order] Token verification failed:', error);
        return res.status(401).json({ error: "Authentication failed. Please login again." });
      }

      const { customer, items, subtotal, tax, total, notes } = req.body;

      console.log('🛒 Full request body:', JSON.stringify(req.body, null, 2));
      console.log('🛒 Customer object:', JSON.stringify(customer, null, 2));
      console.log('🛒 Customer city:', customer.city);
      console.log('🛒 Customer state:', customer.state);
      console.log('🛒 Customer pincode:', customer.pincode);
      console.log('🛒 Items:', items);

      if (!customer?.name || !customer?.phone) {
        return res.status(400).json({ error: "Customer name and phone are required" });
      }

      if (!items || items.length === 0) {
        return res.status(400).json({ error: "Order must have at least one item" });
      }

      // Get authenticated customer by ID
      let existingCustomer;
      const customers = await storage.getCustomersByVendor(miniWebsite.vendorId);
      existingCustomer = customers.find(c => c.id === authenticatedCustomerId);
      
      if (!existingCustomer) {
        return res.status(404).json({ error: "Customer account not found. Please contact support." });
      }
      
      console.log('✅ [Order] Using authenticated customer:', existingCustomer.id);
      
      // Update customer address if provided and different
      if (customer.address && customer.address !== existingCustomer.address) {
        await storage.updateCustomer(existingCustomer.id, {
          address: customer.address,
        });
      }

      // Create order from mini-website
      const orderId = `order-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const order = {
        id: orderId,
        vendorId: miniWebsite.vendorId,
        customerId: authenticatedCustomerId, // Simple customer-vendor-order relationship
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email || null,
        deliveryAddress: customer.address || "Not provided",
        city: customer.city || "Not specified",      // From separate field
        state: customer.state || "Not specified",    // From separate field
        pincode: customer.pincode || "000000",       // From separate field
        status: "pending" as const,
        paymentStatus: "pending" as const,
        paymentMethod: null,
        subtotal: subtotal,
        deliveryCharges: 0,
        totalAmount: total,
        notes: notes || null,
        source: "miniwebsite",
        miniWebsiteSubdomain: miniWebsite.subdomain,
      };

      console.log('📦 Order data:');
      console.log('   Customer ID:', order.customerId);
      console.log('   City:', order.city);
      console.log('   State:', order.state);
      console.log('   Pincode:', order.pincode);

      console.log('📦 Creating order:', order);
      const createdOrder = await storage.createOrder(order);
      console.log('✅ Order created:', createdOrder);
      
      // ✅ VALIDATE STOCK AVAILABILITY BEFORE CREATING ORDER ITEMS
      console.log('📦 Validating stock for', items.length, 'items');
      const outOfStockItems: string[] = [];
      const insufficientStockItems: string[] = [];
      
      for (const item of items) {
        if (item.type === 'product' && item.vendorProductId) {
          const product = await storage.getVendorProduct(item.vendorProductId);
          if (!product) {
            console.error(`❌ Product not found: ${item.vendorProductId}`);
            outOfStockItems.push(`${item.name} (Product not found)`);
          } else if (product.stock === 0) {
            console.error(`❌ Out of stock: ${product.name} (Stock: 0)`);
            outOfStockItems.push(`${item.name} (Out of stock)`);
          } else if (product.stock < item.quantity) {
            console.error(`❌ Insufficient stock: ${product.name} (Available: ${product.stock}, Requested: ${item.quantity})`);
            insufficientStockItems.push(`${item.name} (Available: ${product.stock}, Requested: ${item.quantity})`);
          }
        }
      }
      
      // If any items are out of stock or insufficient, reject the order
      if (outOfStockItems.length > 0 || insufficientStockItems.length > 0) {
        // Delete the order we just created since validation failed
        await storage.deleteOrder(createdOrder.id);
        
        let errorMessage = 'Cannot place order. ';
        if (outOfStockItems.length > 0) {
          errorMessage += `Out of stock: ${outOfStockItems.join(', ')}. `;
        }
        if (insufficientStockItems.length > 0) {
          errorMessage += `Insufficient stock: ${insufficientStockItems.join(', ')}.`;
        }
        
        console.error('❌ [Order] Stock validation failed:', errorMessage);
        return res.status(400).json({ 
          error: "Stock validation failed",
          message: errorMessage,
          outOfStockItems,
          insufficientStockItems
        });
      }
      
      console.log('✅ Stock validation passed for all items');
      
      // Create order items (only for products - orders table doesn't support services)
      console.log('📦 Creating order items for', items.length, 'items');
      for (const item of items) {
        if (item.type === 'product') {
          const orderItem = {
            orderId: createdOrder.id, // Use the database-generated ID
            vendorProductId: item.vendorProductId!,
            productName: item.name,
            productBrand: null,
            productUnit: "unit",
            quantity: item.quantity,
            pricePerUnit: item.price,
            totalPrice: item.price * item.quantity,
          };
          console.log('📦 Creating order item:', orderItem);
          const createdItem = await storage.createOrderItem(orderItem);
          console.log('✅ Order item created:', createdItem);
        } else {
          console.log('⚠️ Skipping service item (order_items only supports products):', item.name);
        }
      }
      
      // Send notification to vendor
      // NOTE: For mini website orders, userId = customerId (from customers table)
      // This allows vendors to track which customer placed the order
      console.log('📧 [Notification] Creating notification for vendor:', miniWebsite.vendorId);
      console.log('📧 [Notification] userId (customerId):', authenticatedCustomerId);
      console.log('📧 [Notification] Customer name:', customer.name);
      
      const notificationId = `notif-${nanoid()}`;
      await storage.createNotification({
        id: notificationId,
        userId: authenticatedCustomerId, // userId = customerId for mini website orders
        vendorId: miniWebsite.vendorId,
        type: "order",
        title: "New Order from Registered Customer",
        message: `New order ${createdOrder.id} received from ${customer.name} (${customer.phone}) via ${miniWebsite.subdomain}.vendorhub.com`,
        createdAt: new Date(),
        read: false,
      });

      res.status(201).json(createdOrder);
    } catch (error: any) {
      console.error("Failed to submit order:", error);
      res.status(400).json({ error: "Failed to submit order", message: error.message });
    }
  });

  // Get customer's orders from mini website
  app.get("/api/mini-website/:subdomain/my-orders", async (req: Request, res: Response) => {
    try {
      const { subdomain } = req.params;
      
      // Verify mini website exists
      const miniWebsite = await storage.getMiniWebsiteBySubdomain(subdomain);
      if (!miniWebsite) {
        return res.status(404).json({ error: "Mini website not found" });
      }

      // Verify authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const token = authHeader.split(' ')[1];
      let customerId;
      
      try {
        const { verifyToken } = await import('./auth');
        const decoded = verifyToken(token);
        
        if (!decoded || decoded.role !== 'customer') {
          return res.status(403).json({ error: "Invalid token or not a customer" });
        }
        
        customerId = decoded.customerId;
        console.log('📋 [My Orders] Fetching orders for customer:', customerId);
      } catch (error) {
        console.error('❌ [My Orders] Token verification failed:', error);
        return res.status(401).json({ error: "Authentication failed" });
      }

      // Fetch customer's orders using vendorId and customerId
      const customerOrders = await storage.getOrdersByVendorAndCustomer(miniWebsite.vendorId, customerId);
      
      console.log(`✅ [My Orders] Found ${customerOrders.length} orders for customer ${customerId} with vendor ${miniWebsite.vendorId}`);

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        customerOrders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          return {
            ...order,
            items,
          };
        })
      );

      res.json(ordersWithItems);
    } catch (error: any) {
      console.error("Failed to fetch customer orders:", error);
      res.status(500).json({ error: "Failed to fetch orders", message: error.message });
    }
  });

  // Submit quotation request from mini-website (supports both authenticated and guest customers)
  app.post("/api/mini-website/:subdomain/quotations", async (req, res) => {
    try {
      const miniWebsite = await storage.getMiniWebsiteBySubdomain(req.params.subdomain);
      if (!miniWebsite) {
        return res.status(404).json({ error: "Mini-website not found" });
      }

      const { customer, items, estimatedTotal, notes } = req.body;

      if (!customer?.name || !customer?.phone) {
        return res.status(400).json({ error: "Customer name and phone are required" });
      }

      if (!items || items.length === 0) {
        return res.status(400).json({ error: "Quotation must have at least one item" });
      }

      // OPTIONAL AUTHENTICATION - Support both logged-in and guest customers
      let authenticatedCustomerId = null;
      let isGuestCustomer = false;
      
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try {
          const token = req.headers.authorization.substring(7);
          const { verifyToken } = await import('./auth');
          const decoded = verifyToken(token) as any;
          
          if (decoded && decoded.role === 'customer' && decoded.customerId) {
            authenticatedCustomerId = decoded.customerId;
            console.log('✅ [Quotation] Authenticated customer:', authenticatedCustomerId);
          }
        } catch (error) {
          console.log('⚠️ [Quotation] Token verification failed, treating as guest:', error);
          isGuestCustomer = true;
        }
      } else {
        console.log('✅ [Quotation] Guest customer quotation (no login required)');
        isGuestCustomer = true;
      }

      // Get or create customer record
      let existingCustomer;
      const customers = await storage.getCustomersByVendor(miniWebsite.vendorId);
      
      if (authenticatedCustomerId) {
        // Use authenticated customer
        existingCustomer = customers.find(c => c.id === authenticatedCustomerId);
        
        if (!existingCustomer) {
          return res.status(404).json({ error: "Customer account not found. Please contact support." });
        }
        
        console.log('✅ [Quotation] Using authenticated customer:', existingCustomer.id);
      } else {
        // Guest customer - find existing or create new
        existingCustomer = customers.find(
          c => c.phone === customer.phone || (customer.email && c.email === customer.email)
        );
        
        if (!existingCustomer) {
          // Create new guest customer record
          console.log('📝 [Quotation] Creating new guest customer:', customer.name);
          const newCustomer = {
            vendorId: miniWebsite.vendorId,
            name: customer.name,
            phone: customer.phone,
            email: customer.email || null,
            address: customer.address || null,
            customerType: "walk-in" as const,
            status: "active" as const,
            source: "miniwebsite",
          };
          existingCustomer = await storage.createCustomer(newCustomer);
          console.log('✅ [Quotation] Guest customer created:', existingCustomer.id);
        } else {
          console.log('✅ [Quotation] Using existing customer:', existingCustomer.id);
        }
      }

      // Create quotation request
      const quotationId = `quotation-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const quotationNumber = `MWQ-${Date.now()}`;

      const quotation = {
        id: quotationId,
        customerId: existingCustomer.id,
        vendorId: miniWebsite.vendorId,
        quotationNumber: quotationNumber,
        quotationDate: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        status: "draft" as const, // Quotation requests start as draft
        subtotal: (estimatedTotal || 0).toString(),
        taxAmount: "0",
        discountAmount: "0",
        totalAmount: (estimatedTotal || 0).toString(),
        notes: notes || null,
        source: "miniwebsite",
        miniWebsiteSubdomain: miniWebsite.subdomain,
      };

      console.log('📦 Creating quotation request:', quotation);
      const createdQuotation = await storage.createQuotation(quotation);
      console.log('✅ Quotation request created:', createdQuotation);
      
      // Create quotation items
      console.log('📦 Creating quotation items for', items.length, 'items');
      for (const item of items) {
        const quotationItem = {
          quotationId: createdQuotation.id, // Use the database-generated ID
          itemType: item.type, // 'service' or 'product'
          itemId: item.type === 'service' ? item.vendorCatalogueId : item.vendorProductId,
          itemName: item.name,
          quantity: item.quantity.toString(),
          rate: (item.price || 0).toString(),
          taxPercent: "0",
          taxAmount: "0",
          discountPercent: "0",
          discountAmount: "0",
          amount: ((item.price || 0) * item.quantity).toString(),
        };
        console.log('📦 Creating quotation item:', quotationItem);
        const createdItem = await storage.createQuotationItem(quotationItem);
        console.log('✅ Quotation item created:', createdItem);
      }
      
      // Send notification to vendor
      // NOTE: For mini website quotations, userId = customerId (from customers table)
      // This allows vendors to track which customer requested the quote
      // Use existingCustomer.id which is always available (for both authenticated and guest customers)
      const customerIdForNotification = existingCustomer.id;
      console.log('📧 [Notification] Creating notification for vendor:', miniWebsite.vendorId);
      console.log('📧 [Notification] userId (customerId):', customerIdForNotification);
      console.log('📧 [Notification] Customer name:', existingCustomer.name);
      
      const notificationId = `notif-${nanoid()}`;
      const isGuest = !authenticatedCustomerId;
      await storage.createNotification({
        id: notificationId,
        userId: customerIdForNotification, // userId = customerId for mini website quotations (works for both authenticated and guest)
        vendorId: miniWebsite.vendorId,
        type: "quotation",
        title: isGuest ? "New Quotation Request from Guest" : "New Quotation Request from Registered Customer",
        message: `New quotation request ${createdQuotation.quotationNumber} received from ${existingCustomer.name} (${existingCustomer.phone}) via ${miniWebsite.subdomain}.vendorhub.com`,
        link: `/vendor/quotations?tab=requests`, // Direct link to quotation requests
        createdAt: new Date(),
        read: false,
      });

      res.status(201).json(createdQuotation);
    } catch (error: any) {
      console.error("Failed to submit quotation:", error);
      res.status(400).json({ error: "Failed to submit quotation request", message: error.message });
    }
  });

  // Customer signup for mini-website (public endpoint)
  app.post("/api/mini-website/:subdomain/customer/signup", async (req, res) => {
    try {
      const { email, password, name, phone } = req.body;

      // Validate input
      if (!email || !password || !name || !phone) {
        return res.status(400).json({ error: 'Email, password, name, and phone are required' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const miniWebsite = await storage.getMiniWebsiteBySubdomain(req.params.subdomain);
      if (!miniWebsite) {
        return res.status(404).json({ error: "Mini-website not found" });
      }

      // Check if customer already exists with this email + vendorId composite
      const existingCustomer = await storage.getCustomerByEmailAndVendor(miniWebsite.vendorId, email.toLowerCase());
      if (existingCustomer) {
        console.log(`❌ [Customer Auth] Account already exists for ${email} with vendor ${miniWebsite.vendorId}`);
        return res.status(400).json({ error: 'Account already exists for this store. Please login instead.' });
      }

      // Check if user exists in users table (might be customer for another vendor)
      let user = await storage.getUserByEmail(email.toLowerCase());
      
      if (!user) {
        // Create new user account with customer role
        const { hashPassword } = await import('./auth');
        const passwordHash = await hashPassword(password);
        
        console.log('📝 [Customer Auth] Creating new user account...');
        user = await storage.createUser({
          email: email.toLowerCase(),
          username: email.toLowerCase(), // Use email as username for customers
          role: 'customer',
          passwordHash,
        });
        console.log(`✅ [Customer Auth] User created: ${user.id}`);
      } else {
        // User exists - verify it's a customer role
        if (user.role !== 'customer') {
          return res.status(400).json({ error: 'This email is already registered with a different role.' });
        }
        
        // Verify password matches (same customer signing up on different vendor)
        const { comparePassword, hashPassword } = await import('./auth');
        const passwordHash = await hashPassword(password);
        // For new vendor signup, we'll create customer record with their credentials
        console.log(`✅ [Customer Auth] Existing user found: ${user.id}, creating customer record for new vendor`);
      }

      // Create customer record for this vendor (always create new as we checked earlier)
      console.log('📝 [Customer Auth] Creating customer record for vendor:', miniWebsite.vendorId);
      console.log('📝 [Customer Auth] Customer data:', {
        vendorId: miniWebsite.vendorId,
        name,
        email: email.toLowerCase(),
        phone,
        customerType: "online",
        source: "website",
        status: "active",
      });
      
      let customer: Customer;
      try {
        customer = await storage.createCustomer({
          vendorId: miniWebsite.vendorId, // Link to vendor (tracks vendor-customer relationship)
          name,
          email: email.toLowerCase(),
          phone,
          customerType: "online", // Customer type for website signups
          source: "website", // Track that customer came from mini website
          status: "active", // Set as active customer
        });
        console.log(`✅ [Customer Auth] Customer created: ${customer.id} for vendor ${miniWebsite.vendorId}`);
      } catch (error: any) {
        console.error('❌ [Customer Auth] Failed to create customer:', error);
        console.error('❌ [Customer Auth] Error details:', error.message);
        console.error('❌ [Customer Auth] Stack:', error.stack);
        throw new Error(`Failed to create customer record: ${error.message}`);
      }

      // Generate JWT token
      const { generateToken } = await import('./auth');
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        vendorId: miniWebsite.vendorId, // Include vendor ID for customer context
        customerId: customer.id,
      });

      console.log(`✅ [Customer Auth] Signup successful for ${email}`);
      console.log(`✅ [Customer Auth] Returning token and customer data:`, {
        customerId: customer.id,
        name: customer.name,
        email: customer.email,
      });

      res.json({
        token,
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          vendorId: miniWebsite.vendorId,
        },
      });
    } catch (error: any) {
      console.error("Customer signup error:", error);
      res.status(400).json({ error: "Failed to create account", message: error.message });
    }
  });

  // Customer login for mini-website (public endpoint)
  app.post("/api/mini-website/:subdomain/customer/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const miniWebsite = await storage.getMiniWebsiteBySubdomain(req.params.subdomain);
      if (!miniWebsite) {
        return res.status(404).json({ error: "Mini-website not found" });
      }

      // Check customer exists with email + vendorId composite
      const customer = await storage.getCustomerByEmailAndVendor(miniWebsite.vendorId, email.toLowerCase());
      if (!customer) {
        console.log(`❌ [Customer Auth] No customer account found for ${email} with vendor ${miniWebsite.vendorId}`);
        return res.status(401).json({ error: 'Invalid email or password. If you haven\'t signed up yet, please create an account first.' });
      }

      // Get user by email
      const user = await storage.getUserByEmail(email.toLowerCase());
      if (!user) {
        console.log(`❌ [Customer Auth] User not found in users table: ${email}`);
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Verify customer role
      if (user.role !== 'customer') {
        console.log(`❌ [Customer Auth] User ${email} is not a customer (role: ${user.role})`);
        return res.status(403).json({ error: 'This login is for customers only' });
      }

      // Verify password
      const { comparePassword } = await import('./auth');
      const isValidPassword = await comparePassword(password, user.passwordHash!);
      if (!isValidPassword) {
        console.log(`❌ [Customer Auth] Invalid password for ${email}`);
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      console.log(`✅ [Customer Auth] Login successful for ${email} with vendor ${miniWebsite.vendorId}`);

      // Generate JWT token
      const { generateToken } = await import('./auth');
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        vendorId: miniWebsite.vendorId,
        customerId: customer.id,
      });

      console.log(`✅ [Customer Auth] Login successful for ${email}`);
      console.log(`✅ [Customer Auth] Returning token and customer data:`, {
        customerId: customer.id,
        name: customer.name,
        email: customer.email,
      });

      res.json({
        token,
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          vendorId: miniWebsite.vendorId,
        },
      });
    } catch (error: any) {
      console.error("Customer login error:", error);
      res.status(401).json({ error: "Login failed", message: error.message });
    }
  });

  // Get customer profile (requires authentication)
  app.get("/api/mini-website/:subdomain/customer/profile", async (req, res) => {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token required' });
      }

      const token = authHeader.substring(7);
      const { verifyToken } = await import('./auth');
      const decoded = verifyToken(token) as any;

      if (!decoded || decoded.role !== 'customer') {
        return res.status(403).json({ error: 'Access denied' });
      }

      const miniWebsite = await storage.getMiniWebsiteBySubdomain(req.params.subdomain);
      if (!miniWebsite) {
        return res.status(404).json({ error: "Mini-website not found" });
      }

      // Get customer record
      const customers = await storage.getCustomersByVendor(miniWebsite.vendorId);
      const customer = customers.find(c => c.id === decoded.customerId);

      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      res.json({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
      });
    } catch (error: any) {
      console.error("Get customer profile error:", error);
      res.status(401).json({ error: "Failed to get profile", message: error.message });
    }
  });

  // ========== CUSTOMER FORGOT PASSWORD ENDPOINTS ==========
  
  // Request password reset OTP for customer (requires vendorId + email)
  app.post("/api/mini-website/:subdomain/customer/forgot-password", async (req, res) => {
    try {
      const { email, vendorId: inputVendorId } = req.body;
      const { subdomain } = req.params;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const normalizedEmail = email.toLowerCase();

      // Get mini-website
      const miniWebsite = await storage.getMiniWebsiteBySubdomain(subdomain);
      if (!miniWebsite) {
        return res.status(404).json({ error: "Website not found" });
      }

      // Use input vendorId if provided, otherwise use from miniWebsite
      const vendorId = inputVendorId || miniWebsite.vendorId;

      // Validate vendorId matches the website's vendor
      if (inputVendorId && inputVendorId !== miniWebsite.vendorId) {
        console.log(`[Customer Auth] VendorId mismatch: input=${inputVendorId}, website=${miniWebsite.vendorId}`);
        return res.status(400).json({ error: 'Invalid vendor' });
      }

      // Check if customer exists for this vendor
      const customers = await storage.getCustomersByVendor(vendorId);
      const customer = customers.find(c => c.email?.toLowerCase() === normalizedEmail);

      if (!customer) {
        // Don't reveal if email exists for security, but still return success
        console.log(`[Customer Auth] No customer found for ${normalizedEmail} with vendor ${vendorId}`);
        return res.json({ 
          success: true, 
          message: 'If an account exists with this email, you will receive an OTP shortly.',
          vendorId: vendorId,
          email: normalizedEmail
        });
      }

      // Check if user exists
      const user = await storage.getUserByEmail(normalizedEmail);
      if (!user) {
        return res.json({ 
          success: true, 
          message: 'If an account exists with this email, you will receive an OTP shortly.',
          vendorId: vendorId,
          email: normalizedEmail
        });
      }

      // Generate OTP
      const { generateOTP, sendPasswordResetOTP } = await import('./emailService');
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP in database with vendorId
      const { supabaseStorage } = await import('./supabaseStorage');
      await supabaseStorage.createPasswordResetToken({
        email: normalizedEmail,
        otp,
        vendorId: vendorId, // Store vendorId for customer-specific reset
        expiresAt,
        verified: false,
        used: false,
      });

      // Send OTP via email
      const emailSent = await sendPasswordResetOTP(normalizedEmail, otp);

      if (!emailSent) {
        console.error(`[Customer Auth] Failed to send OTP email to ${normalizedEmail}`);
        return res.status(500).json({ error: 'Failed to send OTP email. Please try again.' });
      }

      console.log(`✅ [Customer Auth] Password reset OTP sent to ${normalizedEmail} for vendor ${vendorId}`);

      res.json({ 
        success: true, 
        message: 'OTP has been sent to your email address.',
        vendorId: vendorId,
        email: normalizedEmail
      });
    } catch (error: any) {
      console.error("[Customer Auth] Forgot password error:", error);
      res.status(500).json({ error: error.message || 'Failed to process password reset request' });
    }
  });

  // Verify OTP for customer password reset (requires vendorId + email + otp)
  app.post("/api/mini-website/:subdomain/customer/verify-otp", async (req, res) => {
    try {
      const { email, otp, vendorId: inputVendorId } = req.body;
      const { subdomain } = req.params;

      if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
      }

      const normalizedEmail = email.toLowerCase();

      // Get mini-website
      const miniWebsite = await storage.getMiniWebsiteBySubdomain(subdomain);
      if (!miniWebsite) {
        return res.status(404).json({ error: "Website not found" });
      }

      // Use input vendorId if provided, otherwise use from miniWebsite
      const vendorId = inputVendorId || miniWebsite.vendorId;

      // Validate vendorId matches the website's vendor
      if (inputVendorId && inputVendorId !== miniWebsite.vendorId) {
        console.log(`[Customer Auth] VendorId mismatch: input=${inputVendorId}, website=${miniWebsite.vendorId}`);
        return res.status(400).json({ error: 'Invalid vendor' });
      }

      // Get token from database with vendorId check
      const { supabaseStorage } = await import('./supabaseStorage');
      const token = await supabaseStorage.getPasswordResetToken(normalizedEmail, otp);

      if (!token) {
        return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
      }

      // Check if this token is for the correct vendor (if vendorId is set)
      if (token.vendorId && token.vendorId !== vendorId) {
        return res.status(400).json({ error: 'Invalid OTP for this website.' });
      }

      // Check if OTP has expired
      if (new Date() > new Date(token.expiresAt)) {
        await supabaseStorage.markPasswordResetTokenUsed(normalizedEmail, otp);
        return res.status(400).json({ error: 'OTP has expired. Please request a new OTP.' });
      }

      // Mark OTP as verified
      await supabaseStorage.verifyPasswordResetToken(normalizedEmail, otp);

      console.log(`✅ [Customer Auth] OTP verified for ${normalizedEmail} with vendor ${vendorId}`);

      res.json({ 
        success: true, 
        message: 'OTP verified successfully. You can now reset your password.',
        vendorId: vendorId,
        email: normalizedEmail
      });
    } catch (error: any) {
      console.error("[Customer Auth] OTP verification error:", error);
      res.status(500).json({ error: error.message || 'Failed to verify OTP' });
    }
  });

  // Reset customer password with verified OTP (requires vendorId + email + otp + newPassword)
  app.post("/api/mini-website/:subdomain/customer/reset-password", async (req, res) => {
    try {
      const { email, otp, newPassword, vendorId: inputVendorId } = req.body;
      const { subdomain } = req.params;

      if (!email || !otp || !newPassword) {
        return res.status(400).json({ error: 'Email, OTP, and new password are required' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const normalizedEmail = email.toLowerCase();

      // Get mini-website
      const miniWebsite = await storage.getMiniWebsiteBySubdomain(subdomain);
      if (!miniWebsite) {
        return res.status(404).json({ error: "Website not found" });
      }

      // Use input vendorId if provided, otherwise use from miniWebsite
      const vendorId = inputVendorId || miniWebsite.vendorId;

      // Validate vendorId matches the website's vendor
      if (inputVendorId && inputVendorId !== miniWebsite.vendorId) {
        console.log(`[Customer Auth] VendorId mismatch: input=${inputVendorId}, website=${miniWebsite.vendorId}`);
        return res.status(400).json({ error: 'Invalid vendor' });
      }

      // Get token from database
      const { supabaseStorage } = await import('./supabaseStorage');
      const token = await supabaseStorage.getPasswordResetToken(normalizedEmail, otp);

      if (!token) {
        return res.status(400).json({ error: 'Invalid OTP. Please request a new OTP.' });
      }

      // Check if this token is for the correct vendor (if vendorId is set)
      if (token.vendorId && token.vendorId !== vendorId) {
        return res.status(400).json({ error: 'Invalid OTP for this website.' });
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
      const { hashPassword } = await import('./auth');
      const passwordHash = await hashPassword(newPassword);

      // Update user password
      await storage.updateUser(user.id, { passwordHash });

      // Mark OTP as used
      await supabaseStorage.markPasswordResetTokenUsed(normalizedEmail, otp);

      console.log(`✅ [Customer Auth] Password reset successful for ${normalizedEmail} with vendor ${vendorId}`);

      res.json({ 
        success: true, 
        message: 'Password has been reset successfully. You can now login with your new password.',
        vendorId: vendorId,
        email: normalizedEmail
      });
    } catch (error: any) {
      console.error("[Customer Auth] Password reset error:", error);
      res.status(500).json({ error: error.message || 'Failed to reset password' });
    }
  });

  // Get leads from mini-website
  app.get("/api/vendors/:vendorId/mini-website/leads", async (req, res) => {
    try {
      const leads = await storage.getMiniWebsiteLeadsByVendor(req.params.vendorId);
      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  // ========== STOCK TURNOVER MODULE ROUTES ==========

  // ========== Inventory Locations ==========
  app.get("/api/vendors/:vendorId/inventory-locations", async (req, res) => {
    try {
      const locations = await storage.getInventoryLocationsByVendor(req.params.vendorId);
      res.json(locations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory locations" });
    }
  });

  app.post("/api/vendors/:vendorId/inventory-locations", async (req, res) => {
    try {
      const data = { ...req.body, vendorId: req.params.vendorId };
      const validatedData = insertInventoryLocationSchema.parse(data);
      const location = await storage.createInventoryLocation(validatedData);
      res.status(201).json(location);
    } catch (error) {
      res.status(400).json({ error: "Invalid location data" });
    }
  });

  app.patch("/api/inventory-locations/:id", async (req, res) => {
    try {
      const validatedData = insertInventoryLocationSchema.partial().parse(req.body);
      const location = await storage.updateInventoryLocation(req.params.id, validatedData);
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }
      res.json(location);
    } catch (error) {
      res.status(400).json({ error: "Invalid location data" });
    }
  });

  app.delete("/api/inventory-locations/:id", async (req, res) => {
    try {
      const success = await storage.deleteInventoryLocation(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Location not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete location" });
    }
  });

  // ========== Stock Batches ==========
  app.get("/api/vendor-products/:productId/batches", async (req, res) => {
    try {
      const batches = await storage.getStockBatchesByProduct(req.params.productId);
      res.json(batches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch batches" });
    }
  });

  app.get("/api/vendors/:vendorId/batches/expiring", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const batches = await storage.getExpiringBatches(req.params.vendorId, days);
      res.json(batches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expiring batches" });
    }
  });

  app.post("/api/vendor-products/:productId/batches", async (req, res) => {
    try {
      const data = { ...req.body, vendorProductId: req.params.productId };
      const validatedData = insertStockBatchSchema.parse(data);
      const batch = await storage.createStockBatch(validatedData);
      res.status(201).json(batch);
    } catch (error) {
      res.status(400).json({ error: "Invalid batch data" });
    }
  });

  app.patch("/api/stock-batches/:id", async (req, res) => {
    try {
      const validatedData = insertStockBatchSchema.partial().parse(req.body);
      const batch = await storage.updateStockBatch(req.params.id, validatedData);
      if (!batch) {
        return res.status(404).json({ error: "Batch not found" });
      }
      res.json(batch);
    } catch (error) {
      res.status(400).json({ error: "Invalid batch data" });
    }
  });

  // ========== Stock Movements ==========
  app.get("/api/vendors/:vendorId/stock-movements", async (req, res) => {
    try {
      const filters = {
        productId: req.query.productId as string,
        movementType: req.query.movementType as string,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      };
      const movements = await storage.getStockMovementsByVendor(req.params.vendorId, filters);
      res.json(movements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stock movements" });
    }
  });

  app.get("/api/vendor-products/:productId/stock-movements", async (req, res) => {
    try {
      const movements = await storage.getStockMovementsByProduct(req.params.productId);
      res.json(movements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stock movements" });
    }
  });

  app.post("/api/vendors/:vendorId/products/:productId/stock-in", async (req, res) => {
    try {
      const { quantity, ...data } = req.body;
      
      // Strong validation guards
      if (!quantity || typeof quantity !== "number" || !Number.isInteger(quantity)) {
        return res.status(400).json({ error: "Quantity must be an integer number" });
      }
      if (quantity <= 0) {
        return res.status(400).json({ error: "Quantity must be positive" });
      }
      if (quantity > 1000000) {
        return res.status(400).json({ error: "Quantity exceeds maximum allowed value" });
      }
      
      const result = await storage.recordStockIn(req.params.productId, quantity, data);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to record stock in" });
    }
  });

  app.post("/api/vendors/:vendorId/products/:productId/stock-out", async (req, res) => {
    try {
      const { quantity, ...data } = req.body;
      
      // Strong validation guards
      if (!quantity || typeof quantity !== "number" || !Number.isInteger(quantity)) {
        return res.status(400).json({ error: "Quantity must be an integer number" });
      }
      if (quantity <= 0) {
        return res.status(400).json({ error: "Quantity must be positive" });
      }
      if (quantity > 1000000) {
        return res.status(400).json({ error: "Quantity exceeds maximum allowed value" });
      }
      
      const result = await storage.recordStockOut(req.params.productId, quantity, data);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to record stock out" });
    }
  });

  // ========== Stock Configs ==========
  app.get("/api/vendor-products/:productId/stock-config", async (req, res) => {
    try {
      const config = await storage.ensureStockConfig(req.params.productId);
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stock config" });
    }
  });

  app.get("/api/vendors/:vendorId/stock-configs", async (req, res) => {
    try {
      const configs = await storage.getStockConfigsByVendor(req.params.vendorId);
      res.json(configs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stock configs" });
    }
  });

  app.patch("/api/stock-configs/:id", async (req, res) => {
    try {
      const validatedData = insertStockConfigSchema.partial().parse(req.body);
      const config = await storage.updateStockConfig(req.params.id, validatedData);
      if (!config) {
        return res.status(404).json({ error: "Config not found" });
      }
      res.json(config);
    } catch (error) {
      res.status(400).json({ error: "Invalid config data" });
    }
  });

  // ========== Stock Alerts ==========
  app.get("/api/vendors/:vendorId/stock-alerts", async (req, res) => {
    try {
      const filters = {
        status: req.query.status as string,
        alertType: req.query.alertType as string,
      };
      const alerts = await storage.getStockAlertsByVendor(req.params.vendorId, filters);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stock alerts" });
    }
  });

  app.post("/api/stock-alerts/:id/acknowledge", async (req, res) => {
    try {
      const { userId } = req.body;
      const alert = await storage.acknowledgeStockAlert(req.params.id, userId || "system");
      if (!alert) {
        return res.status(404).json({ error: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(500).json({ error: "Failed to acknowledge alert" });
    }
  });

  app.post("/api/stock-alerts/:id/resolve", async (req, res) => {
    try {
      const alert = await storage.resolveStockAlert(req.params.id);
      if (!alert) {
        return res.status(404).json({ error: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(500).json({ error: "Failed to resolve alert" });
    }
  });

  app.post("/api/stock-alerts/:id/dismiss", async (req, res) => {
    try {
      const alert = await storage.dismissStockAlert(req.params.id);
      if (!alert) {
        return res.status(404).json({ error: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(500).json({ error: "Failed to dismiss alert" });
    }
  });

  // ========== Stock Analytics ==========
  app.get("/api/vendor-products/:productId/turnover-rate", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const rate = await storage.getStockTurnoverRate(req.params.productId, days);
      res.json({ turnoverRate: rate, days });
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate turnover rate" });
    }
  });

  app.get("/api/vendors/:vendorId/stock/slow-moving", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 90;
      const products = await storage.getSlowMovingProducts(req.params.vendorId, days);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch slow-moving products" });
    }
  });

  app.get("/api/vendors/:vendorId/stock/value", async (req, res) => {
    try {
      const value = await storage.getStockValue(req.params.vendorId);
      res.json({ totalValue: value });
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate stock value" });
    }
  });

  app.get("/api/vendors/:vendorId/stock-turnover-analytics", async (req, res) => {
    try {
      const analytics = await storage.getComprehensiveStockAnalytics(req.params.vendorId);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stock turnover analytics" });
    }
  });

  // ====================
  // LEDGER TRANSACTIONS (HISAB KITAB)
  // ====================

  // Get single ledger transaction by ID
  app.get("/api/ledger-transactions/:id", async (req, res) => {
    try {
      const transaction = await storage.getLedgerTransaction(req.params.id);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  });

  // Get vendor's ledger transactions with optional filters
  app.get("/api/vendors/:vendorId/ledger-transactions", async (req, res) => {
    try {
      const filters: any = {};
      if (req.query.customerId) filters.customerId = req.query.customerId as string;
      if (req.query.type) filters.type = req.query.type as 'in' | 'out';
      if (req.query.category) filters.category = req.query.category as string;
      if (req.query.paymentMethod) filters.paymentMethod = req.query.paymentMethod as string;
      if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
      if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);

      console.log(`📋 [Ledger Transactions] Fetching transactions for vendor ${req.params.vendorId} with filters:`, filters);
      
      const transactions = await storage.getLedgerTransactionsByVendor(req.params.vendorId, filters);
      
      console.log(`✅ [Ledger Transactions] Found ${transactions.length} transactions`);
      
      res.json(transactions);
    } catch (error) {
      console.error('❌ [Ledger Transactions] Error:', error);
      res.status(500).json({ error: "Failed to fetch ledger transactions" });
    }
  });

  // Get customer's ledger transactions
  app.get("/api/customers/:customerId/ledger-transactions", async (req, res) => {
    try {
      const transactions = await storage.getLedgerTransactionsByCustomer(req.params.customerId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer ledger transactions" });
    }
  });

  // Get ledger summary (total in, total out, balance)
  app.get("/api/vendors/:vendorId/ledger-summary", async (req, res) => {
    try {
      const filters: any = {};
      if (req.query.customerId) filters.customerId = req.query.customerId as string;
      if (req.query.type) filters.type = req.query.type as 'in' | 'out';
      if (req.query.category) filters.category = req.query.category as string;
      if (req.query.paymentMethod) filters.paymentMethod = req.query.paymentMethod as string;
      if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
      if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);

      console.log(`📊 [Ledger Summary] Fetching summary for vendor ${req.params.vendorId} with filters:`, filters);
      
      const summary = await storage.getLedgerSummary(req.params.vendorId, filters);
      
      console.log(`✅ [Ledger Summary] Result:`, summary);
      
      res.json(summary);
    } catch (error) {
      console.error('❌ [Ledger Summary] Error:', error);
      res.status(500).json({ error: "Failed to fetch ledger summary" });
    }
  });

  // Get customer's ledger balance
  app.get("/api/customers/:customerId/ledger-balance", async (req, res) => {
    try {
      const balance = await storage.getCustomerLedgerBalance(req.params.customerId);
      res.json({ balance });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer balance" });
    }
  });

  // Get recurring ledger transactions
  app.get("/api/vendors/:vendorId/ledger-transactions/recurring", async (req, res) => {
    try {
      const transactions = await storage.getRecurringLedgerTransactions(req.params.vendorId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recurring transactions" });
    }
  });

  // Create ledger transaction
  app.post("/api/vendors/:vendorId/ledger-transactions", async (req, res) => {
    try {
      const { insertLedgerTransactionSchema } = await import("@shared/schema");
      const validatedData = insertLedgerTransactionSchema.parse({
        ...req.body,
        vendorId: req.params.vendorId,
      });
      const transaction = await storage.createLedgerTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      console.error("Ledger transaction creation error:", error);
      res.status(400).json({ 
        error: "Invalid transaction data", 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  // Update ledger transaction
  app.patch("/api/ledger-transactions/:id", async (req, res) => {
    try {
      const transaction = await storage.updateLedgerTransaction(req.params.id, req.body);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Failed to update transaction" });
    }
  });

  // Delete ledger transaction
  app.delete("/api/ledger-transactions/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteLedgerTransaction(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  });

  // ====================
  // GREETING & MARKETING MODULE
  // ====================

  // Get all poster categories
  app.get("/api/poster-categories", async (req, res) => {
    try {
      const categories = await storage.getPosterCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching poster categories:", error);
      res.status(500).json({ error: "Failed to fetch poster categories" });
    }
  });

  // Create poster category (admin only)
  app.post("/api/poster-categories", async (req, res) => {
    try {
      const category = await storage.createPosterCategory(req.body);
      res.status(201).json(category);
    } catch (error: any) {
      console.error("Error creating poster category:", error);
      res.status(400).json({ error: error.message || "Failed to create poster category" });
    }
  });

  // Update poster category (admin only)
  app.patch("/api/poster-categories/:id", async (req, res) => {
    try {
      const category = await storage.updatePosterCategory(req.params.id, req.body);
      res.json(category);
    } catch (error: any) {
      console.error("Error updating poster category:", error);
      res.status(400).json({ error: error.message || "Failed to update poster category" });
    }
  });

  // Delete poster category (admin only)
  app.delete("/api/poster-categories/:id", async (req, res) => {
    try {
      await storage.deletePosterCategory(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting poster category:", error);
      res.status(500).json({ error: "Failed to delete poster category" });
    }
  });

  // Get all greeting templates with filters
  app.get("/api/greeting-templates", async (req, res) => {
    try {
      const { status, occasions, offerTypes, industries, isTrending } = req.query;
      
      const filters: any = {};
      if (status) filters.status = status as string;
      if (occasions) filters.occasions = (occasions as string).split(',');
      if (offerTypes) filters.offerTypes = (offerTypes as string).split(',');
      if (industries) filters.industries = (industries as string).split(',');
      if (isTrending !== undefined) filters.isTrending = isTrending === 'true';
      
      console.log('[API] Fetching greeting templates with filters:', filters);
      const templates = await storage.getAllGreetingTemplates(filters);
      console.log(`[API] Found ${templates.length} greeting templates`);
      res.json(templates);
    } catch (error: any) {
      console.error('[API] Failed to fetch greeting templates:', error);
      res.status(500).json({ 
        error: "Failed to fetch greeting templates",
        details: error?.message || String(error)
      });
    }
  });

  // Get single greeting template
  app.get("/api/greeting-templates/:id", async (req, res) => {
    try {
      const template = await storage.getGreetingTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  // Search greeting templates
  app.get("/api/greeting-templates/search/:query", async (req, res) => {
    try {
      const { occasions, offerTypes, industries } = req.query;
      
      const filters: any = {};
      if (occasions) filters.occasions = (occasions as string).split(',');
      if (offerTypes) filters.offerTypes = (offerTypes as string).split(',');
      if (industries) filters.industries = (industries as string).split(',');
      
      const templates = await storage.searchGreetingTemplates(req.params.query, filters);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Failed to search templates" });
    }
  });

  // Upload greeting template image to Supabase S3
  app.post("/api/greeting-templates/upload-image", createUploadMiddleware(), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      // Upload to admin posters category
      const result = await handleFileUpload(req.file, {
        vendorId: "admin",
        category: "posters",
        isPrivate: false,
      });
      
      console.log('[API] Greeting template image uploaded:', result.url);
      res.json(result);
    } catch (error) {
      console.error("Greeting template image upload error:", error);
      const message = error instanceof Error ? error.message : "Failed to upload image";
      res.status(400).json({ error: message });
    }
  });

  // Create greeting template (Admin only)
  app.post("/api/greeting-templates", async (req, res) => {
    try {
      console.log('[API] Creating greeting template:', req.body.title);
      const validatedData = insertGreetingTemplateSchema.parse(req.body);
      const template = await storage.createGreetingTemplate(validatedData);
      console.log('[API] Greeting template created:', template.id);
      res.status(201).json(template);
    } catch (error: any) {
      console.error("[API] Template creation error:", error);
      if (error.name === 'ZodError') {
        res.status(400).json({ 
          error: "Invalid template data",
          details: error.errors
        });
      } else {
        res.status(500).json({ 
          error: "Failed to create template",
          details: error?.message || String(error)
        });
      }
    }
  });

  // Update greeting template (Admin only)
  app.patch("/api/greeting-templates/:id", async (req, res) => {
    try {
      const template = await storage.updateGreetingTemplate(req.params.id, req.body);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(400).json({ error: "Failed to update template" });
    }
  });

  // Delete greeting template (Admin only)
  app.delete("/api/greeting-templates/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteGreetingTemplate(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete template" });
    }
  });

  // Track template download
  app.post("/api/greeting-templates/:id/download", async (req, res) => {
    try {
      await storage.incrementTemplateDownload(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to track download" });
    }
  });

  // Track template share
  app.post("/api/greeting-templates/:id/share", async (req, res) => {
    try {
      await storage.incrementTemplateShare(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to track share" });
    }
  });

  // Create greeting template usage (vendor customization)
  app.post("/api/greeting-template-usage", async (req, res) => {
    try {
      const validatedData = insertGreetingTemplateUsageSchema.parse(req.body);
      const usage = await storage.createGreetingTemplateUsage(validatedData);
      res.status(201).json(usage);
    } catch (error) {
      console.error("Template usage creation error:", error);
      res.status(400).json({ 
        error: "Invalid usage data",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Get vendor's greeting template usage history
  app.get("/api/vendors/:vendorId/greeting-template-usage", async (req, res) => {
    try {
      const usageHistory = await storage.getTemplateUsageByVendor(req.params.vendorId);
      res.json(usageHistory);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch usage history" });
    }
  });

  // Increment usage share count
  app.post("/api/greeting-template-usage/:id/share", async (req, res) => {
    try {
      const { platform } = req.body;
      if (!platform) {
        return res.status(400).json({ error: "Platform is required" });
      }
      await storage.incrementUsageShare(req.params.id, platform);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to track share" });
    }
  });

  // ==================== ATTENDANCE & LEAVE MANAGEMENT ROUTES ====================

  // Employee Attendance Routes
  app.get("/api/vendors/:vendorId/attendance", async (req, res) => {
    try {
      const { startDate, endDate, employeeId, status } = req.query;
      const filters: any = {};
      
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      if (employeeId) filters.employeeId = employeeId as string;
      if (status) filters.status = status as string;

      const attendance = await storage.getAttendanceByVendor(req.params.vendorId, filters);
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch attendance records" });
    }
  });

  app.get("/api/attendance/:id", async (req, res) => {
    try {
      const attendance = await storage.getAttendance(req.params.id);
      if (!attendance) {
        return res.status(404).json({ error: "Attendance record not found" });
      }
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch attendance record" });
    }
  });

  app.post("/api/attendance", async (req, res) => {
    try {
      const validatedData = insertAttendanceSchema.parse(req.body);
      
      // Check if attendance already exists for this employee today
      const todayStr = new Date(validatedData.date).toISOString().split('T')[0];
      const existingAttendance = await storage.getAttendanceByVendor(validatedData.vendorId);
      const todayAttendance = existingAttendance.find(a => {
        const recordDate = new Date(a.date).toISOString().split('T')[0];
        return a.employeeId === validatedData.employeeId && recordDate === todayStr;
      });

      let attendance;
      if (todayAttendance) {
        // Update existing attendance (don't count as new)
        console.log('[ATTENDANCE] Updating existing record for employee:', validatedData.employeeId);
        attendance = await storage.updateAttendance(todayAttendance.id, validatedData);
      } else {
        // Create new attendance
        console.log('[ATTENDANCE] Creating new record for employee:', validatedData.employeeId);
        attendance = await storage.createAttendance(validatedData);
      }
      
      res.status(todayAttendance ? 200 : 201).json(attendance);
    } catch (error) {
      console.error("Attendance creation error:", error);
      res.status(400).json({ 
        error: "Invalid attendance data",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.patch("/api/attendance/:id", async (req, res) => {
    try {
      const attendance = await storage.updateAttendance(req.params.id, req.body);
      if (!attendance) {
        return res.status(404).json({ error: "Attendance record not found" });
      }
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ error: "Failed to update attendance record" });
    }
  });

  app.delete("/api/attendance/:id", async (req, res) => {
    try {
      await storage.deleteAttendance(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete attendance record" });
    }
  });

  // Customer Attendance Routes
  app.get("/api/vendors/:vendorId/customer-attendance", async (req, res) => {
    try {
      const { startDate, endDate, customerId, status } = req.query;
      const filters: any = {};
      
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      if (customerId) filters.customerId = customerId as string;
      if (status) filters.status = status as string;

      const attendance = await storage.getCustomerAttendanceByVendor(req.params.vendorId, filters);
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer attendance records" });
    }
  });

  app.get("/api/customer-attendance/:id", async (req, res) => {
    try {
      const attendance = await storage.getCustomerAttendance(req.params.id);
      if (!attendance) {
        return res.status(404).json({ error: "Customer attendance record not found" });
      }
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer attendance record" });
    }
  });

  app.post("/api/customer-attendance", async (req, res) => {
    try {
      const validatedData = insertCustomerAttendanceSchema.parse(req.body);
      
      // Check if attendance already exists for this customer today
      const todayStr = new Date(validatedData.date).toISOString().split('T')[0];
      const existingAttendance = await storage.getCustomerAttendanceByVendor(validatedData.vendorId);
      const todayAttendance = existingAttendance.find(a => {
        const recordDate = new Date(a.date).toISOString().split('T')[0];
        return a.customerId === validatedData.customerId && recordDate === todayStr;
      });

      let attendance;
      if (todayAttendance) {
        // Update existing attendance (don't count as new)
        console.log('[CUSTOMER ATTENDANCE] Updating existing record for customer:', validatedData.customerId);
        attendance = await storage.updateCustomerAttendance(todayAttendance.id, validatedData);
      } else {
        // Create new attendance
        console.log('[CUSTOMER ATTENDANCE] Creating new record for customer:', validatedData.customerId);
        attendance = await storage.createCustomerAttendance(validatedData);
      }
      
      res.status(todayAttendance ? 200 : 201).json(attendance);
    } catch (error) {
      console.error("Customer attendance creation error:", error);
      res.status(400).json({ 
        error: "Invalid customer attendance data",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.patch("/api/customer-attendance/:id", async (req, res) => {
    try {
      const attendance = await storage.updateCustomerAttendance(req.params.id, req.body);
      if (!attendance) {
        return res.status(404).json({ error: "Customer attendance record not found" });
      }
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ error: "Failed to update customer attendance record" });
    }
  });

  app.delete("/api/customer-attendance/:id", async (req, res) => {
    try {
      await storage.deleteCustomerAttendance(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete customer attendance record" });
    }
  });

  // Leave Management Routes
  app.get("/api/vendors/:vendorId/leaves", async (req, res) => {
    try {
      const { startDate, endDate, employeeId, status, leaveType } = req.query;
      const filters: any = {};
      
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      if (employeeId) filters.employeeId = employeeId as string;
      if (status) filters.status = status as string;
      if (leaveType) filters.leaveType = leaveType as string;

      const leaves = await storage.getLeavesByVendor(req.params.vendorId, filters);
      res.json(leaves);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leave records" });
    }
  });

  app.get("/api/leaves/:id", async (req, res) => {
    try {
      const leave = await storage.getLeave(req.params.id);
      if (!leave) {
        return res.status(404).json({ error: "Leave record not found" });
      }
      res.json(leave);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leave record" });
    }
  });

  app.post("/api/leaves", async (req, res) => {
    try {
      console.log('[LEAVE] Received leave creation request:', JSON.stringify(req.body, null, 2));
      
      const validatedData = insertLeaveSchema.parse(req.body);
      console.log('[LEAVE] Validation passed');
      
      // If status is "approved", add approval fields
      const leaveData: any = { ...validatedData };
      if (validatedData.status === "approved") {
        // Set approvedBy if provided, otherwise use vendor ID
        const approvedById = req.body.approvedBy || validatedData.vendorId;
        console.log('[LEAVE] Checking if approvedBy user exists:', approvedById);
        
        // Verify the user exists before setting approvedBy
        try {
          const userExists = await storage.getUser(approvedById);
          if (userExists) {
            leaveData.approvedBy = approvedById;
            leaveData.approvedAt = req.body.approvedAt ? new Date(req.body.approvedAt) : new Date();
            console.log('[LEAVE] Auto-approving with approvedBy:', leaveData.approvedBy);
          } else {
            console.warn('[LEAVE] User not found, leaving approvedBy as null');
            leaveData.approvedBy = null;
            leaveData.approvedAt = null;
          }
        } catch (userCheckError) {
          console.warn('[LEAVE] Error checking user, leaving approvedBy as null:', userCheckError);
          leaveData.approvedBy = null;
          leaveData.approvedAt = null;
        }
      }
      
      const leave = await storage.createLeave(leaveData);
      console.log('[LEAVE] Leave created successfully:', leave.id);
      res.status(201).json(leave);
    } catch (error: any) {
      console.error("[LEAVE] Leave creation error:", error);
      if (error instanceof Error) {
        console.error("[LEAVE] Error message:", error.message);
        console.error("[LEAVE] Error stack:", error.stack);
      }
      
      // Check for specific database errors
      let errorDetails = error instanceof Error ? error.message : String(error);
      
      // Handle foreign key constraint errors
      if (error.code === '23503' || errorDetails.includes('foreign key constraint')) {
        console.error("[LEAVE] Foreign key constraint violation");
        errorDetails = "Invalid employee, vendor, or user reference. Please check the IDs.";
      }
      
      res.status(400).json({ 
        error: "Invalid leave data",
        details: errorDetails
      });
    }
  });

  app.patch("/api/leaves/:id", async (req, res) => {
    try {
      const leave = await storage.updateLeave(req.params.id, req.body);
      if (!leave) {
        return res.status(404).json({ error: "Leave record not found" });
      }
      res.json(leave);
    } catch (error) {
      res.status(500).json({ error: "Failed to update leave record" });
    }
  });

  app.post("/api/leaves/:id/approve", async (req, res) => {
    try {
      const { approvedBy } = req.body;
      if (!approvedBy) {
        return res.status(400).json({ error: "approvedBy is required" });
      }
      const leave = await storage.approveLeave(req.params.id, approvedBy);
      if (!leave) {
        return res.status(404).json({ error: "Leave record not found" });
      }
      res.json(leave);
    } catch (error) {
      res.status(500).json({ error: "Failed to approve leave" });
    }
  });

  app.post("/api/leaves/:id/reject", async (req, res) => {
    try {
      const { rejectedBy, reason } = req.body;
      if (!rejectedBy) {
        return res.status(400).json({ error: "rejectedBy is required" });
      }
      const leave = await storage.rejectLeave(req.params.id, rejectedBy, reason);
      if (!leave) {
        return res.status(404).json({ error: "Leave record not found" });
      }
      res.json(leave);
    } catch (error) {
      res.status(500).json({ error: "Failed to reject leave" });
    }
  });

  app.delete("/api/leaves/:id", async (req, res) => {
    try {
      await storage.deleteLeave(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete leave record" });
    }
  });

  // Leave Balance Routes
  app.get("/api/employees/:employeeId/leave-balances", async (req, res) => {
    try {
      const { vendorId } = req.query;
      if (!vendorId) {
        return res.status(400).json({ error: "vendorId is required" });
      }
      const balances = await storage.getLeaveBalancesByEmployee(req.params.employeeId, vendorId as string);
      res.json(balances);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leave balances" });
    }
  });

  app.post("/api/leave-balances", async (req, res) => {
    try {
      const validatedData = insertLeaveBalanceSchema.parse(req.body);
      const balance = await storage.createLeaveBalance(validatedData);
      res.status(201).json(balance);
    } catch (error) {
      console.error("Leave balance creation error:", error);
      res.status(400).json({ 
        error: "Invalid leave balance data",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.patch("/api/leave-balances/:id", async (req, res) => {
    try {
      const balance = await storage.updateLeaveBalance(req.params.id, req.body);
      if (!balance) {
        return res.status(404).json({ error: "Leave balance not found" });
      }
      res.json(balance);
    } catch (error) {
      res.status(500).json({ error: "Failed to update leave balance" });
    }
  });

  // ====================
  // POS BILLS
  // ====================

  // Get all bills for a vendor
  app.get("/api/vendors/:vendorId/bills", async (req, res) => {
    try {
      const { status, paymentStatus, customerId } = req.query;
      const bills = await storage.getBillsByVendor(req.params.vendorId, {
        status: status as string,
        paymentStatus: paymentStatus as string,
        customerId: customerId as string,
      });
      res.json(bills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bills" });
    }
  });

  // Get single bill
  app.get("/api/bills/:id", async (req, res) => {
    try {
      const bill = await storage.getBill(req.params.id);
      if (!bill) {
        return res.status(404).json({ error: "Bill not found" });
      }
      res.json(bill);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bill" });
    }
  });

  // Create new bill
  app.post("/api/vendors/:vendorId/bills", async (req, res) => {
    try {
      const validatedData = insertBillSchema.parse({
        ...req.body,
        vendorId: req.params.vendorId,
      });
      const bill = await storage.createBill(validatedData);
      res.status(201).json(bill);
    } catch (error) {
      console.error("Bill creation error:", error);
      res.status(400).json({ 
        error: "Invalid bill data",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Update bill
  app.patch("/api/bills/:id", async (req, res) => {
    try {
      const bill = await storage.updateBill(req.params.id, req.body);
      if (!bill) {
        return res.status(404).json({ error: "Bill not found" });
      }
      res.json(bill);
    } catch (error) {
      res.status(500).json({ error: "Failed to update bill" });
    }
  });

  // Complete bill
  app.post("/api/bills/:id/complete", async (req, res) => {
    try {
      const bill = await storage.completeBill(req.params.id);
      if (!bill) {
        return res.status(404).json({ error: "Bill not found" });
      }
      res.json(bill);
    } catch (error) {
      res.status(500).json({ error: "Failed to complete bill" });
    }
  });

  // ====================
  // POS BILL ITEMS
  // ====================

  // Get bill items
  app.get("/api/bills/:billId/items", async (req, res) => {
    try {
      const items = await storage.getBillItems(req.params.billId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bill items" });
    }
  });

  // Add item to bill
  app.post("/api/bills/:billId/items", async (req, res) => {
    try {
      const validatedData = insertBillItemSchema.parse({
        ...req.body,
        billId: req.params.billId,
      });
      
      // Create the bill item
      const item = await storage.addBillItem(validatedData);
      
      // 🔥 AUTO-REDUCE INVENTORY FOR PRODUCTS
      if (item.itemType === 'product' && item.productId) {
        try {
          console.log(`📦 Reducing inventory for product ${item.productId} by ${item.quantity}`);
          
          // Convert quantity from Decimal to number
          const quantityToReduce = typeof item.quantity === 'string' 
            ? parseFloat(item.quantity) 
            : Number(item.quantity);
          
          // Record stock out (reduces inventory automatically)
          const stockResult = await storage.recordStockOut(
            item.productId,
            quantityToReduce,
            {
              movementType: 'sale',
              reason: 'POS Sale',
              referenceType: 'bill',
              referenceId: req.params.billId,
            }
          );
          
          console.log(`✅ Inventory reduced. New stock: ${stockResult.newStock}`);
        } catch (stockError) {
          console.error('⚠️ Failed to reduce inventory:', stockError);
          // Don't fail the whole transaction if stock reduction fails
          // Bill item is still created, but log the error
        }
      }
      
      res.status(201).json(item);
    } catch (error) {
      console.error("Bill item creation error:", error);
      res.status(400).json({ 
        error: "Invalid bill item data",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Update bill item
  app.patch("/api/bill-items/:id", async (req, res) => {
    try {
      // Get the old item first to compare quantities
      const oldItem = await storage.getBillItem(req.params.id);
      if (!oldItem) {
        return res.status(404).json({ error: "Bill item not found" });
      }

      const item = await storage.updateBillItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ error: "Bill item not found" });
      }

      // 🔥 ADJUST INVENTORY IF QUANTITY CHANGED
      if (item.itemType === 'product' && item.productId && req.body.quantity) {
        try {
          const oldQty = typeof oldItem.quantity === 'string' 
            ? parseFloat(oldItem.quantity) 
            : Number(oldItem.quantity);
          const newQty = typeof req.body.quantity === 'string' 
            ? parseFloat(req.body.quantity) 
            : Number(req.body.quantity);
          
          const qtyDiff = newQty - oldQty;
          
          if (qtyDiff !== 0) {
            console.log(`📦 Adjusting inventory for product ${item.productId} by ${qtyDiff}`);
            
            if (qtyDiff > 0) {
              // Quantity increased - reduce more stock
              await storage.recordStockOut(
                item.productId,
                qtyDiff,
                {
                  movementType: 'sale',
                  reason: 'POS Sale - Quantity Increase',
                  referenceType: 'bill',
                  referenceId: item.billId,
                }
              );
            } else {
              // Quantity decreased - add stock back
              await storage.recordStockIn(
                item.productId,
                Math.abs(qtyDiff),
                {
                  movementType: 'return',
                  reason: 'POS Sale - Quantity Decrease',
                  referenceType: 'bill',
                  referenceId: item.billId,
                }
              );
            }
            
            console.log(`✅ Inventory adjusted by ${qtyDiff}`);
          }
        } catch (stockError) {
          console.error('⚠️ Failed to adjust inventory:', stockError);
        }
      }

      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to update bill item" });
    }
  });

  // Remove bill item
  app.delete("/api/bill-items/:id", async (req, res) => {
    try {
      // Get the item first to restore inventory
      const item = await storage.getBillItem(req.params.id);
      
      if (item) {
        // 🔥 RESTORE INVENTORY WHEN ITEM IS REMOVED
        if (item.itemType === 'product' && item.productId) {
          try {
            const quantity = typeof item.quantity === 'string' 
              ? parseFloat(item.quantity) 
              : Number(item.quantity);
            
            console.log(`📦 Restoring inventory for product ${item.productId} by ${quantity}`);
            
            await storage.recordStockIn(
              item.productId,
              quantity,
              {
                movementType: 'return',
                reason: 'POS Sale - Item Removed',
                referenceType: 'bill',
                referenceId: item.billId,
              }
            );
            
            console.log(`✅ Inventory restored by ${quantity}`);
          } catch (stockError) {
            console.error('⚠️ Failed to restore inventory:', stockError);
          }
        }
      }

      await storage.removeBillItem(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove bill item" });
    }
  });

  // ====================
  // COUPONS
  // ====================

  // Get vendor coupons
  app.get("/api/vendors/:vendorId/coupons", async (req, res) => {
    try {
      const coupons = await storage.getCouponsByVendor(req.params.vendorId);
      res.json(coupons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch coupons" });
    }
  });

  // Validate coupon
  app.post("/api/vendors/:vendorId/coupons/validate", async (req, res) => {
    try {
      const { code, subtotal } = req.body;
      const coupon = await storage.validateCoupon(req.params.vendorId, code, subtotal);
      if (!coupon) {
        return res.status(404).json({ error: "Invalid or expired coupon" });
      }
      res.json(coupon);
    } catch (error) {
      res.status(400).json({ error: "Coupon validation failed" });
    }
  });

  // ====================
  // POS BILL PAYMENTS
  // ====================

  // Get bill payments
  app.get("/api/bills/:billId/payments", async (req, res) => {
    try {
      const payments = await storage.getBillPayments(req.params.billId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bill payments" });
    }
  });

  // Record payment
  app.post("/api/bills/:billId/payments", async (req, res) => {
    try {
      const validatedData = insertBillPaymentSchema.parse({
        ...req.body,
        billId: req.params.billId,
      });
      const payment = await storage.recordPayment(validatedData);
      res.status(201).json(payment);
    } catch (error) {
      console.error("Payment record error:", error);
      res.status(400).json({ 
        error: "Invalid payment data",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // ====================
  // OBJECT STORAGE - EMPLOYEE DOCUMENTS (Commented out until object storage is set up)
  // ====================

  /* Commented out until object storage bucket is configured
  // Get upload URL for employee documents
  app.post("/api/objects/upload", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Upload URL generation error:", error);
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  });

  // Serve employee document files
  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const key = await objectStorageService.getObjectEntityFile(req.path);
      await objectStorageService.downloadObject(key, res);
    } catch (error) {
      console.error("Error serving object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Update employee documents after upload
  app.put("/api/employees/:employeeId/documents", async (req, res) => {
    try {
      if (!req.body.documentURL) {
        return res.status(400).json({ error: "documentURL is required" });
      }

      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(req.body.documentURL);
      
      // Add document to employee's documents array
      const employee = await storage.getEmployee(req.params.employeeId);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }

      const updatedDocuments = [...(employee.documents || []), objectPath];
      await storage.updateEmployee(req.params.employeeId, { documents: updatedDocuments });

      res.status(200).json({ objectPath, documents: updatedDocuments });
    } catch (error) {
      console.error("Error adding employee document:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  */

  // ====================
  // EMPLOYEE PAYROLL
  // ====================

  // Get payroll records for an employee
  app.get("/api/employees/:employeeId/payroll", async (req, res) => {
    try {
      const payrolls = await storage.getPayrollByEmployee(req.params.employeeId);
      res.json(payrolls);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payroll records" });
    }
  });

  // Create payroll record (pay salary)
  app.post("/api/employees/:employeeId/payroll", async (req, res) => {
    try {
      const validatedData = insertPayrollSchema.parse({
        ...req.body,
        employeeId: req.params.employeeId,
      });
      const payroll = await storage.createPayroll(validatedData);
      res.status(201).json(payroll);
    } catch (error) {
      console.error("Payroll creation error:", error);
      res.status(400).json({ 
        error: "Invalid payroll data",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // ====================
  // ADMIN AGGREGATION ROUTES
  // ====================

  // Get all leads across vendors with filtering
  app.get("/api/admin/leads", async (req, res) => {
    try {
      // Parse query parameters
      const filters: any = {};
      
      if (req.query.vendorIds) {
        filters.vendorIds = Array.isArray(req.query.vendorIds) 
          ? req.query.vendorIds 
          : [req.query.vendorIds];
      }
      
      if (req.query.categories) {
        filters.categories = Array.isArray(req.query.categories) 
          ? req.query.categories 
          : [req.query.categories];
      }
      
      if (req.query.status) {
        filters.status = Array.isArray(req.query.status) 
          ? req.query.status 
          : [req.query.status];
      }
      
      if (req.query.source) {
        filters.source = Array.isArray(req.query.source) 
          ? req.query.source 
          : [req.query.source];
      }
      
      if (req.query.priority) {
        filters.priority = Array.isArray(req.query.priority) 
          ? req.query.priority 
          : [req.query.priority];
      }
      
      if (req.query.assignedEmployeeIds) {
        filters.assignedEmployeeIds = Array.isArray(req.query.assignedEmployeeIds) 
          ? req.query.assignedEmployeeIds 
          : [req.query.assignedEmployeeIds];
      }
      
      if (req.query.leadScoreMin) {
        filters.leadScoreMin = Number(req.query.leadScoreMin);
      }
      
      if (req.query.leadScoreMax) {
        filters.leadScoreMax = Number(req.query.leadScoreMax);
      }
      
      if (req.query.startDate || req.query.endDate) {
        filters.dateRange = {};
        if (req.query.startDate) filters.dateRange.start = req.query.startDate;
        if (req.query.endDate) filters.dateRange.end = req.query.endDate;
      }
      
      if (req.query.search) {
        filters.search = req.query.search;
      }
      
      if (req.query.sortBy) {
        filters.sortBy = req.query.sortBy;
      }
      
      if (req.query.sortOrder) {
        filters.sortOrder = req.query.sortOrder;
      }
      
      if (req.query.limit) {
        filters.limit = Number(req.query.limit);
      }
      
      if (req.query.offset) {
        filters.offset = Number(req.query.offset);
      }
      
      // Validate filters
      const validatedFilters = adminLeadsFilterSchema.parse(filters);
      
      // Fetch leads with filters
      const result = await storage.getAllLeads(validatedFilters);
      res.json(result);
    } catch (error) {
      console.error("Admin leads fetch error:", error);
      res.status(400).json({ 
        error: "Failed to fetch leads",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Get all customers across vendors with filtering
  app.get("/api/admin/customers", async (req, res) => {
    try {
      // Parse query parameters
      const filters: any = {};
      
      if (req.query.vendorIds) {
        filters.vendorIds = Array.isArray(req.query.vendorIds) 
          ? req.query.vendorIds 
          : [req.query.vendorIds];
      }
      
      if (req.query.customerType) {
        filters.customerType = Array.isArray(req.query.customerType) 
          ? req.query.customerType 
          : [req.query.customerType];
      }
      
      if (req.query.status) {
        filters.status = Array.isArray(req.query.status) 
          ? req.query.status 
          : [req.query.status];
      }
      
      if (req.query.membershipType) {
        filters.membershipType = Array.isArray(req.query.membershipType) 
          ? req.query.membershipType 
          : [req.query.membershipType];
      }
      
      if (req.query.subscriptionStatus) {
        filters.subscriptionStatus = Array.isArray(req.query.subscriptionStatus) 
          ? req.query.subscriptionStatus 
          : [req.query.subscriptionStatus];
      }
      
      if (req.query.startDate || req.query.endDate) {
        filters.dateRange = {};
        if (req.query.startDate) filters.dateRange.start = req.query.startDate;
        if (req.query.endDate) filters.dateRange.end = req.query.endDate;
      }
      
      if (req.query.search) {
        filters.search = req.query.search;
      }
      
      if (req.query.sortBy) {
        filters.sortBy = req.query.sortBy;
      }
      
      if (req.query.sortOrder) {
        filters.sortOrder = req.query.sortOrder;
      }
      
      if (req.query.limit) {
        filters.limit = Number(req.query.limit);
      }
      
      if (req.query.offset) {
        filters.offset = Number(req.query.offset);
      }
      
      // Validate filters
      const validatedFilters = adminCustomersFilterSchema.parse(filters);
      
      // Fetch customers with filters
      const result = await storage.getAllCustomers(validatedFilters);
      res.json(result);
    } catch (error) {
      console.error("Admin customers fetch error:", error);
      res.status(400).json({ 
        error: "Failed to fetch customers",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Get all orders across vendors with filtering
  app.get("/api/admin/orders", async (req, res) => {
    try {
      console.log('📦 [API] Fetching all orders with params:', req.query);

      // Parse query parameters
      const filters: any = {};
      
      // Parse comma-separated multi-select filters
      if (req.query.vendorIds) {
        const vendorIds = String(req.query.vendorIds);
        filters.vendorIds = vendorIds.includes(',') ? vendorIds.split(',') : [vendorIds];
      }
      
      if (req.query.statuses) {
        const statuses = String(req.query.statuses);
        filters.statuses = statuses.includes(',') ? statuses.split(',') : [statuses];
      }
      
      if (req.query.paymentStatuses) {
        const paymentStatuses = String(req.query.paymentStatuses);
        filters.paymentStatuses = paymentStatuses.includes(',') ? paymentStatuses.split(',') : [paymentStatuses];
      }
      
      if (req.query.paymentMethods) {
        const paymentMethods = String(req.query.paymentMethods);
        filters.paymentMethods = paymentMethods.includes(',') ? paymentMethods.split(',') : [paymentMethods];
      }
      
      if (req.query.sources) {
        const sources = String(req.query.sources);
        filters.sources = sources.includes(',') ? sources.split(',') : [sources];
      }
      
      if (req.query.prescriptionRequired !== undefined) {
        filters.prescriptionRequired = req.query.prescriptionRequired === 'true';
      }
      
      if (req.query.startDate || req.query.endDate) {
        filters.dateRange = {};
        if (req.query.startDate) filters.dateRange.start = req.query.startDate;
        if (req.query.endDate) filters.dateRange.end = req.query.endDate;
      }
      
      if (req.query.search) {
        filters.search = String(req.query.search);
      }
      
      if (req.query.sortBy) {
        filters.sortBy = req.query.sortBy;
      }
      
      if (req.query.sortOrder) {
        filters.sortOrder = req.query.sortOrder;
      }
      
      // Parse pagination parameters
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      filters.limit = limit;
      filters.offset = (page - 1) * limit;
      
      console.log('🔍 [API] Parsed filters:', filters);
      
      // Fetch orders with filters
      const result = await storage.getAllOrders(filters);
      
      // Return paginated response
      res.json({
        orders: result.orders,
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error) {
      console.error("❌ [API] Admin orders fetch error:", error);
      res.status(400).json({ 
        error: "Failed to fetch orders",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // ====================
  // SUBSCRIPTION & BILLING MODULE
  // ====================
  
  // ===== SUBSCRIPTION PLANS =====
  
  // Get all subscription plans
  app.get("/api/subscription-plans", async (req, res) => {
    try {
      const activeOnly = req.query.activeOnly === "true";
      const plans = await storage.getAllSubscriptionPlans(activeOnly);
      res.json(plans);
    } catch (error: any) {
      console.error("Error fetching subscription plans:", error);
      console.error("Error details:", {
        message: error?.message,
        detail: error?.detail,
        code: error?.code,
        stack: error?.stack,
      });
      res.status(500).json({ 
        error: "Failed to fetch subscription plans",
        message: error?.message || "Unknown error",
        details: process.env.NODE_ENV === 'development' ? error?.detail : undefined
      });
    }
  });

  // Get single subscription plan
  app.get("/api/subscription-plans/:id", async (req, res) => {
    try {
      const plan = await storage.getSubscriptionPlan(req.params.id);
      if (!plan) {
        return res.status(404).json({ error: "Subscription plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription plan" });
    }
  });

  // Create subscription plan (Admin only)
  app.post("/api/subscription-plans", async (req, res) => {
    try {
      const plan = await storage.createSubscriptionPlan(req.body);
      res.status(201).json(plan);
    } catch (error) {
      res.status(400).json({ error: "Failed to create subscription plan" });
    }
  });

  // Update subscription plan (Admin only)
  app.patch("/api/subscription-plans/:id", async (req, res) => {
    try {
      const plan = await storage.updateSubscriptionPlan(req.params.id, req.body);
      if (!plan) {
        return res.status(404).json({ error: "Subscription plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(400).json({ error: "Failed to update subscription plan" });
    }
  });

  // Delete subscription plan (Admin only)
  app.delete("/api/subscription-plans/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteSubscriptionPlan(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Subscription plan not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete subscription plan" });
    }
  });


  // Get all vendor subscriptions (Admin only)
  app.get("/api/vendor-subscriptions", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      console.log('[API] Fetching vendor subscriptions', status ? `with status: ${status}` : '');
      const subscriptions = await storage.getAllVendorSubscriptions(status);
      console.log('[API] Fetched', subscriptions.length, 'vendor subscriptions');
      res.json(subscriptions);
    } catch (error: any) {
      console.error("Error fetching vendor subscriptions:", error);
      console.error("Error details:", {
        message: error?.message,
        detail: error?.detail,
        code: error?.code,
        stack: error?.stack,
      });
      res.status(500).json({ 
        error: "Failed to fetch vendor subscriptions",
        message: error?.message || "Unknown error",
        details: process.env.NODE_ENV === 'development' ? error?.detail : undefined
      });
    }
  });

  // Create vendor subscription
  app.post("/api/vendor-subscriptions", async (req, res) => {
    try {
      // Validate the request data (schema transforms string dates to Date objects)
      const validatedData = insertVendorSubscriptionSchema.parse(req.body);
      const subscription = await storage.createVendorSubscription(validatedData);
      res.status(201).json(subscription);
    } catch (error: any) {
      console.error("Error creating vendor subscription:", error);

      // Extract specific validation errors
      let validationErrors: any[] = [];
      if (error?.issues) {
        // Zod validation errors - format them nicely
        validationErrors = error.issues.map((issue: any) => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
          expected: issue.expected,
          received: issue.received
        }));
      }

      res.status(400).json({
        error: "Failed to create vendor subscription",
        message: "Please check the subscription data",
        validationErrors: validationErrors,
        summary: validationErrors.length > 0
          ? `${validationErrors.length} field(s) have validation errors`
          : error?.message || "Database error occurred",
        requiredFields: [
          "vendorId", "planId", "currentPeriodEnd"
        ],
        optionalFields: [
          "status", "startDate", "currentPeriodStart", "trialEndDate",
          "canceledAt", "endedAt", "stripeSubscriptionId", "stripeCustomerId",
          "razorpayOrderId", "razorpayPaymentId", "paymentStatus", "autoRenew"
        ]
      });
    }
  });

  // Update vendor subscription
  app.patch("/api/vendor-subscriptions/:id", async (req, res) => {
    try {
      // Validate the request data (schema transforms string dates to Date objects)
      const validatedData = insertVendorSubscriptionSchema.parse(req.body);
      const subscription = await storage.updateVendorSubscription(req.params.id, validatedData);
      if (!subscription) {
        return res.status(404).json({ error: "Vendor subscription not found" });
      }
      res.json(subscription);
    } catch (error: any) {
      console.error("Error updating vendor subscription:", error);

      // Extract specific validation errors
      let validationErrors: any[] = [];
      if (error?.issues) {
        // Zod validation errors - format them nicely
        validationErrors = error.issues.map((issue: any) => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
          expected: issue.expected,
          received: issue.received
        }));
      }

      res.status(400).json({
        error: "Failed to update vendor subscription",
        message: "Please check the data formats",
        validationErrors: validationErrors,
        summary: validationErrors.length > 0
          ? `${validationErrors.length} field(s) have validation errors`
          : "Validation failed"
      });
    }
  });

  // Cancel vendor subscription
  app.post("/api/vendor-subscriptions/:id/cancel", async (req, res) => {
    try {
      const subscription = await storage.cancelVendorSubscription(req.params.id);
      if (!subscription) {
        return res.status(404).json({ error: "Vendor subscription not found" });
      }
      res.json(subscription);
    } catch (error) {
      res.status(400).json({ error: "Failed to cancel vendor subscription" });
    }
  });

  // Create Razorpay order for subscription payment
  app.post("/api/vendor-subscriptions/create-payment", async (req, res) => {
    try {
      const { planId, vendorId, billingName, billingEmail, billingPhone, billingAddress, billingGst } = req.body;

      if (!planId || !vendorId) {
        return res.status(400).json({
          error: "Missing required fields",
          message: "planId and vendorId are required"
        });
      }

      // Get plan details - support both ID and name ("pro", "free")
      let plan = await storage.getSubscriptionPlan(planId);
      if (!plan) {
        // Try to find by name
        const allPlans = await storage.getAllSubscriptionPlans();
        plan = allPlans.find(p => p.name.toLowerCase() === planId.toLowerCase()) || null;
      }
      
      // If still no plan and planId is "pro", create the Pro plan in database
      if (!plan && planId.toLowerCase() === "pro") {
        console.log('[PAYMENT] Creating Pro plan in database...');
        const proPlanData = {
          name: "Pro",
          displayName: "Vyora Pro",
          description: "All features unlocked - Orders, POS, Analytics, Marketing & more",
          price: "399",
          currency: "INR",
          billingInterval: "month",
          maxServices: -1,
          maxProducts: -1,
          maxEmployees: -1,
          maxCustomers: -1,
          maxOrders: -1,
          maxBookings: -1,
          maxAppointments: -1,
          maxStorageGB: 10,
          hasAdvancedAnalytics: true,
          hasPrioritySupport: true,
          hasCustomDomain: true,
          hasMiniWebsite: true,
          hasWhiteLabel: false,
          hasAPI: true,
          hasMultiLocation: true,
          isActive: true,
          isPopular: true,
          displayOrder: 1,
          trialDays: 0,
        };
        plan = await storage.createSubscriptionPlan(proPlanData);
        console.log('[PAYMENT] Pro plan created with ID:', plan.id);
      }
      
      if (!plan) {
        return res.status(400).json({ error: "Invalid plan", message: "Plan not found" });
      }

      // Get vendor details
      const vendor = await storage.getVendor(vendorId);
      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }

      // Check for existing subscription - reuse or update instead of creating duplicate
      let subscription = await storage.getVendorSubscriptionByVendor(vendorId);
      
      if (subscription) {
        // Update existing subscription with new attempt
        console.log('[PAYMENT] Updating existing subscription:', subscription.id);
        subscription = await storage.updateVendorSubscription(subscription.id, {
          planId: plan.id,
          status: 'pending',
          startDate: new Date(),
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          paymentStatus: 'pending'
        }) as any;
      } else {
        // Create new subscription entry
        console.log('[PAYMENT] Creating new subscription');
      const subscriptionData = {
        vendorId: vendor.id,
        planId: plan.id,
          status: 'pending',
        startDate: new Date(),
        currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        paymentStatus: 'pending',
        autoRenew: true
      };
        subscription = await storage.createVendorSubscription(subscriptionData);
      }

      // Store billing details (will be associated with the transaction after payment)
      console.log('[PAYMENT] Creating subscription with billing:', { billingName, billingEmail, billingPhone });

      // Initialize Razorpay
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_RugtddoC1ALdFB',
        key_secret: process.env.RAZORPAY_KEY_SECRET || 'IHP66Sd1fwviFAG0ESRYOeua'
      });

      // Create Razorpay order
      const priceInRupees = typeof plan.price === 'string' ? parseFloat(plan.price) : plan.price;
      const orderOptions = {
        amount: Math.round(priceInRupees * 100), // Amount in paisa (multiply by 100)
        currency: 'INR',
        receipt: `sub_${Date.now()}`,
        payment_capture: 1, // Auto capture
        notes: {
          vendorId: vendor.id,
          planId: plan.id,
          planName: plan.name,
          subscriptionId: subscription.id
        }
      };

      const order = await razorpay.orders.create(orderOptions);

      // Update subscription with Razorpay order ID
      await storage.updateVendorSubscription(subscription.id, {
        razorpayOrderId: order.id
      });

      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        subscriptionId: subscription.id,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_RhHdGgNx7Uu3Rf'
      });

    } catch (error: any) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({
        error: "Failed to create payment order",
        message: error?.message || "Payment order creation failed"
      });
    }
  });

  // Handle Razorpay payment success
  app.post("/api/vendor-subscriptions/payment-success", async (req, res) => {
    try {
      console.log('[PAYMENT SUCCESS] Received payment success request:', req.body);
      const { subscriptionId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

      if (!subscriptionId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({
          error: "Missing required payment data",
          message: "subscriptionId, razorpayOrderId, razorpayPaymentId, and razorpaySignature are required"
        });
      }

      // Verify payment signature (recommended for production)
      // const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      //   .update(razorpayOrderId + '|' + razorpayPaymentId)
      //   .digest('hex');

      // if (expectedSignature !== razorpaySignature) {
      //   return res.status(400).json({ error: "Invalid payment signature" });
      // }

      // Update subscription with payment details and activate it
      const updatedSubscription = await storage.updateVendorSubscription(subscriptionId, {
        razorpayPaymentId,
        paymentStatus: 'completed',
        status: 'active'
      });

      if (!updatedSubscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      // Get plan details for billing history
      const plan = await storage.getSubscriptionPlan(updatedSubscription.planId);

      // Create billing history record for successful payment
      try {
        // Fetch order details from Razorpay to get the amount
        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_RhHdGgNx7Uu3Rf',
          key_secret: process.env.RAZORPAY_KEY_SECRET || 'vCCsk3Ik5YYplYYWWLTqSHKv'
        });

        let orderAmount = '0';
        try {
          const orderDetails = await razorpay.orders.fetch(razorpayOrderId);
          orderAmount = (orderDetails.amount / 100).toString(); // Convert from paisa to rupees
        } catch (orderError) {
          console.warn('[BILLING] Could not fetch order details from Razorpay, using default amount');
          // Use a default amount or try to get it from the plan
          orderAmount = plan?.price || '0';
        }

        const billingData = {
          vendorId: updatedSubscription.vendorId,
          planId: updatedSubscription.planId,
          subscriptionId: subscriptionId,
          amount: orderAmount,
          currency: "INR",
          status: "succeeded",
          paymentMethod: "razorpay",
          paymentId: razorpayPaymentId,
          description: `Payment for subscription plan - Order ${razorpayOrderId}`,
          periodStart: updatedSubscription.currentPeriodStart,
          periodEnd: updatedSubscription.currentPeriodEnd,
          stripeInvoiceId: null,
          stripePaymentIntentId: null,
          razorpayOrderId: razorpayOrderId,
          razorpayPaymentId: razorpayPaymentId,
          metadata: {
            subscriptionActivated: true,
            planName: plan?.name || 'Unknown Plan',
            billingInterval: plan?.billingInterval || 'monthly'
          }
        };

        console.log('[BILLING] Creating billing history with data:', billingData);
        const billingResult = await storage.createBillingHistory(billingData);
        console.log('[BILLING] Created billing history successfully:', billingResult.id);
      } catch (billingError) {
        console.error('[BILLING] Failed to create billing history:', billingError);
        console.error('[BILLING] Error details:', billingError?.message, billingError?.stack);
        // Don't fail the payment if billing history creation fails
      }

      res.json({
        success: true,
        message: "Payment processed successfully",
        subscription: updatedSubscription
      });

    } catch (error: any) {
      console.error("Error processing payment success:", error);
      res.status(500).json({
        error: "Failed to process payment",
        message: error?.message || "Payment processing failed"
      });
    }
  });

  // ===== BILLING HISTORY =====
  
  // Get vendor's billing history
  app.get("/api/vendors/:vendorId/billing-history", async (req, res) => {
    try {
      const billingHistory = await storage.getBillingHistoryByVendor(req.params.vendorId);
      res.json(billingHistory);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch billing history" });
    }
  });

  // Get all billing history (Admin only)
  app.get("/api/billing-history", async (req, res) => {
    try {
      const billingHistory = await storage.getAllBillingHistory();
      res.json(billingHistory);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch billing history" });
    }
  });

  // Create billing history entry
  app.post("/api/billing-history", async (req, res) => {
    try {
      const billing = await storage.createBillingHistory(req.body);
      res.status(201).json(billing);
    } catch (error) {
      res.status(400).json({ error: "Failed to create billing history" });
    }
  });

  // Update billing history
  app.patch("/api/billing-history/:id", async (req, res) => {
    try {
      const billing = await storage.updateBillingHistory(req.params.id, req.body);
      if (!billing) {
        return res.status(404).json({ error: "Billing history not found" });
      }
      res.json(billing);
    } catch (error) {
      res.status(400).json({ error: "Failed to update billing history" });
    }
  });

  // ===== USAGE TRACKING =====
  
  // Get vendor's usage logs
  app.get("/api/vendors/:vendorId/usage-logs", async (req, res) => {
    try {
      const feature = req.query.feature as string | undefined;
      const usageLogs = await storage.getUsageLogsByVendor(req.params.vendorId, feature);
      res.json(usageLogs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch usage logs" });
    }
  });

  // Create usage log
  app.post("/api/usage-logs", async (req, res) => {
    try {
      const log = await storage.createUsageLog(req.body);
      res.status(201).json(log);
    } catch (error) {
      res.status(400).json({ error: "Failed to create usage log" });
    }
  });

  // ===== PAYU PAYMENT INTEGRATION =====
  
  // PayU hash generation request schema
  const payuHashRequestSchema = z.object({
    txnid: z.string().min(1),
    amount: z.string().or(z.number()),
    productinfo: z.string().min(1),
    firstname: z.string().min(1),
    email: z.string().email(),
  });
  
  // Generate PayU payment hash
  app.post("/api/payments/payu/generate-hash", async (req, res) => {
    try {
      const validated = payuHashRequestSchema.parse(req.body);
      const crypto = require('crypto');
      
      // PayU credentials (should be in environment variables)
      const merchantKey = process.env.PAYU_MERCHANT_KEY || "test_key";
      const salt = process.env.PAYU_SALT || "test_salt";
      
      // Generate hash: sha512(key|txnid|amount|productinfo|firstname|email|||||||||||salt)
      const hashString = `${merchantKey}|${validated.txnid}|${validated.amount}|${validated.productinfo}|${validated.firstname}|${validated.email}|||||||||||${salt}`;
      const hash = crypto.createHash('sha512').update(hashString).digest('hex');
      
      res.json({ hash, merchantKey });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to generate payment hash" });
    }
  });

  // PayU callback request schema
  const payuCallbackSchema = z.object({
    txnid: z.string().min(1),
    status: z.string().min(1),
    amount: z.string().or(z.number()),
    mihpayid: z.string().optional(),
    vendorId: z.string().min(1),
    planId: z.string().min(1),
  });
  
  // PayU payment success callback
  app.post("/api/payments/payu/success", async (req, res) => {
    try {
      const validated = payuCallbackSchema.parse(req.body);
      
      if (validated.status === "success") {
        // Create billing history record
        await storage.createBillingHistory({
          vendorId: validated.vendorId,
          planId: validated.planId,
          subscriptionId: null,
          amount: validated.amount.toString(),
          currency: "INR",
          status: "succeeded",
          paymentMethod: "payu",
          description: `Payment for subscription plan`,
          periodStart: null,
          periodEnd: null,
          stripeInvoiceId: null,
          stripePaymentIntentId: null,
          stripeChargeId: validated.mihpayid || null,
          paidAt: new Date(),
          failureReason: null,
          invoiceNumber: validated.txnid,
          invoiceUrl: null,
        });
      }
      
      res.json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid callback data", details: error.errors });
      }
      res.status(500).json({ error: "Payment callback processing failed" });
    }
  });

  // ========== MASTER PRODUCTS MODULE ==========
  
  // Admin: Get all master products with pagination, filtering, and sorting
  app.get("/api/admin/master-products", async (req, res) => {
    try {
      // Parse query parameters
      const filters: any = {};
      
      if (req.query.status) {
        filters.status = req.query.status;
      }
      
      if (req.query.category) {
        filters.category = req.query.category;
      }
      
      if (req.query.categoryIds) {
        filters.categoryIds = Array.isArray(req.query.categoryIds) 
          ? req.query.categoryIds 
          : [req.query.categoryIds];
      }
      
      if (req.query.subcategoryIds) {
        filters.subcategoryIds = Array.isArray(req.query.subcategoryIds) 
          ? req.query.subcategoryIds 
          : [req.query.subcategoryIds];
      }
      
      if (req.query.search) {
        filters.search = req.query.search;
      }
      
      if (req.query.priceMin) {
        filters.priceMin = Number(req.query.priceMin);
      }
      
      if (req.query.priceMax) {
        filters.priceMax = Number(req.query.priceMax);
      }
      
      if (req.query.brand) {
        filters.brand = req.query.brand;
      }
      
      if (req.query.requiresPrescription) {
        filters.requiresPrescription = req.query.requiresPrescription === 'true';
      }
      
      if (req.query.isUniversal !== undefined) {
        filters.isUniversal = req.query.isUniversal === 'true';
      }
      
      if (req.query.sortBy) {
        filters.sortBy = req.query.sortBy;
      }
      
      if (req.query.sortOrder) {
        filters.sortOrder = req.query.sortOrder;
      }
      
      if (req.query.limit) {
        filters.limit = Number(req.query.limit);
      }
      
      if (req.query.offset) {
        filters.offset = Number(req.query.offset);
      }
      
      // Fetch all products first
      let products = await storage.getAllMasterProducts();
      
      // Apply filters
      if (filters.status) {
        products = products.filter(p => p.status === filters.status);
      }
      
      if (filters.category) {
        products = products.filter(p => p.category === filters.category);
      }
      
      if (filters.categoryIds && filters.categoryIds.length > 0) {
        products = products.filter(p => p.categoryId && filters.categoryIds.includes(p.categoryId));
      }
      
      if (filters.subcategoryIds && filters.subcategoryIds.length > 0) {
        products = products.filter(p => p.subcategoryId && filters.subcategoryIds.includes(p.subcategoryId));
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          (p.brand && p.brand.toLowerCase().includes(searchLower)) ||
          (p.tags && p.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
      }
      
      if (filters.priceMin !== undefined) {
        products = products.filter(p => p.basePrice && p.basePrice >= filters.priceMin);
      }
      
      if (filters.priceMax !== undefined) {
        products = products.filter(p => p.basePrice && p.basePrice <= filters.priceMax);
      }
      
      if (filters.brand) {
        products = products.filter(p => p.brand && p.brand.toLowerCase().includes(filters.brand.toLowerCase()));
      }
      
      if (filters.requiresPrescription !== undefined) {
        products = products.filter(p => p.requiresPrescription === filters.requiresPrescription);
      }
      
      if (filters.isUniversal !== undefined) {
        products = products.filter(p => p.isUniversal === filters.isUniversal);
      }
      
      // Sorting
      const sortBy = filters.sortBy || 'createdAt';
      const sortOrder = filters.sortOrder || 'desc';
      
      products.sort((a: any, b: any) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        // Handle null/undefined values
        if (aVal === null || aVal === undefined) aVal = '';
        if (bVal === null || bVal === undefined) bVal = '';
        
        // Handle numeric sorting
        if (sortBy === 'basePrice') {
          aVal = aVal || 0;
          bVal = bVal || 0;
        }
        
        if (aVal === bVal) return 0;
        
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
      
      // Pagination
      const total = products.length;
      const limit = filters.limit || 24;
      const offset = filters.offset || 0;
      const paginatedProducts = products.slice(offset, offset + limit);
      
      res.json({
        products: paginatedProducts,
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      });
    } catch (error) {
      console.error("Admin master products fetch error:", error);
      res.status(500).json({ 
        error: "Failed to fetch master products",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Admin: Get single master product
  app.get("/api/admin/master-products/:id", async (req, res) => {
    try {
      const product = await storage.getMasterProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch master product" });
    }
  });
  
  // Admin: Create master product
  app.post("/api/admin/master-products", async (req, res) => {
    try {
      const validated = insertMasterProductSchema.parse(req.body);
      const product = await storage.createMasterProduct(validated);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid product data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create master product" });
    }
  });
  
  // Admin: Update master product (increments version)
  app.put("/api/admin/master-products/:id", async (req, res) => {
    try {
      const existing = await storage.getMasterProduct(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      const validated = insertMasterProductSchema.partial().parse(req.body);
      
      // Increment version if substantive changes made
      const updates = {
        ...validated,
        version: existing.version + 1,
      };
      
      const product = await storage.updateMasterProduct(req.params.id, updates);
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid product data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update master product" });
    }
  });
  
  // Admin: Delete master product
  app.delete("/api/admin/master-products/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteMasterProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete master product" });
    }
  });
  
  // Admin: Upload endpoints - not needed for local data URL approach
  // These will be implemented when Object Storage is configured
  app.post("/api/admin/master-products/upload-image", async (req, res) => {
    res.status(501).json({ error: "Object storage not configured. Images are stored as data URLs for now." });
  });
  
  app.post("/api/admin/master-products/confirm-image", async (req, res) => {
    res.status(501).json({ error: "Object storage not configured. Images are stored as data URLs for now." });
  });
  
  // Vendor: Browse master products
  app.get("/api/vendor/master-products", async (req, res) => {
    try {
      const { category, subcategory, search } = req.query;
      let products = await storage.getAllMasterProducts();
      
      // Only show published products to vendors
      products = products.filter(p => p.status === 'published');
      
      // Filter by category
      if (category && typeof category === 'string') {
        products = products.filter(p => p.category === category);
      }
      
      // Filter by subcategory
      if (subcategory && typeof subcategory === 'string') {
        products = products.filter(p => p.subcategory === subcategory);
      }
      
      // Search
      if (search && typeof search === 'string') {
        const searchLower = search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch master products" });
    }
  });
  
  // Vendor: Get single master product
  app.get("/api/vendor/master-products/:id", async (req, res) => {
    try {
      const product = await storage.getMasterProduct(req.params.id);
      if (!product || product.status !== 'published') {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch master product" });
    }
  });
  
  // Vendor: Adopt master product
  const adoptProductSchema = z.object({
    vendorId: z.string().min(1),
    masterProductId: z.string().min(1),
    customizations: z.object({
      price: z.number().optional(),
      stock: z.number().optional(),
      description: z.string().optional(),
      specifications: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      imageKeys: z.array(z.string()).optional(),
      isActive: z.boolean().optional(),
    }).optional(),
  });
  
  app.post("/api/vendor/master-products/adopt", async (req, res) => {
    try {
      const validated = adoptProductSchema.parse(req.body);
      const adoptedProduct = await storage.adoptMasterProduct(
        validated.vendorId,
        validated.masterProductId,
        validated.customizations
      );
      res.status(201).json(adoptedProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to adopt product" });
    }
  });
  
  // Object storage: Download image - not needed for data URL approach
  app.get("/objects/:objectKey(*)", async (req, res) => {
    res.status(501).json({ error: "Object storage not configured" });
  });

  // Seed greeting templates (for initial setup)
  app.post("/api/greeting-templates/seed", async (req, res) => {
    try {
      console.log('🌱 Seeding greeting templates...');
      
      const sampleTemplates = [
        {
          title: "Diwali Festival Offer",
          description: "Festive greeting template for Diwali with discount offer",
          imageUrl: "https://placehold.co/800x600/orange/white?text=Diwali+Offer",
          thumbnailUrl: "https://placehold.co/200x150/orange/white?text=Diwali",
          occasions: ["diwali", "festival"],
          offerTypes: ["flat_discount"],
          industries: ["retail", "salon", "fitness"],
          hasEditableText: true,
          editableTextAreas: [],
          supportsLogo: true,
          logoPosition: {},
          supportsProducts: true,
          supportsServices: true,
          supportsOffers: true,
          includesPlatformBranding: true,
          eventDate: new Date("2025-11-01"),
          expiryDate: null,
          isTrending: true,
          downloadCount: 0,
          shareCount: 0,
          status: "published",
          uploadedBy: null,
        },
        {
          title: "New Year Sale Banner",
          description: "New year promotional template",
          imageUrl: "https://placehold.co/800x600/purple/white?text=New+Year+Sale",
          thumbnailUrl: "https://placehold.co/200x150/purple/white?text=New+Year",
          occasions: ["new_year"],
          offerTypes: ["flash_sale", "flat_discount"],
          industries: ["retail", "electronics", "grocery"],
          hasEditableText: true,
          editableTextAreas: [],
          supportsLogo: true,
          logoPosition: {},
          supportsProducts: true,
          supportsServices: false,
          supportsOffers: true,
          includesPlatformBranding: true,
          eventDate: new Date("2026-01-01"),
          expiryDate: null,
          isTrending: true,
          downloadCount: 0,
          shareCount: 0,
          status: "published",
          uploadedBy: null,
        },
        {
          title: "Independence Day Special",
          description: "Patriotic template for Independence Day celebrations",
          imageUrl: "https://placehold.co/800x600/orange/white?text=Independence+Day",
          thumbnailUrl: "https://placehold.co/200x150/orange/white?text=India",
          occasions: ["independence_day"],
          offerTypes: ["flat_discount", "flash_sale"],
          industries: ["retail", "fitness", "restaurant"],
          hasEditableText: true,
          editableTextAreas: [],
          supportsLogo: true,
          logoPosition: {},
          supportsProducts: true,
          supportsServices: true,
          supportsOffers: true,
          includesPlatformBranding: true,
          eventDate: new Date("2025-08-15"),
          expiryDate: null,
          isTrending: false,
          downloadCount: 0,
          shareCount: 0,
          status: "published",
          uploadedBy: null,
        },
      ];

      const createdTemplates = [];
      for (const template of sampleTemplates) {
        const created = await storage.createGreetingTemplate(template);
        createdTemplates.push(created);
      }

      console.log(`✅ Seeded ${createdTemplates.length} greeting templates`);
      res.json({ 
        message: `Successfully seeded ${createdTemplates.length} greeting templates`,
        templates: createdTemplates 
      });
    } catch (error) {
      console.error("Seed error:", error);
      res.status(500).json({ 
        error: "Failed to seed templates",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // ====================
  // ADDITIONAL SERVICES
  // ====================

  // Get all active additional services (for vendors)
  app.get("/api/additional-services", async (req, res) => {
    try {
      const services = await storage.getAllAdditionalServices?.(true) || [];
      res.json(services);
    } catch (error) {
      console.error("Error fetching additional services:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  // Get single additional service by ID
  app.get("/api/additional-services/:id", async (req, res) => {
    try {
      const service = await storage.getAdditionalServiceById?.(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      console.error("Error fetching additional service:", error);
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  // Get all additional services (admin)
  app.get("/api/admin/additional-services", async (req, res) => {
    try {
      const services = await storage.getAllAdditionalServices?.(false) || [];
      res.json(services);
    } catch (error) {
      console.error("Error fetching additional services:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  // Create additional service (admin)
  app.post("/api/admin/additional-services", async (req, res) => {
    try {
      const { insertAdditionalServiceSchema } = await import("@shared/schema");
      const validatedData = insertAdditionalServiceSchema.parse(req.body);
      const service = await storage.createAdditionalService?.(validatedData);
      if (!service) {
        return res.status(500).json({ error: "Failed to create service" });
      }
      res.status(201).json(service);
    } catch (error: any) {
      console.error("Error creating additional service:", error);
      res.status(400).json({ error: error.message || "Invalid service data" });
    }
  });

  // Update additional service (admin)
  app.put("/api/admin/additional-services/:id", async (req, res) => {
    try {
      const service = await storage.updateAdditionalService?.(req.params.id, req.body);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error: any) {
      console.error("Error updating additional service:", error);
      res.status(400).json({ error: error.message || "Failed to update service" });
    }
  });

  // Delete additional service (admin)
  app.delete("/api/admin/additional-services/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAdditionalService?.(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting additional service:", error);
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  // Get all inquiries (admin)
  app.get("/api/admin/additional-service-inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getAllAdditionalServiceInquiries?.() || [];
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({ error: "Failed to fetch inquiries" });
    }
  });

  // Submit inquiry (vendor)
  app.post("/api/additional-service-inquiries", async (req, res) => {
    try {
      const { insertAdditionalServiceInquirySchema } = await import("@shared/schema");
      const validatedData = insertAdditionalServiceInquirySchema.parse(req.body);
      const inquiry = await storage.createAdditionalServiceInquiry?.(validatedData);
      if (!inquiry) {
        return res.status(500).json({ error: "Failed to create inquiry" });
      }
      res.status(201).json(inquiry);
    } catch (error: any) {
      console.error("Error creating inquiry:", error);
      res.status(400).json({ error: error.message || "Invalid inquiry data" });
    }
  });

  // Get vendor's own inquiries
  app.get("/api/vendors/:vendorId/additional-service-inquiries", async (req, res) => {
    try {
      const { vendorId } = req.params;
      const inquiries = await storage.getVendorAdditionalServiceInquiries?.(vendorId) || [];
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching vendor inquiries:", error);
      res.status(500).json({ error: "Failed to fetch inquiries" });
    }
  });

  // Update inquiry status (admin)
  app.patch("/api/admin/additional-service-inquiries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;
      
      const updateData: any = { updatedAt: new Date() };
      if (status) {
        updateData.status = status;
        if (status === "contacted") {
          updateData.contactedAt = new Date();
        }
        if (status === "completed") {
          updateData.completedAt = new Date();
        }
      }
      if (adminNotes !== undefined) {
        updateData.adminNotes = adminNotes;
      }

      const inquiry = await storage.updateAdditionalServiceInquiry?.(id, updateData);
      if (!inquiry) {
        return res.status(404).json({ error: "Inquiry not found" });
      }
      res.json(inquiry);
    } catch (error) {
      console.error("Error updating inquiry:", error);
      res.status(500).json({ error: "Failed to update inquiry" });
    }
  });

  // ====================
  // AUTHENTICATION ROUTES
  // ====================

  // JWT-based authentication - handlers are in auth.ts
  app.post("/api/auth/signup", signUp);
  app.post("/api/auth/signin", signIn);
  app.post("/api/auth/login", signIn); // Alias for signin
  app.post("/api/auth/signout", signOut);
  app.post("/api/auth/logout", signOut); // Alias for signout

  // Import authenticateToken middleware and password reset handlers
  const { authenticateToken, requestPasswordReset, verifyResetOTP, resetPassword } = await import('./auth');
  
  // Get current user endpoint (protected)
  app.get("/api/auth/me", authenticateToken, getCurrentUser);

  // Password reset endpoints
  app.post("/api/auth/forgot-password", requestPasswordReset);
  app.post("/api/auth/verify-otp", verifyResetOTP);
  app.post("/api/auth/reset-password", resetPassword);

  // ====================
  // PROMO BANNERS MODULE (Admin managed)
  // ====================

  // Get all active promo banners (for vendor dashboard)
  app.get("/api/promo-banners", async (req, res) => {
    try {
      const { status } = req.query;
      const banners = await storage.getPromoBanners(status as string);
      res.json(banners);
    } catch (error) {
      console.error("Error fetching promo banners:", error);
      res.status(500).json({ error: "Failed to fetch promo banners" });
    }
  });

  // Get single promo banner
  app.get("/api/promo-banners/:id", async (req, res) => {
    try {
      const banner = await storage.getPromoBanner(req.params.id);
      if (!banner) {
        return res.status(404).json({ error: "Banner not found" });
      }
      res.json(banner);
    } catch (error) {
      console.error("Error fetching promo banner:", error);
      res.status(500).json({ error: "Failed to fetch promo banner" });
    }
  });

  // Create promo banner (admin only)
  app.post("/api/promo-banners", async (req, res) => {
    try {
      console.log('[PromoBanners] Creating banner with data:', req.body);
      const banner = await storage.createPromoBanner(req.body);
      console.log('[PromoBanners] Banner created:', banner.id);
      res.status(201).json(banner);
    } catch (error: any) {
      console.error("Error creating promo banner:", error);
      res.status(400).json({ error: error.message || "Failed to create promo banner" });
    }
  });

  // Update promo banner (admin only)
  app.put("/api/promo-banners/:id", async (req, res) => {
    try {
      const banner = await storage.updatePromoBanner(req.params.id, req.body);
      res.json(banner);
    } catch (error: any) {
      console.error("Error updating promo banner:", error);
      res.status(400).json({ error: error.message || "Failed to update promo banner" });
    }
  });

  // Delete promo banner (admin only)
  app.delete("/api/promo-banners/:id", async (req, res) => {
    try {
      await storage.deletePromoBanner(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting promo banner:", error);
      res.status(500).json({ error: "Failed to delete promo banner" });
    }
  });

  // ====================
  // REFERRAL PROGRAM MODULE
  // ====================

  // Get vendor's referral stats
  app.get("/api/vendors/:vendorId/referral-stats", async (req, res) => {
    try {
      const { vendorId } = req.params;
      
      // Try to get existing stats or create default ones
      let stats = await storage.getReferralStats(vendorId);
      
      if (!stats) {
        // Generate referral code from vendor ID
        const referralCode = vendorId.slice(0, 8).toLowerCase();
        stats = {
          vendorId,
          referralCode,
          totalReferrals: 0,
          successfulReferrals: 0,
          pendingReferrals: 0,
          totalEarnings: "0",
          pendingEarnings: "0",
        };
      }
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching referral stats:", error);
      res.status(500).json({ error: "Failed to fetch referral stats" });
    }
  });

  // Get vendor's referral history
  app.get("/api/vendors/:vendorId/referrals", async (req, res) => {
    try {
      const { vendorId } = req.params;
      const referrals = await storage.getReferrals(vendorId);
      res.json(referrals || []);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      res.status(500).json({ error: "Failed to fetch referrals" });
    }
  });

  // Create a new referral (when sharing)
  app.post("/api/vendors/:vendorId/referrals", async (req, res) => {
    try {
      const { vendorId } = req.params;
      const { referredEmail, referredPhone } = req.body;
      
      const referralCode = vendorId.slice(0, 8).toLowerCase();
      
      const referral = await storage.createReferral({
        referrerId: vendorId,
        referralCode,
        referredEmail,
        referredPhone,
        status: "pending",
        rewardAmount: "200",
      });
      
      res.status(201).json(referral);
    } catch (error: any) {
      console.error("Error creating referral:", error);
      res.status(400).json({ error: error.message || "Failed to create referral" });
    }
  });

  // Update referral status (for admin or when referred user subscribes)
  app.put("/api/referrals/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const referral = await storage.updateReferralStatus(id, status);
      res.json(referral);
    } catch (error: any) {
      console.error("Error updating referral status:", error);
      res.status(400).json({ error: error.message || "Failed to update referral" });
    }
  });

  // Get vendor's withdrawal history
  app.get("/api/vendors/:vendorId/withdrawals", async (req, res) => {
    try {
      const { vendorId } = req.params;
      const withdrawals = await storage.getWithdrawals(vendorId);
      res.json(withdrawals || []);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      res.status(500).json({ error: "Failed to fetch withdrawals" });
    }
  });

  // Request a withdrawal
  app.post("/api/vendors/:vendorId/withdrawals", async (req, res) => {
    try {
      const { vendorId } = req.params;
      const { amount, withdrawMethod, upiId, bankName, accountNumber, ifscCode, accountHolderName } = req.body;
      
      // Minimum withdrawal amount check
      const minAmount = 400;
      if (Number(amount) < minAmount) {
        return res.status(400).json({ error: `Minimum withdrawal amount is ₹${minAmount}` });
      }
      
      // Check available balance
      const stats = await storage.getReferralStats(vendorId);
      const availableBalance = stats ? Number(stats.totalEarnings) : 0;
      
      if (Number(amount) > availableBalance) {
        return res.status(400).json({ error: "Insufficient balance" });
      }
      
      const withdrawal = await storage.createWithdrawal({
        vendorId,
        amount,
        withdrawMethod,
        upiId,
        bankName,
        accountNumber,
        ifscCode,
        accountHolderName,
        status: "pending",
      });
      
      res.status(201).json(withdrawal);
    } catch (error: any) {
      console.error("Error creating withdrawal:", error);
      res.status(400).json({ error: error.message || "Failed to create withdrawal" });
    }
  });

  // Update withdrawal status (admin only)
  app.put("/api/withdrawals/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, transactionId, failureReason } = req.body;
      
      const withdrawal = await storage.updateWithdrawalStatus(id, status, transactionId, failureReason);
      res.json(withdrawal);
    } catch (error: any) {
      console.error("Error updating withdrawal status:", error);
      res.status(400).json({ error: error.message || "Failed to update withdrawal" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
