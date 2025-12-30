import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import type { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VYORA API Documentation',
      version: '1.0.0',
      description: `
## VYORA Multi-Vendor SaaS Platform API

A comprehensive API for managing vendors, products, services, orders, customers, and more.

### Authentication
Most endpoints require authentication via JWT token. Include the token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

### Base URL
- Development: \`http://localhost:5000/api\`
- Production: \`https://your-domain.com/api\`

### Rate Limiting
API requests are rate-limited to ensure fair usage. Default limits apply per vendor.
      `,
      contact: {
        name: 'VYORA Support',
        email: 'support@vyora.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'API Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
            code: {
              type: 'string',
              description: 'Error code',
            },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Unique identifier' },
            name: { type: 'string', description: 'Category name' },
            description: { type: 'string', description: 'Category description' },
            imageUrl: { type: 'string', description: 'Category image URL' },
            creatorId: { type: 'string', description: 'Creator ID (vendor or admin)' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Subcategory: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Unique identifier' },
            name: { type: 'string', description: 'Subcategory name' },
            categoryId: { type: 'integer', description: 'Parent category ID' },
            description: { type: 'string', description: 'Subcategory description' },
            creatorId: { type: 'string', description: 'Creator ID' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Brand: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Unique identifier' },
            name: { type: 'string', description: 'Brand name' },
            categoryId: { type: 'integer', description: 'Associated category ID' },
            logoUrl: { type: 'string', description: 'Brand logo URL' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Unit: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Unique identifier' },
            name: { type: 'string', description: 'Unit name (e.g., kg, pieces)' },
            abbreviation: { type: 'string', description: 'Unit abbreviation' },
            subcategoryId: { type: 'integer', description: 'Associated subcategory ID' },
            creatorId: { type: 'string', description: 'Creator ID' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Vendor: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Unique identifier' },
            userId: { type: 'integer', description: 'Associated user ID' },
            businessName: { type: 'string', description: 'Business name' },
            businessType: { type: 'string', description: 'Type of business' },
            industry: { type: 'string', description: 'Industry category' },
            email: { type: 'string', format: 'email', description: 'Business email' },
            phone: { type: 'string', description: 'Business phone' },
            address: { type: 'string', description: 'Business address' },
            city: { type: 'string', description: 'City' },
            state: { type: 'string', description: 'State' },
            country: { type: 'string', description: 'Country' },
            pincode: { type: 'string', description: 'PIN/ZIP code' },
            gstNumber: { type: 'string', description: 'GST number' },
            website: { type: 'string', description: 'Website URL' },
            status: { type: 'string', enum: ['pending', 'active', 'suspended', 'rejected'], description: 'Vendor status' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        VendorProduct: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Unique identifier' },
            vendorId: { type: 'integer', description: 'Vendor ID' },
            masterProductId: { type: 'integer', description: 'Master product ID' },
            name: { type: 'string', description: 'Product name' },
            description: { type: 'string', description: 'Product description' },
            sku: { type: 'string', description: 'Stock keeping unit' },
            price: { type: 'string', description: 'Product price' },
            mrp: { type: 'string', description: 'Maximum retail price' },
            costPrice: { type: 'string', description: 'Cost price' },
            stockQuantity: { type: 'integer', description: 'Available stock' },
            lowStockThreshold: { type: 'integer', description: 'Low stock alert threshold' },
            status: { type: 'string', enum: ['active', 'inactive', 'out_of_stock'], description: 'Product status' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Customer: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Unique identifier' },
            vendorId: { type: 'integer', description: 'Vendor ID' },
            name: { type: 'string', description: 'Customer name' },
            email: { type: 'string', format: 'email', description: 'Customer email' },
            phone: { type: 'string', description: 'Customer phone' },
            address: { type: 'string', description: 'Customer address' },
            city: { type: 'string', description: 'City' },
            state: { type: 'string', description: 'State' },
            notes: { type: 'string', description: 'Additional notes' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Unique identifier' },
            vendorId: { type: 'integer', description: 'Vendor ID' },
            customerId: { type: 'integer', description: 'Customer ID' },
            orderNumber: { type: 'string', description: 'Order reference number' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], description: 'Order status' },
            subtotal: { type: 'string', description: 'Subtotal amount' },
            discount: { type: 'string', description: 'Discount amount' },
            tax: { type: 'string', description: 'Tax amount' },
            total: { type: 'string', description: 'Total amount' },
            paymentMethod: { type: 'string', description: 'Payment method' },
            paymentStatus: { type: 'string', enum: ['pending', 'paid', 'failed', 'refunded'], description: 'Payment status' },
            notes: { type: 'string', description: 'Order notes' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        OrderItem: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Unique identifier' },
            orderId: { type: 'integer', description: 'Order ID' },
            productId: { type: 'integer', description: 'Product ID' },
            productName: { type: 'string', description: 'Product name' },
            quantity: { type: 'integer', description: 'Quantity ordered' },
            unitPrice: { type: 'string', description: 'Unit price' },
            discount: { type: 'string', description: 'Discount on item' },
            total: { type: 'string', description: 'Item total' },
          },
        },
        Lead: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Unique identifier' },
            vendorId: { type: 'integer', description: 'Vendor ID' },
            name: { type: 'string', description: 'Lead name' },
            email: { type: 'string', format: 'email', description: 'Lead email' },
            phone: { type: 'string', description: 'Lead phone' },
            source: { type: 'string', description: 'Lead source' },
            status: { type: 'string', enum: ['new', 'contacted', 'qualified', 'converted', 'lost'], description: 'Lead status' },
            notes: { type: 'string', description: 'Lead notes' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Employee: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Unique identifier' },
            vendorId: { type: 'integer', description: 'Vendor ID' },
            name: { type: 'string', description: 'Employee name' },
            email: { type: 'string', format: 'email', description: 'Employee email' },
            phone: { type: 'string', description: 'Employee phone' },
            role: { type: 'string', description: 'Employee role' },
            department: { type: 'string', description: 'Department' },
            salary: { type: 'string', description: 'Salary' },
            status: { type: 'string', enum: ['active', 'inactive', 'on_leave'], description: 'Employee status' },
            joiningDate: { type: 'string', format: 'date', description: 'Joining date' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Unique identifier' },
            vendorId: { type: 'integer', description: 'Vendor ID' },
            customerId: { type: 'integer', description: 'Customer ID' },
            serviceId: { type: 'integer', description: 'Service ID' },
            bookingDate: { type: 'string', format: 'date-time', description: 'Booking date and time' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'], description: 'Booking status' },
            notes: { type: 'string', description: 'Booking notes' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Appointment: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Unique identifier' },
            vendorId: { type: 'integer', description: 'Vendor ID' },
            customerId: { type: 'integer', description: 'Customer ID' },
            title: { type: 'string', description: 'Appointment title' },
            startTime: { type: 'string', format: 'date-time', description: 'Start time' },
            endTime: { type: 'string', format: 'date-time', description: 'End time' },
            status: { type: 'string', enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'], description: 'Appointment status' },
            notes: { type: 'string', description: 'Appointment notes' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Coupon: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Unique identifier' },
            vendorId: { type: 'integer', description: 'Vendor ID' },
            code: { type: 'string', description: 'Coupon code' },
            discountType: { type: 'string', enum: ['percentage', 'fixed'], description: 'Discount type' },
            discountValue: { type: 'string', description: 'Discount value' },
            minOrderValue: { type: 'string', description: 'Minimum order value' },
            maxDiscount: { type: 'string', description: 'Maximum discount amount' },
            usageLimit: { type: 'integer', description: 'Usage limit' },
            usedCount: { type: 'integer', description: 'Times used' },
            validFrom: { type: 'string', format: 'date-time', description: 'Valid from date' },
            validUntil: { type: 'string', format: 'date-time', description: 'Valid until date' },
            isActive: { type: 'boolean', description: 'Is coupon active' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Supplier: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Unique identifier' },
            vendorId: { type: 'integer', description: 'Vendor ID' },
            name: { type: 'string', description: 'Supplier name' },
            email: { type: 'string', format: 'email', description: 'Supplier email' },
            phone: { type: 'string', description: 'Supplier phone' },
            company: { type: 'string', description: 'Company name' },
            address: { type: 'string', description: 'Supplier address' },
            gstNumber: { type: 'string', description: 'GST number' },
            paymentTerms: { type: 'string', description: 'Payment terms' },
            status: { type: 'string', enum: ['active', 'inactive'], description: 'Supplier status' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Expense: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Unique identifier' },
            vendorId: { type: 'integer', description: 'Vendor ID' },
            categoryId: { type: 'integer', description: 'Expense category ID' },
            amount: { type: 'string', description: 'Expense amount' },
            description: { type: 'string', description: 'Expense description' },
            date: { type: 'string', format: 'date', description: 'Expense date' },
            paymentMethod: { type: 'string', description: 'Payment method' },
            receiptUrl: { type: 'string', description: 'Receipt image URL' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Quotation: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Unique identifier' },
            vendorId: { type: 'integer', description: 'Vendor ID' },
            customerId: { type: 'integer', description: 'Customer ID' },
            quotationNumber: { type: 'string', description: 'Quotation reference number' },
            status: { type: 'string', enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'], description: 'Quotation status' },
            subtotal: { type: 'string', description: 'Subtotal amount' },
            discount: { type: 'string', description: 'Discount amount' },
            tax: { type: 'string', description: 'Tax amount' },
            total: { type: 'string', description: 'Total amount' },
            validUntil: { type: 'string', format: 'date', description: 'Valid until date' },
            notes: { type: 'string', description: 'Quotation notes' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        SubscriptionPlan: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Unique identifier' },
            name: { type: 'string', description: 'Plan name' },
            displayName: { type: 'string', description: 'Display name' },
            description: { type: 'string', description: 'Plan description' },
            price: { type: 'string', description: 'Plan price' },
            currency: { type: 'string', description: 'Currency code' },
            billingInterval: { type: 'string', enum: ['month', 'year'], description: 'Billing interval' },
            maxProducts: { type: 'integer', description: 'Max products limit' },
            maxCustomers: { type: 'integer', description: 'Max customers limit' },
            maxOrders: { type: 'integer', description: 'Max orders limit' },
            isActive: { type: 'boolean', description: 'Is plan active' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer', description: 'Current page number' },
            limit: { type: 'integer', description: 'Items per page' },
            total: { type: 'integer', description: 'Total items' },
            totalPages: { type: 'integer', description: 'Total pages' },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                message: 'Authentication required',
              },
            },
          },
        },
        ForbiddenError: {
          description: 'Access denied',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                message: 'Access denied. Pro subscription required.',
              },
            },
          },
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                message: 'Resource not found',
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                message: 'Validation failed',
                errors: [],
              },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Categories', description: 'Category management' },
      { name: 'Subcategories', description: 'Subcategory management' },
      { name: 'Brands', description: 'Brand management' },
      { name: 'Units', description: 'Unit of measurement management' },
      { name: 'Vendors', description: 'Vendor management' },
      { name: 'Products', description: 'Product management' },
      { name: 'Services', description: 'Service management' },
      { name: 'Customers', description: 'Customer management' },
      { name: 'Orders', description: 'Order management' },
      { name: 'Leads', description: 'Lead management' },
      { name: 'Employees', description: 'Employee management' },
      { name: 'Bookings', description: 'Booking management' },
      { name: 'Appointments', description: 'Appointment management' },
      { name: 'Coupons', description: 'Coupon management' },
      { name: 'Suppliers', description: 'Supplier management' },
      { name: 'Expenses', description: 'Expense management' },
      { name: 'Quotations', description: 'Quotation management' },
      { name: 'Inventory', description: 'Stock and inventory management' },
      { name: 'Analytics', description: 'Analytics and reports' },
      { name: 'Subscriptions', description: 'Subscription plan management' },
      { name: 'Notifications', description: 'Notification management' },
      { name: 'Mini Website', description: 'Mini website builder' },
      { name: 'POS', description: 'Point of Sale endpoints' },
      { name: 'Admin', description: 'Admin-only endpoints' },
    ],
    paths: {
      '/test': {
        get: {
          tags: ['Health'],
          summary: 'API Health Check',
          description: 'Test endpoint to verify the API is working',
          responses: {
            200: {
              description: 'API is working',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      timestamp: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/auth/signup': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          description: 'Create a new user account with email and password',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password', 'firstName', 'lastName'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'User created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: { type: 'object' },
                      token: { type: 'string' },
                    },
                  },
                },
              },
            },
            400: { $ref: '#/components/responses/ValidationError' },
          },
        },
      },
      '/auth/signin': {
        post: {
          tags: ['Auth'],
          summary: 'Sign in user',
          description: 'Authenticate user with email and password',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: { type: 'object' },
                      token: { type: 'string' },
                    },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/UnauthorizedError' },
          },
        },
      },
      '/auth/signout': {
        post: {
          tags: ['Auth'],
          summary: 'Sign out user',
          description: 'Invalidate the current session',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Logout successful',
            },
          },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user',
          description: 'Get the currently authenticated user details',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'User details',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: { type: 'object' },
                    },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/UnauthorizedError' },
          },
        },
      },
      '/categories': {
        get: {
          tags: ['Categories'],
          summary: 'Get all categories',
          description: 'Retrieve a list of all categories',
          responses: {
            200: {
              description: 'List of categories',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Category' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Categories'],
          summary: 'Create a category',
          description: 'Create a new category',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    imageUrl: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Category created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Category' },
                },
              },
            },
            400: { $ref: '#/components/responses/ValidationError' },
            401: { $ref: '#/components/responses/UnauthorizedError' },
          },
        },
      },
      '/categories/{id}': {
        patch: {
          tags: ['Categories'],
          summary: 'Update a category',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    imageUrl: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Category updated',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Category' },
                },
              },
            },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        delete: {
          tags: ['Categories'],
          summary: 'Delete a category',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            204: { description: 'Category deleted' },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
      },
      '/vendors': {
        get: {
          tags: ['Vendors'],
          summary: 'Get all vendors',
          description: 'Retrieve a list of all vendors (admin only)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'List of vendors',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Vendor' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Vendors'],
          summary: 'Create a vendor',
          description: 'Register as a new vendor',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['businessName', 'industry'],
                  properties: {
                    businessName: { type: 'string' },
                    businessType: { type: 'string' },
                    industry: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    phone: { type: 'string' },
                    address: { type: 'string' },
                    city: { type: 'string' },
                    state: { type: 'string' },
                    country: { type: 'string' },
                    pincode: { type: 'string' },
                    gstNumber: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Vendor created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Vendor' },
                },
              },
            },
          },
        },
      },
      '/vendors/{id}': {
        get: {
          tags: ['Vendors'],
          summary: 'Get vendor by ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'Vendor details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Vendor' },
                },
              },
            },
            404: { $ref: '#/components/responses/NotFoundError' },
          },
        },
        patch: {
          tags: ['Vendors'],
          summary: 'Update vendor',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Vendor' },
              },
            },
          },
          responses: {
            200: {
              description: 'Vendor updated',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Vendor' },
                },
              },
            },
          },
        },
      },
      '/vendors/{vendorId}/products': {
        get: {
          tags: ['Products'],
          summary: 'Get vendor products',
          parameters: [
            {
              name: 'vendorId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'List of vendor products',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/VendorProduct' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Products'],
          summary: 'Add vendor product',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'vendorId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/VendorProduct' },
              },
            },
          },
          responses: {
            201: {
              description: 'Product created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/VendorProduct' },
                },
              },
            },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      '/vendors/{vendorId}/customers': {
        get: {
          tags: ['Customers'],
          summary: 'Get vendor customers',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'vendorId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'List of customers',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Customer' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Customers'],
          summary: 'Add customer',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'vendorId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Customer' },
              },
            },
          },
          responses: {
            201: {
              description: 'Customer created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Customer' },
                },
              },
            },
          },
        },
      },
      '/vendors/{vendorId}/orders': {
        get: {
          tags: ['Orders'],
          summary: 'Get vendor orders',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'vendorId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
            {
              name: 'status',
              in: 'query',
              schema: { type: 'string' },
            },
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 20 },
            },
          ],
          responses: {
            200: {
              description: 'List of orders',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      orders: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Order' },
                      },
                      pagination: { $ref: '#/components/schemas/Pagination' },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Orders'],
          summary: 'Create order',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'vendorId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['customerId', 'items'],
                  properties: {
                    customerId: { type: 'integer' },
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          productId: { type: 'integer' },
                          quantity: { type: 'integer' },
                          unitPrice: { type: 'string' },
                        },
                      },
                    },
                    discount: { type: 'string' },
                    notes: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Order created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Order' },
                },
              },
            },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      '/vendors/{vendorId}/leads': {
        get: {
          tags: ['Leads'],
          summary: 'Get vendor leads',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'vendorId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'List of leads',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Lead' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Leads'],
          summary: 'Create lead',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'vendorId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Lead' },
              },
            },
          },
          responses: {
            201: {
              description: 'Lead created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Lead' },
                },
              },
            },
          },
        },
      },
      '/vendors/{vendorId}/employees': {
        get: {
          tags: ['Employees'],
          summary: 'Get vendor employees',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'vendorId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'List of employees',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Employee' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Employees'],
          summary: 'Add employee',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'vendorId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Employee' },
              },
            },
          },
          responses: {
            201: {
              description: 'Employee created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Employee' },
                },
              },
            },
          },
        },
      },
      '/vendors/{vendorId}/bookings': {
        get: {
          tags: ['Bookings'],
          summary: 'Get vendor bookings',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'vendorId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'List of bookings',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Booking' },
                  },
                },
              },
            },
          },
        },
      },
      '/vendors/{vendorId}/appointments': {
        get: {
          tags: ['Appointments'],
          summary: 'Get vendor appointments',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'vendorId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'List of appointments',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Appointment' },
                  },
                },
              },
            },
          },
        },
      },
      '/vendors/{vendorId}/coupons': {
        get: {
          tags: ['Coupons'],
          summary: 'Get vendor coupons',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'vendorId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'List of coupons',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Coupon' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Coupons'],
          summary: 'Create coupon',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'vendorId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Coupon' },
              },
            },
          },
          responses: {
            201: {
              description: 'Coupon created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Coupon' },
                },
              },
            },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      '/vendors/{vendorId}/suppliers': {
        get: {
          tags: ['Suppliers'],
          summary: 'Get vendor suppliers',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'vendorId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'List of suppliers',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Supplier' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Suppliers'],
          summary: 'Add supplier',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'vendorId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Supplier' },
              },
            },
          },
          responses: {
            201: {
              description: 'Supplier created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Supplier' },
                },
              },
            },
          },
        },
      },
      '/vendors/{vendorId}/expenses': {
        get: {
          tags: ['Expenses'],
          summary: 'Get vendor expenses',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'vendorId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'List of expenses',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Expense' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Expenses'],
          summary: 'Add expense',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'vendorId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Expense' },
              },
            },
          },
          responses: {
            201: {
              description: 'Expense created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Expense' },
                },
              },
            },
          },
        },
      },
      '/vendors/{vendorId}/quotations': {
        get: {
          tags: ['Quotations'],
          summary: 'Get vendor quotations',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'vendorId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'List of quotations',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Quotation' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Quotations'],
          summary: 'Create quotation',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'vendorId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Quotation' },
              },
            },
          },
          responses: {
            201: {
              description: 'Quotation created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Quotation' },
                },
              },
            },
          },
        },
      },
      '/vendors/{vendorId}/analytics': {
        get: {
          tags: ['Analytics'],
          summary: 'Get vendor analytics',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'vendorId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
            {
              name: 'period',
              in: 'query',
              schema: { type: 'string', enum: ['today', 'week', 'month', 'year'] },
            },
          ],
          responses: {
            200: {
              description: 'Analytics data',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      totalRevenue: { type: 'string' },
                      totalOrders: { type: 'integer' },
                      totalCustomers: { type: 'integer' },
                      averageOrderValue: { type: 'string' },
                      topProducts: { type: 'array', items: { type: 'object' } },
                      revenueByDay: { type: 'array', items: { type: 'object' } },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/subscription-plans': {
        get: {
          tags: ['Subscriptions'],
          summary: 'Get subscription plans',
          description: 'Retrieve all available subscription plans',
          responses: {
            200: {
              description: 'List of subscription plans',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/SubscriptionPlan' },
                  },
                },
              },
            },
          },
        },
      },
      '/vendors/{vendorId}/subscription': {
        get: {
          tags: ['Subscriptions'],
          summary: 'Get vendor subscription',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'vendorId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'Vendor subscription details',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      subscription: { type: 'object' },
                      plan: { $ref: '#/components/schemas/SubscriptionPlan' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/pos/sale': {
        post: {
          tags: ['POS'],
          summary: 'Create POS sale',
          description: 'Create a new point of sale transaction',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['vendorId', 'items'],
                  properties: {
                    vendorId: { type: 'integer' },
                    customerId: { type: 'integer' },
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          productId: { type: 'integer' },
                          quantity: { type: 'integer' },
                          price: { type: 'string' },
                        },
                      },
                    },
                    paymentMethod: { type: 'string' },
                    discount: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Sale created',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      sale: { type: 'object' },
                      receipt: { type: 'object' },
                    },
                  },
                },
              },
            },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      '/admin/vendors': {
        get: {
          tags: ['Admin'],
          summary: 'Get all vendors (Admin)',
          description: 'Admin endpoint to get all vendors with filters',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'status',
              in: 'query',
              schema: { type: 'string', enum: ['pending', 'active', 'suspended'] },
            },
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer' },
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'List of vendors',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      vendors: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Vendor' },
                      },
                      pagination: { $ref: '#/components/schemas/Pagination' },
                    },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/UnauthorizedError' },
            403: { $ref: '#/components/responses/ForbiddenError' },
          },
        },
      },
      '/admin/analytics': {
        get: {
          tags: ['Admin'],
          summary: 'Get platform analytics (Admin)',
          description: 'Admin endpoint to get platform-wide analytics',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Platform analytics',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      totalVendors: { type: 'integer' },
                      totalRevenue: { type: 'string' },
                      totalOrders: { type: 'integer' },
                      activeSubscriptions: { type: 'integer' },
                      vendorsByPlan: { type: 'object' },
                      revenueByMonth: { type: 'array', items: { type: 'object' } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [], // No JSDoc annotations needed, we define everything inline
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
  // Serve Swagger JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Serve Swagger UI
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info { margin: 30px 0 }
        .swagger-ui .info .title { color: #3b82f6 }
        .swagger-ui .scheme-container { background: #f8fafc; padding: 15px; border-radius: 8px }
      `,
      customSiteTitle: 'VYORA API Documentation',
      customfavIcon: '/favicon.ico',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        docExpansion: 'list',
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2,
      },
    })
  );

  console.log('[SWAGGER] API documentation available at /api-docs');
}

