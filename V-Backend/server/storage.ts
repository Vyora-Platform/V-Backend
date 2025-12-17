import { nanoid } from "nanoid";
import {
  type User,
  type InsertUser,
  type Vendor,
  type InsertVendor,
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
  type LeaveBalance,
  type InsertLeaveBalance,
  type Payroll,
  type InsertPayroll,
  type Holiday,
  type InsertHoliday,
  type Coupon,
  type InsertCoupon,
  type Transaction,
  type InsertTransaction,
  type Notification,
  type InsertNotification,
  type MasterProduct,
  type InsertMasterProduct,
  type VendorProduct,
  type InsertVendorProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Customer,
  type InsertCustomer,
  type CustomerVisit,
  type InsertCustomerVisit,
  type CouponUsage,
  type InsertCouponUsage,
  type CustomerTask,
  type InsertCustomerTask,
  type Supplier,
  type InsertSupplier,
  type SupplierPayment,
  type InsertSupplierPayment,
  type Expense,
  type InsertExpense,
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
  type InventoryLocation,
  type InsertInventoryLocation,
  type StockBatch,
  type InsertStockBatch,
  type StockMovement,
  type InsertStockMovement,
  type StockConfig,
  type InsertStockConfig,
  type StockAlert,
  type InsertStockAlert,
  type LedgerTransaction,
  type InsertLedgerTransaction,
  type GreetingTemplate,
  type InsertGreetingTemplate,
  type GreetingTemplateUsage,
  type InsertGreetingTemplateUsage,
  type Bill,
  type InsertBill,
  type BillItem,
  type InsertBillItem,
  type BillPayment,
  type InsertBillPayment,
  type AdminLeadsFilter,
  type AdminCustomersFilter,
  type AdminOrdersFilter,
  type SubscriptionPlan,
  type InsertSubscriptionPlan,
  type VendorSubscription,
  type InsertVendorSubscription,
  type BillingHistory,
  type InsertBillingHistory,
  type UsageLog,
  type InsertUsageLog,
  type AdditionalService,
  type InsertAdditionalService,
  type AdditionalServiceInquiry,
  type InsertAdditionalServiceInquiry,
  type DemoRequest,
  type InsertDemoRequest,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  getUsersByRole?(role: string): Promise<User[]>;

  // Vendors
  getVendor(id: string): Promise<Vendor | undefined>;
  getVendorByUserId(userId: string): Promise<Vendor | undefined>;
  getAllVendors(): Promise<Vendor[]>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendor(id: string, updates: Partial<InsertVendor>): Promise<Vendor | undefined>;
  
  // Categories
  getCategory(id: string): Promise<Category | undefined>;
  getAllCategories(): Promise<Category[]>;
  getCategoriesByCreator(creatorId: string): Promise<Category[]>; // Get vendor-specific + global
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, updates: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Subcategories
  getSubcategory(id: string): Promise<Subcategory | undefined>;
  getAllSubcategories(): Promise<Subcategory[]>;
  getSubcategoriesByCategory(categoryId: string): Promise<Subcategory[]>;
  getSubcategoriesByCreator(creatorId: string, categoryId?: string): Promise<Subcategory[]>;
  createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory>;
  updateSubcategory(id: string, updates: Partial<InsertSubcategory>): Promise<Subcategory | undefined>;
  deleteSubcategory(id: string): Promise<boolean>;

  // Brands
  getBrand(id: string): Promise<Brand | undefined>;
  getAllBrands(): Promise<Brand[]>;
  getBrandsByCategory(categoryId: string): Promise<Brand[]>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: string, updates: Partial<InsertBrand>): Promise<Brand | undefined>;
  deleteBrand(id: string): Promise<boolean>;

  // Units
  getUnit(id: string): Promise<Unit | undefined>;
  getAllUnits(): Promise<Unit[]>;
  getUnitsBySubcategory(subcategoryId: string): Promise<Unit[]>;
  getUnitsByCreator(creatorId: string, subcategoryId?: string): Promise<Unit[]>;
  createUnit(unit: InsertUnit): Promise<Unit>;
  updateUnit(id: string, updates: Partial<InsertUnit>): Promise<Unit | undefined>;
  deleteUnit(id: string): Promise<boolean>;
  
  // Master Services
  getMasterService(id: string): Promise<MasterService | undefined>;
  getAllMasterServices(isUniversal?: boolean): Promise<MasterService[]>;
  getAllCatalogue(filters: Partial<any>): Promise<{ services: MasterService[]; total: number }>;
  searchMasterServices(query: string): Promise<MasterService[]>;
  createMasterService(service: InsertMasterService): Promise<MasterService>;
  updateMasterService(id: string, updates: Partial<InsertMasterService>): Promise<MasterService | undefined>;
  deleteMasterService(id: string): Promise<boolean>;
  duplicateMasterService(id: string): Promise<MasterService | undefined>;

  // Vendor Catalogues
  getVendorCatalogue(id: string): Promise<VendorCatalogue | undefined>;
  getVendorCataloguesByVendor(vendorId: string): Promise<VendorCatalogue[]>;
  createVendorCatalogue(catalogue: InsertVendorCatalogue): Promise<VendorCatalogue>;
  updateVendorCatalogue(id: string, updates: Partial<InsertVendorCatalogue>): Promise<VendorCatalogue | undefined>;
  deleteVendorCatalogue(id: string): Promise<boolean>;
  duplicateVendorCatalogue(id: string): Promise<VendorCatalogue | undefined>;

  // Custom Service Requests
  getCustomServiceRequest(id: string): Promise<CustomServiceRequest | undefined>;
  getCustomServiceRequestsByVendor(vendorId: string): Promise<CustomServiceRequest[]>;
  getAllCustomServiceRequests(status?: string): Promise<CustomServiceRequest[]>;
  createCustomServiceRequest(request: InsertCustomServiceRequest): Promise<CustomServiceRequest>;
  updateCustomServiceRequest(id: string, updates: Partial<InsertCustomServiceRequest>): Promise<CustomServiceRequest | undefined>;

  // Bookings (service bookings)
  getBooking(id: string): Promise<Booking | undefined>;
  getBookingsByVendor(vendorId: string): Promise<Booking[]>;
  getAllBookings(): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: string, updates: Partial<InsertBooking>): Promise<Booking | undefined>;

  // Appointments (physical visit appointments)
  getAppointment(id: string): Promise<Appointment | undefined>;
  getAppointmentsByVendor(vendorId: string): Promise<Appointment[]>;
  getAllAppointments(): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, updates: Partial<InsertAppointment>): Promise<Appointment | undefined>;

  // Employees
  getEmployee(id: string): Promise<Employee | undefined>;
  getEmployeesByVendor(vendorId: string): Promise<Employee[]>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, updates: Partial<InsertEmployee>): Promise<Employee | undefined>;
  deleteEmployee(id: string): Promise<boolean>;

  // Tasks
  getTask(id: string): Promise<Task | undefined>;
  getTasksByVendor(vendorId: string): Promise<Task[]>;
  getTasksByEmployee(employeeId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;

  // Attendance
  getAttendance(id: string): Promise<Attendance | undefined>;
  getAttendanceByVendor(vendorId: string): Promise<Attendance[]>;
  getAttendanceByEmployee(employeeId: string): Promise<Attendance[]>;
  getAttendanceByDateRange(employeeId: string, startDate: Date, endDate: Date): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: string, updates: Partial<InsertAttendance>): Promise<Attendance | undefined>;
  deleteAttendance(id: string): Promise<boolean>;

  // Leaves
  getLeave(id: string): Promise<Leave | undefined>;
  getLeavesByVendor(vendorId: string): Promise<Leave[]>;
  getLeavesByEmployee(employeeId: string): Promise<Leave[]>;
  createLeave(leave: InsertLeave): Promise<Leave>;
  updateLeave(id: string, updates: Partial<InsertLeave>): Promise<Leave | undefined>;
  deleteLeave(id: string): Promise<boolean>;

  // Leave Balances
  getLeaveBalance(id: string): Promise<LeaveBalance | undefined>;
  getLeaveBalancesByEmployee(employeeId: string): Promise<LeaveBalance[]>;
  createLeaveBalance(balance: InsertLeaveBalance): Promise<LeaveBalance>;
  updateLeaveBalance(id: string, updates: Partial<InsertLeaveBalance>): Promise<LeaveBalance | undefined>;

  // Payroll
  getPayroll(id: string): Promise<Payroll | undefined>;
  getPayrollByVendor(vendorId: string): Promise<Payroll[]>;
  getPayrollByEmployee(employeeId: string): Promise<Payroll[]>;
  createPayroll(payroll: InsertPayroll): Promise<Payroll>;
  updatePayroll(id: string, updates: Partial<InsertPayroll>): Promise<Payroll | undefined>;
  deletePayroll(id: string): Promise<boolean>;

  // Holidays
  getHoliday(id: string): Promise<Holiday | undefined>;
  getHolidaysByVendor(vendorId: string): Promise<Holiday[]>;
  createHoliday(holiday: InsertHoliday): Promise<Holiday>;
  updateHoliday(id: string, updates: Partial<InsertHoliday>): Promise<Holiday | undefined>;
  deleteHoliday(id: string): Promise<boolean>;

  // Coupons
  getCoupon(id: string): Promise<Coupon | undefined>;
  getCouponByCode(code: string): Promise<Coupon | undefined>;
  getCouponsByVendor(vendorId: string): Promise<Coupon[]>;
  validateCoupon(vendorId: string, code: string, subtotal: number): Promise<Coupon | null>;
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  updateCoupon(id: string, updates: Partial<InsertCoupon>): Promise<Coupon | undefined>;
  deleteCoupon(id: string): Promise<boolean>;

  // Transactions
  getTransaction(id: string): Promise<Transaction | undefined>;
  getTransactionsByVendor(vendorId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Notifications
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<boolean>;

  // Master Products
  getMasterProduct(id: string): Promise<MasterProduct | undefined>;
  getAllMasterProducts(isUniversal?: boolean): Promise<MasterProduct[]>;
  createMasterProduct(product: InsertMasterProduct): Promise<MasterProduct>;
  updateMasterProduct(id: string, updates: Partial<InsertMasterProduct>): Promise<MasterProduct | undefined>;
  deleteMasterProduct(id: string): Promise<boolean>;

  // Vendor Products
  getVendorProduct(id: string): Promise<VendorProduct | undefined>;
  getVendorProductsByVendor(vendorId: string): Promise<VendorProduct[]>;
  getVendorProductsByMasterProduct(masterProductId: string): Promise<VendorProduct[]>;
  getAllProducts(filters: Partial<any>): Promise<{ products: VendorProduct[]; total: number }>;
  createVendorProduct(product: InsertVendorProduct): Promise<VendorProduct>;
  updateVendorProduct(id: string, updates: Partial<InsertVendorProduct>): Promise<VendorProduct | undefined>;
  deleteVendorProduct(id: string): Promise<boolean>;
  adoptMasterProduct(vendorId: string, masterProductId: string, customizations?: Partial<InsertVendorProduct>): Promise<VendorProduct>;

  // Orders
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByVendor(vendorId: string): Promise<Order[]>;
  getOrdersByVendorAndCustomer(vendorId: string, customerId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, updates: Partial<InsertOrder>): Promise<Order | undefined>;

  // Order Items
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;

  // Customers
  getCustomer(id: string): Promise<Customer | undefined>;
  getCustomersByVendor(vendorId: string, status?: string): Promise<Customer[]>;
  getCustomerByPhone(vendorId: string, phone: string): Promise<Customer | undefined>;
  getCustomerByEmailAndVendor(vendorId: string, email: string): Promise<Customer | undefined>;
  searchCustomers(vendorId: string, query: string): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, updates: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: string): Promise<boolean>;
  getCustomerOrders(customerPhone: string, vendorId: string): Promise<Order[]>;
  
  // Admin: Aggregate all customers across vendors with filtering
  getAllCustomers(filters: Partial<AdminCustomersFilter>): Promise<{ customers: Customer[]; total: number }>;
  getCustomerBookings(customerPhone: string, vendorId: string): Promise<Booking[]>;

  // Admin: Aggregate all orders across vendors with filtering
  getAllOrders(filters: Partial<AdminOrdersFilter>): Promise<{ orders: Order[]; total: number }>;

  // Suppliers
  getSupplier(id: string): Promise<Supplier | undefined>;
  getSuppliersByVendor(vendorId: string, filters?: { status?: string; category?: string }): Promise<Supplier[]>;
  searchSuppliers(vendorId: string, query: string): Promise<Supplier[]>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: string, updates: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: string): Promise<boolean>;

  // Supplier Payments
  getSupplierPayment(id: string): Promise<SupplierPayment | undefined>;
  getSupplierPayments(supplierId: string): Promise<SupplierPayment[]>;
  getPaymentsByVendor(vendorId: string): Promise<SupplierPayment[]>;
  createSupplierPayment(payment: InsertSupplierPayment): Promise<SupplierPayment>;
  deleteSupplierPayment(id: string): Promise<boolean>;

  // Expenses
  getExpense(id: string): Promise<Expense | undefined>;
  getExpensesByVendor(vendorId: string, filters?: { 
    category?: string; 
    paymentType?: string; 
    status?: string; 
    supplierId?: string; 
    department?: string;
    isRecurring?: boolean;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Expense[]>;
  searchExpenses(vendorId: string, query: string): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: string, updates: Partial<InsertExpense>): Promise<Expense | undefined>;
  deleteExpense(id: string): Promise<boolean>;
  getRecurringExpenses(vendorId: string): Promise<Expense[]>;
  getUpcomingRecurringExpenses(vendorId: string, daysAhead?: number): Promise<Expense[]>;
  getExpensesBySupplier(supplierId: string): Promise<Expense[]>;

  // Customer Visits
  getCustomerVisit(id: string): Promise<CustomerVisit | undefined>;
  getCustomerVisits(customerId: string): Promise<CustomerVisit[]>;
  getVisitsByVendor(vendorId: string): Promise<CustomerVisit[]>;
  createCustomerVisit(visit: InsertCustomerVisit): Promise<CustomerVisit>;

  // Coupon Usages
  getCouponUsages(couponId: string): Promise<CouponUsage[]>;
  getCustomerCouponUsages(customerId: string): Promise<CouponUsage[]>;
  createCouponUsage(usage: InsertCouponUsage): Promise<CouponUsage>;

  // Customer Tasks
  getCustomerTask(id: string): Promise<CustomerTask | undefined>;
  getCustomerTasks(customerId: string): Promise<CustomerTask[]>;
  getTasksByVendor(vendorId: string, status?: string): Promise<CustomerTask[]>;
  createCustomerTask(task: InsertCustomerTask): Promise<CustomerTask>;
  updateCustomerTask(id: string, updates: Partial<InsertCustomerTask>): Promise<CustomerTask | undefined>;
  deleteCustomerTask(id: string): Promise<boolean>;

  // Leads
  getLead(id: string): Promise<Lead | undefined>;
  getLeadsByVendor(vendorId: string, filters?: { status?: string; source?: string; assignedEmployeeId?: string }): Promise<Lead[]>;
  searchLeads(vendorId: string, query: string): Promise<Lead[]>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: string, updates: Partial<InsertLead>): Promise<Lead | undefined>;
  deleteLead(id: string): Promise<boolean>;
  convertLeadToCustomer(leadId: string, customerId: string): Promise<Lead | undefined>;
  
  // Admin: Aggregate all leads across vendors with filtering
  getAllLeads(filters: Partial<AdminLeadsFilter>): Promise<{ leads: Lead[]; total: number }>;

  // Demo Requests (for landing page)
  getDemoRequest(id: string): Promise<DemoRequest | undefined>;
  getAllDemoRequests(filters?: { status?: string }): Promise<DemoRequest[]>;
  createDemoRequest(demoRequest: InsertDemoRequest): Promise<DemoRequest>;
  updateDemoRequest(id: string, updates: Partial<InsertDemoRequest>): Promise<DemoRequest | undefined>;
  deleteDemoRequest(id: string): Promise<boolean>;

  // Lead Communications
  getLeadCommunication(id: string): Promise<LeadCommunication | undefined>;
  getLeadCommunications(leadId: string): Promise<LeadCommunication[]>;
  createLeadCommunication(communication: InsertLeadCommunication): Promise<LeadCommunication>;

  // Lead Tasks
  getLeadTask(id: string): Promise<LeadTask | undefined>;
  getLeadTasks(leadId: string, status?: string): Promise<LeadTask[]>;
  getLeadTasksByEmployee(employeeId: string): Promise<LeadTask[]>;
  createLeadTask(task: InsertLeadTask): Promise<LeadTask>;
  updateLeadTask(id: string, updates: Partial<InsertLeadTask>): Promise<LeadTask | undefined>;
  deleteLeadTask(id: string): Promise<boolean>;

  // Quotations
  getQuotation(id: string): Promise<Quotation | undefined>;
  getQuotationsByVendor(vendorId: string, filters?: { status?: string; customerId?: string }): Promise<Quotation[]>;
  getQuotationsByCustomer(customerId: string): Promise<Quotation[]>;
  createQuotation(quotation: InsertQuotation): Promise<Quotation>;
  updateQuotation(id: string, updates: Partial<InsertQuotation>): Promise<Quotation | undefined>;
  deleteQuotation(id: string): Promise<boolean>;
  generateQuotationNumber(vendorId: string): Promise<string>;

  // Quotation Items
  getQuotationItem(id: string): Promise<QuotationItem | undefined>;
  getQuotationItems(quotationId: string): Promise<QuotationItem[]>;
  createQuotationItem(item: InsertQuotationItem): Promise<QuotationItem>;
  updateQuotationItem(id: string, updates: Partial<InsertQuotationItem>): Promise<QuotationItem | undefined>;
  deleteQuotationItem(id: string): Promise<boolean>;
  
  // Subscription Plans
  getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined>;
  getAllSubscriptionPlans(activeOnly?: boolean): Promise<SubscriptionPlan[]>;
  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  updateSubscriptionPlan(id: string, updates: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan | undefined>;
  deleteSubscriptionPlan(id: string): Promise<boolean>;
  
  // Vendor Subscriptions
  getVendorSubscription(id: string): Promise<VendorSubscription | undefined>;
  getVendorSubscriptionByVendor(vendorId: string): Promise<VendorSubscription | undefined>;
  getAllVendorSubscriptions(status?: string): Promise<VendorSubscription[]>;
  createVendorSubscription(subscription: InsertVendorSubscription): Promise<VendorSubscription>;
  updateVendorSubscription(id: string, updates: Partial<InsertVendorSubscription>): Promise<VendorSubscription | undefined>;
  cancelVendorSubscription(id: string): Promise<VendorSubscription | undefined>;
  
  // Billing History
  getBillingHistory(id: string): Promise<BillingHistory | undefined>;
  getBillingHistoryByVendor(vendorId: string): Promise<BillingHistory[]>;
  getAllBillingHistory(): Promise<BillingHistory[]>;
  createBillingHistory(billing: InsertBillingHistory): Promise<BillingHistory>;
  updateBillingHistory(id: string, updates: Partial<InsertBillingHistory>): Promise<BillingHistory | undefined>;
  
  // Usage Logs
  createUsageLog(log: InsertUsageLog): Promise<UsageLog>;
  getUsageLogsByVendor(vendorId: string, feature?: string): Promise<UsageLog[]>;

  // Mini-Website methods
  getMiniWebsiteByVendor(vendorId: string): Promise<MiniWebsite | undefined>;
  getMiniWebsiteBySubdomain(subdomain: string): Promise<MiniWebsite | undefined>;
  getMiniWebsite(id: string): Promise<MiniWebsite | undefined>;
  createMiniWebsite(data: InsertMiniWebsite): Promise<MiniWebsite>;
  updateMiniWebsite(id: string, data: Partial<InsertMiniWebsite>): Promise<MiniWebsite | null>;
  publishMiniWebsite(id: string): Promise<MiniWebsite | null>;
  deleteMiniWebsite(id: string): Promise<boolean>;
  createReview(data: InsertMiniWebsiteReview): Promise<MiniWebsiteReview>;
  getReviewsByMiniWebsite(miniWebsiteId: string, approved?: boolean): Promise<MiniWebsiteReview[]>;
  approveReview(id: string): Promise<MiniWebsiteReview | null>;
  deleteReview(id: string): Promise<boolean>;
  createMiniWebsiteLead(data: InsertMiniWebsiteLead): Promise<MiniWebsiteLead>;
  getMiniWebsiteLeadsByVendor(vendorId: string): Promise<MiniWebsiteLead[]>;
  updateMiniWebsiteLead(id: string, data: Partial<InsertMiniWebsiteLead>): Promise<MiniWebsiteLead | null>;

  // ==================== STOCK TURNOVER MODULE ====================
  
  // Inventory Locations
  getInventoryLocation(id: string): Promise<InventoryLocation | undefined>;
  getInventoryLocationsByVendor(vendorId: string): Promise<InventoryLocation[]>;
  getDefaultLocation(vendorId: string): Promise<InventoryLocation | undefined>;
  createInventoryLocation(location: InsertInventoryLocation): Promise<InventoryLocation>;
  updateInventoryLocation(id: string, updates: Partial<InsertInventoryLocation>): Promise<InventoryLocation | undefined>;
  deleteInventoryLocation(id: string): Promise<boolean>;
  
  // Stock Batches
  getStockBatch(id: string): Promise<StockBatch | undefined>;
  getStockBatchesByProduct(vendorProductId: string): Promise<StockBatch[]>;
  getExpiringBatches(vendorId: string, days: number): Promise<StockBatch[]>;
  createStockBatch(batch: InsertStockBatch): Promise<StockBatch>;
  updateStockBatch(id: string, updates: Partial<InsertStockBatch>): Promise<StockBatch | undefined>;
  deleteStockBatch(id: string): Promise<boolean>;
  
  // Stock Movements
  getStockMovement(id: string): Promise<StockMovement | undefined>;
  getStockMovementsByVendor(vendorId: string, filters?: { productId?: string; movementType?: string; startDate?: Date; endDate?: Date }): Promise<StockMovement[]>;
  getStockMovementsByProduct(vendorProductId: string): Promise<StockMovement[]>;
  createStockMovement(movement: InsertStockMovement): Promise<StockMovement>;
  recordStockIn(vendorProductId: string, quantity: number, data: Partial<InsertStockMovement>, userId?: string): Promise<{ movement: StockMovement; newStock: number }>;
  recordStockOut(vendorProductId: string, quantity: number, data: Partial<InsertStockMovement>, userId?: string): Promise<{ movement: StockMovement; newStock: number }>;
  
  // Stock Configs
  getStockConfig(vendorProductId: string): Promise<StockConfig | undefined>;
  getStockConfigsByVendor(vendorId: string): Promise<StockConfig[]>;
  createStockConfig(config: InsertStockConfig): Promise<StockConfig>;
  updateStockConfig(id: string, updates: Partial<InsertStockConfig>): Promise<StockConfig | undefined>;
  ensureStockConfig(vendorProductId: string): Promise<StockConfig>;
  
  // Stock Alerts
  getStockAlert(id: string): Promise<StockAlert | undefined>;
  getStockAlertsByVendor(vendorId: string, filters?: { status?: string; alertType?: string }): Promise<StockAlert[]>;
  createStockAlert(alert: InsertStockAlert): Promise<StockAlert>;
  acknowledgeStockAlert(id: string, userId: string): Promise<StockAlert | undefined>;
  resolveStockAlert(id: string): Promise<StockAlert | undefined>;
  dismissStockAlert(id: string): Promise<StockAlert | undefined>;
  checkAndGenerateAlerts(vendorId: string): Promise<StockAlert[]>;
  
  // Stock Analytics
  getStockTurnoverRate(vendorProductId: string, days: number): Promise<number>;
  getSlowMovingProducts(vendorId: string, days: number): Promise<VendorProduct[]>;
  getStockValue(vendorId: string): Promise<number>;
  getComprehensiveStockAnalytics(vendorId: string): Promise<{
    totalStockValue: number;
    lowStockItems: number;
    highStockItems: number;
    outOfStockItems: number;
    bestSellingItems: number;
    leastSellingItems: number;
  }>;

  // Ledger Transactions (Hisab Kitab)
  getLedgerTransaction(id: string): Promise<LedgerTransaction | undefined>;
  getLedgerTransactionsByVendor(vendorId: string, filters?: {
    customerId?: string;
    type?: string;
    category?: string;
    paymentMethod?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<LedgerTransaction[]>;
  getLedgerTransactionsByCustomer(customerId: string): Promise<LedgerTransaction[]>;
  createLedgerTransaction(transaction: InsertLedgerTransaction): Promise<LedgerTransaction>;
  updateLedgerTransaction(id: string, updates: Partial<InsertLedgerTransaction>): Promise<LedgerTransaction | undefined>;
  deleteLedgerTransaction(id: string): Promise<boolean>;
  getLedgerSummary(vendorId: string, filters?: { 
    customerId?: string; 
    type?: string;
    category?: string;
    paymentMethod?: string;
    startDate?: Date; 
    endDate?: Date;
  }): Promise<{
    totalIn: number;
    totalOut: number;
    balance: number;
    transactionCount: number;
  }>;
  getCustomerLedgerBalance(customerId: string): Promise<number>;
  getRecurringLedgerTransactions(vendorId: string): Promise<LedgerTransaction[]>;

  // Poster Categories
  getPosterCategories(): Promise<any[]>;
  createPosterCategory(category: any): Promise<any>;
  updatePosterCategory(id: string, updates: any): Promise<any>;
  deletePosterCategory(id: string): Promise<boolean>;

  // Greeting Templates (Greeting & Marketing Module)
  getGreetingTemplate(id: string): Promise<GreetingTemplate | undefined>;
  getAllGreetingTemplates(filters?: {
    status?: string;
    occasions?: string[];
    offerTypes?: string[];
    industries?: string[];
    isTrending?: boolean;
    categoryId?: string;
  }): Promise<GreetingTemplate[]>;
  searchGreetingTemplates(query: string, filters?: {
    occasions?: string[];
    offerTypes?: string[];
    industries?: string[];
  }): Promise<GreetingTemplate[]>;
  createGreetingTemplate(template: InsertGreetingTemplate): Promise<GreetingTemplate>;
  updateGreetingTemplate(id: string, updates: Partial<InsertGreetingTemplate>): Promise<GreetingTemplate | undefined>;
  deleteGreetingTemplate(id: string): Promise<boolean>;
  incrementTemplateDownload(id: string): Promise<void>;
  incrementTemplateShare(id: string): Promise<void>;
  
  // Greeting Template Usage
  getGreetingTemplateUsage(id: string): Promise<GreetingTemplateUsage | undefined>;
  getTemplateUsageByVendor(vendorId: string): Promise<GreetingTemplateUsage[]>;
  getTemplateUsageByTemplate(templateId: string): Promise<GreetingTemplateUsage[]>;
  createGreetingTemplateUsage(usage: InsertGreetingTemplateUsage): Promise<GreetingTemplateUsage>;
  incrementUsageShare(id: string, platform: string): Promise<void>;

  // Employee Attendance
  getAttendance(id: string): Promise<Attendance | undefined>;
  getAttendanceByEmployee(employeeId: string, vendorId: string): Promise<Attendance[]>;
  getAttendanceByVendor(vendorId: string, filters?: {
    startDate?: Date;
    endDate?: Date;
    employeeId?: string;
    status?: string;
  }): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: string, updates: Partial<Attendance>): Promise<Attendance | undefined>;
  deleteAttendance(id: string): Promise<void>;

  // Customer Attendance
  getCustomerAttendance(id: string): Promise<CustomerAttendance | undefined>;
  getCustomerAttendanceByCustomer(customerId: string, vendorId: string): Promise<CustomerAttendance[]>;
  getCustomerAttendanceByVendor(vendorId: string, filters?: {
    startDate?: Date;
    endDate?: Date;
    customerId?: string;
    status?: string;
  }): Promise<CustomerAttendance[]>;
  createCustomerAttendance(attendance: InsertCustomerAttendance): Promise<CustomerAttendance>;
  updateCustomerAttendance(id: string, updates: Partial<CustomerAttendance>): Promise<CustomerAttendance | undefined>;
  deleteCustomerAttendance(id: string): Promise<void>;

  // Leave Management
  getLeave(id: string): Promise<Leave | undefined>;
  getLeavesByEmployee(employeeId: string, vendorId: string): Promise<Leave[]>;
  getLeavesByVendor(vendorId: string, filters?: {
    startDate?: Date;
    endDate?: Date;
    employeeId?: string;
    status?: string;
    leaveType?: string;
  }): Promise<Leave[]>;
  createLeave(leave: InsertLeave): Promise<Leave>;
  updateLeave(id: string, updates: Partial<Leave>): Promise<Leave | undefined>;
  approveLeave(id: string, approvedBy: string): Promise<Leave | undefined>;
  rejectLeave(id: string, rejectedBy: string, reason?: string): Promise<Leave | undefined>;
  deleteLeave(id: string): Promise<void>;

  // Leave Balance
  getLeaveBalance(employeeId: string, vendorId: string, leaveType: string, year: number): Promise<LeaveBalance | undefined>;
  getLeaveBalancesByEmployee(employeeId: string, vendorId: string): Promise<LeaveBalance[]>;
  createLeaveBalance(balance: InsertLeaveBalance): Promise<LeaveBalance>;
  updateLeaveBalance(id: string, updates: Partial<LeaveBalance>): Promise<LeaveBalance | undefined>;

  // POS Bills
  getBill(id: string): Promise<Bill | undefined>;
  getBillsByVendor(vendorId: string, filters?: { status?: string; paymentStatus?: string; customerId?: string }): Promise<Bill[]>;
  createBill(bill: InsertBill): Promise<Bill>;
  updateBill(id: string, updates: Partial<Bill>): Promise<Bill | undefined>;
  completeBill(id: string): Promise<Bill | undefined>;

  // POS Bill Items
  getBillItems(billId: string): Promise<BillItem[]>;
  addBillItem(item: InsertBillItem): Promise<BillItem>;
  updateBillItem(id: string, updates: Partial<BillItem>): Promise<BillItem | undefined>;
  removeBillItem(id: string): Promise<void>;

  // POS Bill Payments
  getBillPayments(billId: string): Promise<BillPayment[]>;
  recordPayment(payment: InsertBillPayment): Promise<BillPayment>;

  // Additional Services
  getAllAdditionalServices?(activeOnly?: boolean): Promise<AdditionalService[]>;
  getAdditionalService?(id: string): Promise<AdditionalService | undefined>;
  createAdditionalService?(service: InsertAdditionalService): Promise<AdditionalService>;
  updateAdditionalService?(id: string, updates: Partial<InsertAdditionalService>): Promise<AdditionalService | undefined>;
  deleteAdditionalService?(id: string): Promise<boolean>;

  // Additional Service Inquiries
  getAllAdditionalServiceInquiries?(): Promise<AdditionalServiceInquiry[]>;
  getAdditionalServiceInquiry?(id: string): Promise<AdditionalServiceInquiry | undefined>;
  createAdditionalServiceInquiry?(inquiry: InsertAdditionalServiceInquiry): Promise<AdditionalServiceInquiry>;
  updateAdditionalServiceInquiry?(id: string, updates: Partial<InsertAdditionalServiceInquiry>): Promise<AdditionalServiceInquiry | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private vendors: Map<string, Vendor>;
  private categories: Map<string, Category>;
  private subcategories: Map<string, Subcategory>;
  private units: Map<string, Unit>;
  private masterServices: Map<string, MasterService>;
  private vendorCatalogues: Map<string, VendorCatalogue>;
  private customServiceRequests: Map<string, CustomServiceRequest>;
  private bookings: Map<string, Booking>;
  private appointments: Map<string, Appointment>;
  private employees: Map<string, Employee>;
  private tasks: Map<string, Task>;
  private attendance: Map<string, Attendance>;
  private leaves: Map<string, Leave>;
  private leaveBalances: Map<string, LeaveBalance>;
  private payroll: Map<string, Payroll>;
  private holidays: Map<string, Holiday>;
  private coupons: Map<string, Coupon>;
  private transactions: Map<string, Transaction>;
  private notifications: Map<string, Notification>;
  private masterProducts: Map<string, MasterProduct>;
  private vendorProducts: Map<string, VendorProduct>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;
  private customers: Map<string, Customer>;
  private customerVisits: Map<string, CustomerVisit>;
  private couponUsages: Map<string, CouponUsage>;
  private customerTasks: Map<string, CustomerTask>;
  private suppliers: Map<string, Supplier>;
  private supplierPayments: Map<string, SupplierPayment>;
  private expenses: Map<string, Expense>;
  private leads: Map<string, Lead>;
  private demoRequests: Map<string, DemoRequest>;
  private leadCommunications: Map<string, LeadCommunication>;
  private leadTasks: Map<string, LeadTask>;
  private quotations: Map<string, Quotation>;
  private quotationItems: Map<string, QuotationItem>;
  private miniWebsites: Map<string, MiniWebsite>;
  private miniWebsiteReviews: Map<string, MiniWebsiteReview>;
  private miniWebsiteLeads: Map<string, MiniWebsiteLead>;
  
  // Ledger Transactions (Hisab Kitab)
  private ledgerTransactions: Map<string, LedgerTransaction>;
  
  // Stock Turnover Module
  private inventoryLocations: Map<string, InventoryLocation>;
  private stockBatches: Map<string, StockBatch>;
  private stockMovements: Map<string, StockMovement>;
  private stockConfigs: Map<string, StockConfig>;
  private stockAlerts: Map<string, StockAlert>;
  
  // Greeting & Marketing Module
  private greetingTemplates: Map<string, GreetingTemplate>;
  private greetingTemplateUsage: Map<string, GreetingTemplateUsage>;

  // Attendance & Leave Management
  private customerAttendance: Map<string, CustomerAttendance>;

  // POS Module
  private bills: Map<string, Bill>;
  private billItems: Map<string, BillItem>;
  private billPayments: Map<string, BillPayment>;

  // Subscription & Billing Module
  private subscriptionPlans: Map<string, SubscriptionPlan>;
  private vendorSubscriptions: Map<string, VendorSubscription>;
  private billingHistories: Map<string, BillingHistory>;
  private usageLogs: Map<string, UsageLog>;

  // Additional Services Module
  private additionalServices: Map<string, AdditionalService>;
  private additionalServiceInquiries: Map<string, AdditionalServiceInquiry>;

  constructor() {
    this.users = new Map();
    this.vendors = new Map();
    this.categories = new Map();
    this.subcategories = new Map();
    this.units = new Map();
    this.masterServices = new Map();
    this.vendorCatalogues = new Map();
    this.customServiceRequests = new Map();
    this.bookings = new Map();
    this.appointments = new Map();
    this.employees = new Map();
    this.tasks = new Map();
    this.attendance = new Map();
    this.leaves = new Map();
    this.leaveBalances = new Map();
    this.payroll = new Map();
    this.holidays = new Map();
    this.coupons = new Map();
    this.transactions = new Map();
    this.notifications = new Map();
    this.masterProducts = new Map();
    this.vendorProducts = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.customers = new Map();
    this.customerVisits = new Map();
    this.couponUsages = new Map();
    this.customerTasks = new Map();
    this.suppliers = new Map();
    this.supplierPayments = new Map();
    this.expenses = new Map();
    this.leads = new Map();
    this.demoRequests = new Map();
    this.leadCommunications = new Map();
    this.leadTasks = new Map();
    this.quotations = new Map();
    this.quotationItems = new Map();
    this.miniWebsites = new Map();
    this.subscriptionPlans = new Map();
    this.vendorSubscriptions = new Map();
    this.billingHistories = new Map();
    this.usageLogs = new Map();
    this.miniWebsiteReviews = new Map();
    this.miniWebsiteLeads = new Map();
    this.additionalServices = new Map();
    this.additionalServiceInquiries = new Map();
    
    // Ledger Transactions (Hisab Kitab)
    this.ledgerTransactions = new Map();
    
    // Stock Turnover Module
    this.inventoryLocations = new Map();
    this.stockBatches = new Map();
    this.stockMovements = new Map();
    this.stockConfigs = new Map();
    this.stockAlerts = new Map();
    
    // Greeting & Marketing Module
    this.greetingTemplates = new Map();
    this.greetingTemplateUsage = new Map();

    // Attendance & Leave Management
    this.attendance = new Map();
    this.customerAttendance = new Map();
    this.leaves = new Map();
    this.leaveBalances = new Map();

    // POS Module
    this.bills = new Map();
    this.billItems = new Map();
    this.billPayments = new Map();
    
    // Add sample bookings, appointments, and orders for testing
    this.seedSampleVendors();
    this.seedSampleBookings();
    this.seedSampleAppointments();
    this.seedSampleMasterProducts();
    this.seedSampleVendorProducts();
    this.seedSampleOrders();
    this.seedSampleEmployees();
    this.seedSampleCustomers();
    this.seedSampleCoupons();
    this.seedSampleMasterServices();
    this.seedSampleVendorCatalogues();
    this.seedSampleGreetingTemplates();
    this.seedSampleLeads();
    this.seedSubscriptionPlans();
  }

  private seedSampleVendors() {
    const sampleVendor: Vendor = {
      id: "vendor-1",
      userId: "user-1",
      businessName: "HealthCare Plus",
      ownerName: "Dr. Rajesh Kumar",
      category: "Healthcare",
      subcategory: "Clinics",
      customCategory: null,
      customSubcategory: null,
      email: "contact@healthcareplus.com",
      phone: "+91 98765 43210",
      whatsappNumber: "+91 98765 43210",
      street: "123 MG Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      address: "123 MG Road, Bangalore, Karnataka - 560001",
      logo: null,
      banner: null,
      description: "Your trusted healthcare partner providing comprehensive medical services and diagnostics with state-of-the-art facilities.",
      licenseNumber: "HC-BLR-2023-1234",
      gstNumber: "29ABCDE1234F1Z5",
      latitude: null,
      longitude: null,
      status: "approved",
      onboardingComplete: true,
      bankAccountName: null,
      bankAccountNumber: null,
      bankIfscCode: null,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    };

    this.vendors.set(sampleVendor.id, sampleVendor);
  }

  private seedSampleBookings() {
    const sampleBookings: Booking[] = [
      {
        id: "bkg-1",
        vendorId: "vendor-1",
        vendorCatalogueId: "test-catalogue-1",
        patientName: "Rahul Sharma",
        patientPhone: "+91 98765 43210",
        patientEmail: "rahul@example.com",
        patientAge: 35,
        patientGender: "Male",
        bookingDate: new Date("2024-10-25T10:00:00Z"),
        status: "pending",
        isHomeCollection: true,
        collectionAddress: "123 MG Road, Bangalore, Karnataka 560001",
        assignedTo: null,
        price: 650,
        homeCollectionCharges: 100,
        totalAmount: 750,
        paymentStatus: "pending",
        notes: "Fasting required - 12 hours",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "bkg-2",
        vendorId: "vendor-1",
        vendorCatalogueId: "test-catalogue-2",
        patientName: "Priya Patel",
        patientPhone: "+91 87654 32109",
        patientEmail: "priya@example.com",
        patientAge: 28,
        patientGender: "Female",
        bookingDate: new Date("2024-10-24T14:30:00Z"),
        status: "confirmed",
        isHomeCollection: false,
        collectionAddress: null,
        assignedTo: null,
        price: 850,
        homeCollectionCharges: 0,
        totalAmount: 850,
        paymentStatus: "paid",
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "bkg-3",
        vendorId: "vendor-1",
        vendorCatalogueId: "test-catalogue-1",
        patientName: "Amit Kumar",
        patientPhone: "+91 76543 21098",
        patientEmail: null,
        patientAge: 45,
        patientGender: "Male",
        bookingDate: new Date("2024-10-20T09:00:00Z"),
        status: "completed",
        isHomeCollection: true,
        collectionAddress: "456 Brigade Road, Bangalore, Karnataka 560025",
        assignedTo: null,
        price: 650,
        homeCollectionCharges: 100,
        totalAmount: 750,
        paymentStatus: "paid",
        notes: "Sample collected successfully",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "bkg-4",
        vendorId: "vendor-1",
        vendorCatalogueId: "test-catalogue-3",
        patientName: "Sneha Reddy",
        patientPhone: "+91 65432 10987",
        patientEmail: "sneha@example.com",
        patientAge: 32,
        patientGender: "Female",
        bookingDate: new Date("2024-10-26T11:00:00Z"),
        status: "pending",
        isHomeCollection: false,
        collectionAddress: null,
        assignedTo: null,
        price: 450,
        homeCollectionCharges: 0,
        totalAmount: 450,
        paymentStatus: "pending",
        notes: "Patient prefers morning slot",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "bkg-5",
        vendorId: "vendor-1",
        vendorCatalogueId: "test-catalogue-1",
        patientName: "Vikram Singh",
        patientPhone: "+91 54321 09876",
        patientEmail: "vikram@example.com",
        patientAge: 52,
        patientGender: "Male",
        bookingDate: new Date("2024-10-23T08:30:00Z"),
        status: "cancelled",
        isHomeCollection: true,
        collectionAddress: "789 Residency Road, Bangalore, Karnataka 560001",
        assignedTo: null,
        price: 650,
        homeCollectionCharges: 100,
        totalAmount: 750,
        paymentStatus: "refunded",
        notes: "Patient requested cancellation",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleBookings.forEach(bkg => {
      this.bookings.set(bkg.id, bkg);
    });
  }

  private seedSampleAppointments() {
    const sampleAppointments: Appointment[] = [
      {
        id: "apt-1",
        vendorId: "vendor-1",
        patientName: "Anjali Mehta",
        patientPhone: "+91 98123 45678",
        patientEmail: "anjali@example.com",
        patientAge: 42,
        patientGender: "Female",
        appointmentDate: new Date("2024-10-27T10:00:00Z"),
        appointmentTime: "10:00 AM",
        purpose: "Routine checkup and blood pressure monitoring",
        doctorName: "Dr. Rajesh Kumar",
        department: "General Medicine",
        status: "pending",
        visitType: "first_visit",
        assignedTo: null,
        notes: "Patient has history of hypertension",
        paymentStatus: "pending",
        consultationFee: 500,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "apt-2",
        vendorId: "vendor-1",
        patientName: "Arjun Nair",
        patientPhone: "+91 87654 32100",
        patientEmail: null,
        patientAge: 28,
        patientGender: "Male",
        appointmentDate: new Date("2024-10-26T14:30:00Z"),
        appointmentTime: "2:30 PM",
        purpose: "Follow-up consultation for diabetes management",
        doctorName: "Dr. Priya Sharma",
        department: "Endocrinology",
        status: "confirmed",
        visitType: "follow_up",
        assignedTo: null,
        notes: "Bring latest blood sugar reports",
        paymentStatus: "paid",
        consultationFee: 600,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "apt-3",
        vendorId: "vendor-1",
        patientName: "Deepika Verma",
        patientPhone: "+91 76543 21000",
        patientEmail: "deepika@example.com",
        patientAge: 35,
        patientGender: "Female",
        appointmentDate: new Date("2024-10-22T09:00:00Z"),
        appointmentTime: "9:00 AM",
        purpose: "Post-surgery follow-up",
        doctorName: "Dr. Anil Reddy",
        department: "Orthopedics",
        status: "completed",
        visitType: "follow_up",
        assignedTo: null,
        notes: "Recovery progressing well",
        paymentStatus: "paid",
        consultationFee: 800,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "apt-4",
        vendorId: "vendor-1",
        patientName: "Karthik Iyer",
        patientPhone: "+91 65432 10000",
        patientEmail: "karthik@example.com",
        patientAge: 55,
        patientGender: "Male",
        appointmentDate: new Date("2024-10-28T11:00:00Z"),
        appointmentTime: "11:00 AM",
        purpose: "Chest pain and breathing difficulty",
        doctorName: "Dr. Sunita Patel",
        department: "Cardiology",
        status: "pending",
        visitType: "emergency",
        assignedTo: null,
        notes: "Urgent consultation required",
        paymentStatus: "pending",
        consultationFee: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "apt-5",
        vendorId: "vendor-1",
        patientName: "Meera Gupta",
        patientPhone: "+91 54321 00000",
        patientEmail: "meera@example.com",
        patientAge: 30,
        patientGender: "Female",
        appointmentDate: new Date("2024-10-24T15:00:00Z"),
        appointmentTime: "3:00 PM",
        purpose: "Dental cleaning and checkup",
        doctorName: "Dr. Ramesh Singh",
        department: "Dentistry",
        status: "cancelled",
        visitType: "first_visit",
        assignedTo: null,
        notes: "Patient requested rescheduling",
        paymentStatus: "refunded",
        consultationFee: 400,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleAppointments.forEach(apt => {
      this.appointments.set(apt.id, apt);
    });
  }

  private seedSampleMasterProducts() {
    const sampleMasterProducts: MasterProduct[] = [
      {
        id: "mp-1",
        name: "Premium Yoga Mat - Anti-Slip",
        brand: "FitPro",
        category: "Sports & Fitness",
        subcategory: "Yoga & Exercise",
        categoryId: null,
        subcategoryId: null,
        icon: "🧘",
        description: "Professional-grade yoga mat designed for maximum comfort and stability during your practice. Features superior grip technology and eco-friendly materials that provide excellent cushioning for all types of yoga and floor exercises.",
        specifications: [
          "Material: TPE (Thermoplastic Elastomer)",
          "Dimensions: 183cm x 61cm x 6mm",
          "Weight: 1.2kg",
          "Texture: Double-sided non-slip",
          "Care: Wipe clean with damp cloth",
          "Carrying strap included"
        ],
        tags: ["yoga", "fitness", "exercise", "mat", "eco-friendly", "non-slip"],
        basePrice: 1299,
        unit: "piece",
        imageKeys: [],
        images: [
          "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800",
          "https://images.unsplash.com/photo-1592432678016-e910b452f9d0?w=800"
        ],
        requiresPrescription: false,
        isUniversal: true,
        version: 1,
        status: "published",
        createdBy: null,
        createdAt: new Date("2024-10-01"),
        updatedAt: new Date("2024-10-01"),
      },
      {
        id: "mp-2",
        name: "Protein Powder - Whey Isolate",
        brand: "MuscleMax",
        category: "Health & Nutrition",
        subcategory: "Protein Supplements",
        categoryId: null,
        subcategoryId: null,
        icon: "💪",
        description: "Ultra-pure whey protein isolate with 25g protein per serving. Perfect for muscle building, recovery, and maintaining a healthy lifestyle. Low in carbs and fat, easily digestible formula enriched with BCAAs and essential amino acids.",
        specifications: [
          "Protein per serving: 25g",
          "Serving size: 30g (1 scoop)",
          "Servings per container: 33",
          "Flavor: Chocolate",
          "Carbs: 2g per serving",
          "Fat: 1g per serving",
          "Added BCAAs: 5.5g per serving",
          "Certification: GMP Certified"
        ],
        tags: ["protein", "whey", "supplement", "fitness", "muscle-building", "recovery"],
        basePrice: 2499,
        unit: "kg",
        imageKeys: [],
        images: [
          "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=800",
          "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800",
          "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=800"
        ],
        requiresPrescription: false,
        isUniversal: true,
        version: 1,
        status: "published",
        createdBy: null,
        createdAt: new Date("2024-09-15"),
        updatedAt: new Date("2024-09-15"),
      },
      {
        id: "mp-3",
        name: "Paracetamol 500mg Tablets",
        brand: "PharmaCare",
        category: "Healthcare",
        subcategory: "Pain Relief",
        categoryId: null,
        subcategoryId: null,
        icon: "💊",
        description: "Fast-acting pain relief and fever reducer. Effective for headaches, muscle aches, arthritis, backaches, toothaches, colds, and fevers. Gentle on stomach and suitable for most adults and children over 12 years.",
        specifications: [
          "Active ingredient: Paracetamol 500mg",
          "Pack size: 20 tablets (2 strips of 10)",
          "Dosage: 1-2 tablets every 4-6 hours as needed",
          "Maximum daily dose: 4000mg (8 tablets)",
          "Storage: Store below 25°C in a dry place",
          "Expiry: 24 months from manufacturing"
        ],
        tags: ["paracetamol", "pain-relief", "fever", "tablets", "medication", "headache"],
        basePrice: 45,
        unit: "strip",
        imageKeys: [],
        images: [
          "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800"
        ],
        requiresPrescription: false,
        isUniversal: true,
        version: 1,
        status: "published",
        createdBy: null,
        createdAt: new Date("2024-08-20"),
        updatedAt: new Date("2024-08-20"),
      },
      {
        id: "mp-4",
        name: "Organic Green Tea - Premium Blend",
        brand: "TeaHaven",
        category: "Food & Beverages",
        subcategory: "Tea & Coffee",
        categoryId: null,
        subcategoryId: null,
        icon: "🍵",
        description: "Premium organic green tea sourced from high-altitude tea gardens. Rich in antioxidants, this delicate blend offers a smooth, refreshing taste with subtle floral notes. Perfect for daily wellness and relaxation.",
        specifications: [
          "Type: Whole leaf green tea",
          "Origin: Darjeeling, India",
          "Certification: USDA Organic, Fair Trade",
          "Caffeine: Moderate (20-30mg per cup)",
          "Brewing: 80°C water, 2-3 minutes",
          "Contains: 100g (approx. 50 cups)",
          "Shelf life: 12 months"
        ],
        tags: ["tea", "green-tea", "organic", "antioxidants", "wellness", "darjeeling"],
        basePrice: 399,
        unit: "box",
        imageKeys: [],
        images: [
          "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800",
          "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800"
        ],
        requiresPrescription: false,
        isUniversal: true,
        version: 1,
        status: "published",
        createdBy: null,
        createdAt: new Date("2024-09-01"),
        updatedAt: new Date("2024-09-01"),
      },
      {
        id: "mp-5",
        name: "Resistance Bands Set - 5 Levels",
        brand: "PowerFlex",
        category: "Sports & Fitness",
        subcategory: "Strength Training",
        categoryId: null,
        subcategoryId: null,
        icon: "🏋️",
        description: "Complete resistance training set with 5 different resistance levels from light to extra heavy. Perfect for strength training, physical therapy, home workouts, and travel. Durable latex-free material with comfortable handles and door anchor included.",
        specifications: [
          "Set includes: 5 resistance bands",
          "Resistance levels: 5lbs, 10lbs, 15lbs, 20lbs, 25lbs",
          "Material: Premium latex-free rubber",
          "Length: 48 inches (120cm)",
          "Accessories: 2 handles, 2 ankle straps, 1 door anchor, carrying bag",
          "Color-coded for easy identification",
          "Warranty: 1 year"
        ],
        tags: ["resistance-bands", "fitness", "strength-training", "workout", "home-gym", "portable"],
        basePrice: 899,
        unit: "set",
        imageKeys: [],
        images: [
          "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800",
          "https://images.unsplash.com/photo-1517836477839-7072aaa8b121?w=800"
        ],
        requiresPrescription: false,
        isUniversal: true,
        version: 1,
        status: "published",
        createdBy: null,
        createdAt: new Date("2024-10-05"),
        updatedAt: new Date("2024-10-05"),
      },
      {
        id: "mp-6",
        name: "Vitamin C 1000mg + Zinc Tablets",
        brand: "HealthGuard",
        category: "Health & Nutrition",
        subcategory: "Vitamins & Minerals",
        categoryId: null,
        subcategoryId: null,
        icon: "🍊",
        description: "Powerful immune support formula combining Vitamin C and Zinc. Helps maintain healthy immune function, supports collagen formation, and provides antioxidant protection. Easy-to-swallow tablets suitable for daily use.",
        specifications: [
          "Vitamin C: 1000mg per tablet",
          "Zinc: 15mg per tablet",
          "Pack size: 60 tablets (2 months supply)",
          "Dosage: 1 tablet daily with food",
          "Free from: Gluten, dairy, artificial colors",
          "Vegan-friendly",
          "GMP certified facility"
        ],
        tags: ["vitamin-c", "zinc", "immunity", "supplement", "health", "antioxidant"],
        basePrice: 549,
        unit: "bottle",
        imageKeys: [],
        images: [
          "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=800"
        ],
        requiresPrescription: false,
        isUniversal: true,
        version: 1,
        status: "published",
        createdBy: null,
        createdAt: new Date("2024-09-20"),
        updatedAt: new Date("2024-09-20"),
      },
      {
        id: "mp-7",
        name: "Blood Pressure Monitor - Digital",
        brand: "CarePlus",
        category: "Medical Devices",
        subcategory: "Diagnostic Equipment",
        categoryId: null,
        subcategoryId: null,
        icon: "🩺",
        description: "Clinically validated automatic blood pressure monitor for accurate home monitoring. Large LCD display, irregular heartbeat detection, and memory for 90 readings. Includes adjustable cuff suitable for most arm sizes.",
        specifications: [
          "Measurement method: Oscillometric",
          "Cuff size: 22-42cm",
          "Display: Large LCD with backlight",
          "Memory: 90 readings (2 users)",
          "Accuracy: ±3 mmHg (pressure), ±5% (pulse)",
          "Power: 4 AA batteries (included) or AC adapter (optional)",
          "Certification: CE marked, clinically validated"
        ],
        tags: ["blood-pressure", "monitor", "medical-device", "health", "home-care", "diagnostics"],
        basePrice: 1799,
        unit: "unit",
        imageKeys: [],
        images: [
          "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800"
        ],
        requiresPrescription: false,
        isUniversal: true,
        version: 1,
        status: "published",
        createdBy: null,
        createdAt: new Date("2024-08-25"),
        updatedAt: new Date("2024-08-25"),
      },
      {
        id: "mp-8",
        name: "Antiseptic Liquid - Dettol",
        brand: "Dettol",
        category: "Healthcare",
        subcategory: "First Aid & Hygiene",
        categoryId: null,
        subcategoryId: null,
        icon: "🧴",
        description: "Trusted antiseptic liquid for protection against germs. Can be used for first aid, personal hygiene, surface cleaning, and laundry disinfection. Kills 99.9% of germs and provides long-lasting protection.",
        specifications: [
          "Active ingredient: Chloroxylenol 4.8% w/v",
          "Volume: 500ml",
          "Uses: Cuts, bruises, insect bites, floor cleaning, laundry",
          "Dilution: Varies by use (see label)",
          "Shelf life: 3 years from manufacturing",
          "Storage: Keep in cool, dry place"
        ],
        tags: ["antiseptic", "dettol", "disinfectant", "hygiene", "germ-protection", "first-aid"],
        basePrice: 185,
        unit: "bottle",
        imageKeys: [],
        images: [],
        requiresPrescription: false,
        isUniversal: true,
        version: 1,
        status: "published",
        createdBy: null,
        createdAt: new Date("2024-07-30"),
        updatedAt: new Date("2024-07-30"),
      },
    ];

    sampleMasterProducts.forEach(product => {
      this.masterProducts.set(product.id, product);
    });
  }

  private seedSampleVendorProducts() {
    const sampleVendorProducts: VendorProduct[] = [
      {
        id: "vp-1",
        vendorId: "vendor-1",
        masterProductId: null,
        name: "Premium Vitamin D3 Supplement",
        description: "High-quality Vitamin D3 supplement for bone health",
        category: "Vitamins & Supplements",
        price: 450,
        stock: 5, // Low stock
        sku: "VIT-D3-1000",
        images: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vp-2",
        vendorId: "vendor-1",
        masterProductId: null,
        name: "Omega-3 Fish Oil Capsules",
        description: "Pure fish oil capsules for heart and brain health",
        category: "Vitamins & Supplements",
        price: 650,
        stock: 150, // High stock
        sku: "OMEGA-3-500",
        images: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vp-3",
        vendorId: "vendor-1",
        masterProductId: null,
        name: "Multivitamin Tablets",
        description: "Complete daily multivitamin for overall wellness",
        category: "Vitamins & Supplements",
        price: 350,
        stock: 0, // Out of stock
        sku: "MULTI-VIT-100",
        images: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vp-4",
        vendorId: "vendor-1",
        masterProductId: null,
        name: "Protein Powder - Chocolate",
        description: "Whey protein isolate for muscle building",
        category: "Nutrition",
        price: 1200,
        stock: 45,
        sku: "PROT-CHOC-1KG",
        images: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vp-5",
        vendorId: "vendor-1",
        masterProductId: null,
        name: "Calcium + Magnesium Tablets",
        description: "Essential minerals for bone and muscle health",
        category: "Vitamins & Supplements",
        price: 280,
        stock: 8, // Low stock
        sku: "CAL-MAG-60",
        images: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vp-6",
        vendorId: "vendor-1",
        masterProductId: null,
        name: "Vitamin C 1000mg",
        description: "High-potency vitamin C for immunity boost",
        category: "Vitamins & Supplements",
        price: 320,
        stock: 65,
        sku: "VIT-C-1000",
        images: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vp-7",
        vendorId: "vendor-1",
        masterProductId: null,
        name: "Glucosamine Joint Support",
        description: "Advanced formula for joint health and mobility",
        category: "Joint Care",
        price: 890,
        stock: 120, // High stock
        sku: "GLUC-JOINT-90",
        images: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vp-8",
        vendorId: "vendor-1",
        masterProductId: null,
        name: "Probiotics Capsules",
        description: "10 billion CFU for digestive health",
        category: "Digestive Health",
        price: 580,
        stock: 0, // Out of stock
        sku: "PROB-10B-30",
        images: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vp-9",
        vendorId: "vendor-1",
        masterProductId: null,
        name: "Zinc Supplement 50mg",
        description: "Essential mineral for immune system support",
        category: "Vitamins & Supplements",
        price: 240,
        stock: 35,
        sku: "ZINC-50-60",
        images: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vp-10",
        vendorId: "vendor-1",
        masterProductId: null,
        name: "Ashwagandha Extract",
        description: "Ayurvedic herb for stress relief and vitality",
        category: "Herbal Supplements",
        price: 750,
        stock: 6, // Low stock
        sku: "ASHWA-500-60",
        images: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vp-11",
        vendorId: "vendor-1",
        masterProductId: null,
        name: "Biotin Hair Growth",
        description: "10000mcg biotin for healthy hair and nails",
        category: "Beauty & Wellness",
        price: 420,
        stock: 95,
        sku: "BIOTIN-10K-90",
        images: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vp-12",
        vendorId: "vendor-1",
        masterProductId: null,
        name: "Turmeric Curcumin",
        description: "Anti-inflammatory support with black pepper",
        category: "Herbal Supplements",
        price: 550,
        stock: 140, // High stock
        sku: "TURM-CUR-500",
        images: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleVendorProducts.forEach(product => {
      this.vendorProducts.set(product.id, product);
    });
  }

  private seedSampleOrders() {
    const sampleOrders: Order[] = [
      {
        id: "ord-1",
        vendorId: "vendor-1",
        customerName: "Neha Kapoor",
        customerPhone: "+91 98111 22333",
        customerEmail: "neha@example.com",
        deliveryAddress: "Flat 204, Green Valley Apartments, Indiranagar",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560038",
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: "cod",
        subtotal: 450,
        deliveryCharges: 50,
        totalAmount: 500,
        prescriptionRequired: true,
        prescriptionImage: null,
        notes: "Please call before delivery",
        assignedTo: null,
        trackingNumber: null,
        estimatedDelivery: new Date("2024-10-29T18:00:00Z"),
        deliveredAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "ord-2",
        vendorId: "vendor-1",
        customerName: "Rohan Malhotra",
        customerPhone: "+91 87222 33444",
        customerEmail: "rohan@example.com",
        deliveryAddress: "House No. 45, Koramangala 5th Block",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560095",
        status: "confirmed",
        paymentStatus: "paid",
        paymentMethod: "online",
        subtotal: 1250,
        deliveryCharges: 0,
        totalAmount: 1250,
        prescriptionRequired: false,
        prescriptionImage: null,
        notes: null,
        assignedTo: null,
        trackingNumber: "TRK123456",
        estimatedDelivery: new Date("2024-10-28T18:00:00Z"),
        deliveredAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "ord-3",
        vendorId: "vendor-1",
        customerName: "Divya Shah",
        customerPhone: "+91 76333 44555",
        customerEmail: "divya@example.com",
        deliveryAddress: "Plot 12, HSR Layout Sector 2",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560102",
        status: "processing",
        paymentStatus: "paid",
        paymentMethod: "wallet",
        subtotal: 850,
        deliveryCharges: 50,
        totalAmount: 900,
        prescriptionRequired: true,
        prescriptionImage: "https://example.com/prescriptions/rx-001.jpg",
        notes: "Urgent delivery required",
        assignedTo: null,
        trackingNumber: "TRK789012",
        estimatedDelivery: new Date("2024-10-27T18:00:00Z"),
        deliveredAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "ord-4",
        vendorId: "vendor-1",
        customerName: "Aditya Verma",
        customerPhone: "+91 65444 55666",
        customerEmail: null,
        deliveryAddress: "B-303, Whitefield Main Road",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560066",
        status: "delivered",
        paymentStatus: "paid",
        paymentMethod: "online",
        subtotal: 320,
        deliveryCharges: 50,
        totalAmount: 370,
        prescriptionRequired: false,
        prescriptionImage: null,
        notes: null,
        assignedTo: null,
        trackingNumber: "TRK345678",
        estimatedDelivery: new Date("2024-10-24T18:00:00Z"),
        deliveredAt: new Date("2024-10-24T17:30:00Z"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "ord-5",
        vendorId: "vendor-1",
        customerName: "Sanya Gupta",
        customerPhone: "+91 54555 66777",
        customerEmail: "sanya@example.com",
        deliveryAddress: "Villa 23, Embassy Golf Links",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560071",
        status: "cancelled",
        paymentStatus: "refunded",
        paymentMethod: "online",
        subtotal: 650,
        deliveryCharges: 50,
        totalAmount: 700,
        prescriptionRequired: false,
        prescriptionImage: null,
        notes: "Customer requested cancellation - out of stock",
        assignedTo: null,
        trackingNumber: null,
        estimatedDelivery: null,
        deliveredAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const sampleOrderItems: OrderItem[] = [
      // Order 1 items
      {
        id: "oi-1",
        orderId: "ord-1",
        vendorProductId: "vp-1",
        productName: "Paracetamol 500mg",
        productBrand: "Crocin",
        productUnit: "Strip of 10 tablets",
        quantity: 2,
        pricePerUnit: 25,
        totalPrice: 50,
        createdAt: new Date(),
      },
      {
        id: "oi-2",
        orderId: "ord-1",
        vendorProductId: "vp-2",
        productName: "Vitamin D3",
        productBrand: "Healthvit",
        productUnit: "Bottle of 60 capsules",
        quantity: 1,
        pricePerUnit: 400,
        totalPrice: 400,
        createdAt: new Date(),
      },
      // Order 2 items
      {
        id: "oi-3",
        orderId: "ord-2",
        vendorProductId: "vp-3",
        productName: "Blood Pressure Monitor",
        productBrand: "Omron",
        productUnit: "1 unit",
        quantity: 1,
        pricePerUnit: 1250,
        totalPrice: 1250,
        createdAt: new Date(),
      },
      // Order 3 items
      {
        id: "oi-4",
        orderId: "ord-3",
        vendorProductId: "vp-4",
        productName: "Amoxicillin 500mg",
        productBrand: "Novamox",
        productUnit: "Strip of 10 capsules",
        quantity: 3,
        pricePerUnit: 150,
        totalPrice: 450,
        createdAt: new Date(),
      },
      {
        id: "oi-5",
        orderId: "ord-3",
        vendorProductId: "vp-5",
        productName: "Cough Syrup",
        productBrand: "Benadryl",
        productUnit: "100ml bottle",
        quantity: 2,
        pricePerUnit: 200,
        totalPrice: 400,
        createdAt: new Date(),
      },
      // Order 4 items
      {
        id: "oi-6",
        orderId: "ord-4",
        vendorProductId: "vp-6",
        productName: "Hand Sanitizer",
        productBrand: "Dettol",
        productUnit: "500ml bottle",
        quantity: 2,
        pricePerUnit: 160,
        totalPrice: 320,
        createdAt: new Date(),
      },
      // Order 5 items
      {
        id: "oi-7",
        orderId: "ord-5",
        vendorProductId: "vp-7",
        productName: "Digital Thermometer",
        productBrand: "Dr. Trust",
        productUnit: "1 unit",
        quantity: 1,
        pricePerUnit: 650,
        totalPrice: 650,
        createdAt: new Date(),
      },
    ];

    sampleOrders.forEach(order => {
      this.orders.set(order.id, order);
    });

    sampleOrderItems.forEach(item => {
      this.orderItems.set(item.id, item);
    });
  }

  private seedSampleEmployees() {
    const sampleEmployees: Employee[] = [
      // Gym/Fitness Center Employees
      {
        id: "emp-1",
        vendorId: "vendor-1",
        userId: null,
        name: "Rajesh Kumar",
        email: "rajesh.kumar@fitlife.com",
        phone: "+91 98765 43210",
        address: "Apartment 301, Green Valley Residency",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        dateOfBirth: new Date("1988-05-15"),
        gender: "male",
        role: "Fitness Trainer",
        department: "Training",
        joiningDate: new Date("2022-01-15"),
        employmentType: "full-time",
        shiftStartTime: "06:00 AM",
        shiftEndTime: "02:00 PM",
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        idProofType: "aadhar",
        idProofNumber: "1234-5678-9012",
        idProofDocument: null,
        certifications: [],
        basicSalary: 35000,
        bankAccountNumber: "1234567890",
        bankIfscCode: "ICIC0001234",
        bankName: "ICICI Bank",
        permissions: ["manage_clients", "create_workout_plans"],
        avatar: null,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Library Employee
      {
        id: "emp-2",
        vendorId: "vendor-1",
        userId: null,
        name: "Priya Sharma",
        email: "priya.sharma@library.com",
        phone: "+91 87654 32109",
        address: "B-45, Sunrise Apartments",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001",
        dateOfBirth: new Date("1992-08-22"),
        gender: "female",
        role: "Senior Librarian",
        department: "Books & Resources",
        joiningDate: new Date("2020-06-01"),
        employmentType: "full-time",
        shiftStartTime: "09:00 AM",
        shiftEndTime: "06:00 PM",
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        idProofType: "pan",
        idProofNumber: "ABCDE1234F",
        idProofDocument: null,
        certifications: [],
        basicSalary: 32000,
        bankAccountNumber: "9876543210",
        bankIfscCode: "HDFC0001234",
        bankName: "HDFC Bank",
        permissions: ["manage_books", "issue_library_cards"],
        avatar: null,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Coaching Center Employee
      {
        id: "emp-3",
        vendorId: "vendor-1",
        userId: null,
        name: "Amit Patel",
        email: "amit.patel@coaching.com",
        phone: "+91 76543 21098",
        address: "C-12, Education Hub Colony",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380001",
        dateOfBirth: new Date("1985-03-10"),
        gender: "male",
        role: "Mathematics Teacher",
        department: "Academics",
        joiningDate: new Date("2019-07-15"),
        employmentType: "full-time",
        shiftStartTime: "08:00 AM",
        shiftEndTime: "04:00 PM",
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        idProofType: "driving_license",
        idProofNumber: "GJ-01-2023-0012345",
        idProofDocument: null,
        certifications: [],
        basicSalary: 45000,
        bankAccountNumber: "1122334455",
        bankIfscCode: "SBI00001234",
        bankName: "State Bank of India",
        permissions: ["manage_students", "create_exams"],
        avatar: null,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Construction Company Employee
      {
        id: "emp-4",
        vendorId: "vendor-1",
        userId: null,
        name: "Vikram Singh",
        email: "vikram.singh@buildwell.com",
        phone: "+91 65432 10987",
        address: "Plot No. 15, Industrial Area",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411001",
        dateOfBirth: new Date("1980-11-28"),
        gender: "male",
        role: "Site Engineer",
        department: "Construction",
        joiningDate: new Date("2018-03-01"),
        employmentType: "full-time",
        shiftStartTime: "07:00 AM",
        shiftEndTime: "05:00 PM",
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        idProofType: "passport",
        idProofNumber: "P1234567",
        idProofDocument: null,
        certifications: [],
        basicSalary: 65000,
        bankAccountNumber: "5544332211",
        bankIfscCode: "AXIS0001234",
        bankName: "Axis Bank",
        permissions: ["manage_projects", "approve_materials"],
        avatar: null,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Part-time employee
      {
        id: "emp-5",
        vendorId: "vendor-1",
        userId: null,
        name: "Sneha Reddy",
        email: "sneha.reddy@work.com",
        phone: "+91 54321 09876",
        address: "Flat 22, Lake View Towers",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001",
        dateOfBirth: new Date("1995-07-18"),
        gender: "female",
        role: "Receptionist",
        department: "Administration",
        joiningDate: new Date("2023-01-10"),
        employmentType: "part-time",
        shiftStartTime: "09:00 AM",
        shiftEndTime: "01:00 PM",
        workingDays: ["Monday", "Wednesday", "Friday"],
        idProofType: "aadhar",
        idProofNumber: "9876-5432-1098",
        idProofDocument: null,
        certifications: [],
        basicSalary: 15000,
        bankAccountNumber: "6677889900",
        bankIfscCode: "KOTAK001234",
        bankName: "Kotak Mahindra Bank",
        permissions: ["manage_appointments"],
        avatar: null,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Inactive employee
      {
        id: "emp-6",
        vendorId: "vendor-1",
        userId: null,
        name: "Rahul Mehta",
        email: "rahul.mehta@company.com",
        phone: "+91 43210 98765",
        address: "House No. 8, Sector 12",
        city: "Noida",
        state: "Uttar Pradesh",
        pincode: "201301",
        dateOfBirth: new Date("1990-12-05"),
        gender: "male",
        role: "Sales Manager",
        department: "Sales",
        joiningDate: new Date("2021-04-01"),
        employmentType: "full-time",
        shiftStartTime: "10:00 AM",
        shiftEndTime: "07:00 PM",
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        idProofType: "pan",
        idProofNumber: "XYZAB5678C",
        idProofDocument: null,
        certifications: [],
        basicSalary: 50000,
        bankAccountNumber: "9988776655",
        bankIfscCode: "CITI0001234",
        bankName: "Citibank",
        permissions: ["manage_sales", "view_reports"],
        avatar: null,
        status: "inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleEmployees.forEach(emp => {
      this.employees.set(emp.id, emp);
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter((user) => user.role === role);
  }

  // Vendors
  async getVendor(id: string): Promise<Vendor | undefined> {
    return this.vendors.get(id);
  }

  async getVendorByUserId(userId: string): Promise<Vendor | undefined> {
    return Array.from(this.vendors.values()).find((vendor) => vendor.userId === userId);
  }

  async getAllVendors(): Promise<Vendor[]> {
    const vendors = Array.from(this.vendors.values());
    return vendors;
  }

  async createVendor(insertVendor: InsertVendor): Promise<Vendor> {
    const id = randomUUID();
    const now = new Date();
    const vendor: Vendor = { ...insertVendor, id, createdAt: now, updatedAt: now };
    this.vendors.set(id, vendor);
    return vendor;
  }

  async updateVendor(id: string, updates: Partial<InsertVendor>): Promise<Vendor | undefined> {
    const vendor = this.vendors.get(id);
    if (!vendor) return undefined;
    const updated = { ...vendor, ...updates, updatedAt: new Date() };
    this.vendors.set(id, updated);
    return updated;
  }

  // Categories
  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoriesByCreator(creatorId: string): Promise<Category[]> {
    // Return global categories + vendor's own categories
    return Array.from(this.categories.values()).filter(
      (c) => c.isGlobal || c.createdBy === creatorId
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const now = new Date();
    const category: Category = { ...insertCategory, id, createdAt: now, updatedAt: now };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: string, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    const updated = { ...category, ...updates, updatedAt: new Date() };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Subcategories
  async getSubcategory(id: string): Promise<Subcategory | undefined> {
    return this.subcategories.get(id);
  }

  async getAllSubcategories(): Promise<Subcategory[]> {
    return Array.from(this.subcategories.values());
  }

  async getSubcategoriesByCategory(categoryId: string): Promise<Subcategory[]> {
    return Array.from(this.subcategories.values()).filter(
      (s) => s.categoryId === categoryId
    );
  }

  async getSubcategoriesByCreator(creatorId: string, categoryId?: string): Promise<Subcategory[]> {
    let subcategories = Array.from(this.subcategories.values()).filter(
      (s) => s.isGlobal || s.createdBy === creatorId
    );
    if (categoryId) {
      subcategories = subcategories.filter((s) => s.categoryId === categoryId);
    }
    return subcategories;
  }

  async createSubcategory(insertSubcategory: InsertSubcategory): Promise<Subcategory> {
    const id = randomUUID();
    const now = new Date();
    const subcategory: Subcategory = { ...insertSubcategory, id, createdAt: now, updatedAt: now };
    this.subcategories.set(id, subcategory);
    return subcategory;
  }

  async updateSubcategory(id: string, updates: Partial<InsertSubcategory>): Promise<Subcategory | undefined> {
    const subcategory = this.subcategories.get(id);
    if (!subcategory) return undefined;
    const updated = { ...subcategory, ...updates, updatedAt: new Date() };
    this.subcategories.set(id, updated);
    return updated;
  }

  async deleteSubcategory(id: string): Promise<boolean> {
    return this.subcategories.delete(id);
  }

  // Brands
  private brands = new Map<string, Brand>();

  async getBrand(id: string): Promise<Brand | undefined> {
    return this.brands.get(id);
  }

  async getAllBrands(): Promise<Brand[]> {
    return Array.from(this.brands.values());
  }

  async getBrandsByCategory(categoryId: string): Promise<Brand[]> {
    return Array.from(this.brands.values()).filter(
      (b) => b.categoryId === categoryId
    );
  }

  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const id = randomUUID();
    const now = new Date();
    const brand: Brand = { ...insertBrand, id, createdAt: now, updatedAt: now };
    this.brands.set(id, brand);
    return brand;
  }

  async updateBrand(id: string, updates: Partial<InsertBrand>): Promise<Brand | undefined> {
    const brand = this.brands.get(id);
    if (!brand) return undefined;
    const updated = { ...brand, ...updates, updatedAt: new Date() };
    this.brands.set(id, updated);
    return updated;
  }

  async deleteBrand(id: string): Promise<boolean> {
    return this.brands.delete(id);
  }

  // Units
  async getUnit(id: string): Promise<Unit | undefined> {
    return this.units.get(id);
  }

  async getAllUnits(): Promise<Unit[]> {
    return Array.from(this.units.values());
  }

  async getUnitsBySubcategory(subcategoryId: string): Promise<Unit[]> {
    return Array.from(this.units.values()).filter(
      (u) => u.subcategoryId === subcategoryId
    );
  }

  async getUnitsByCreator(creatorId: string, subcategoryId?: string): Promise<Unit[]> {
    let units = Array.from(this.units.values()).filter(
      (u) => u.isGlobal || u.createdBy === creatorId
    );
    if (subcategoryId) {
      units = units.filter((u) => u.subcategoryId === subcategoryId);
    }
    return units;
  }

  async createUnit(insertUnit: InsertUnit): Promise<Unit> {
    const id = randomUUID();
    const now = new Date();
    const unit: Unit = { ...insertUnit, id, createdAt: now, updatedAt: now };
    this.units.set(id, unit);
    return unit;
  }

  async updateUnit(id: string, updates: Partial<InsertUnit>): Promise<Unit | undefined> {
    const unit = this.units.get(id);
    if (!unit) return undefined;
    const updated = { ...unit, ...updates, updatedAt: new Date() };
    this.units.set(id, updated);
    return updated;
  }

  async deleteUnit(id: string): Promise<boolean> {
    return this.units.delete(id);
  }

  // Master Services
  async getMasterService(id: string): Promise<MasterService | undefined> {
    return this.masterServices.get(id);
  }

  async getAllMasterServices(isUniversal?: boolean): Promise<MasterService[]> {
    const services = Array.from(this.masterServices.values());
    return isUniversal !== undefined ? services.filter((s) => s.isUniversal === isUniversal) : services;
  }

  async searchMasterServices(query: string): Promise<MasterService[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.masterServices.values()).filter(
      (s) =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.category.toLowerCase().includes(lowerQuery) ||
        s.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async createMasterService(insertService: InsertMasterService): Promise<MasterService> {
    const id = randomUUID();
    const now = new Date();
    const service: MasterService = { ...insertService, id, createdAt: now, updatedAt: now };
    this.masterServices.set(id, service);
    return service;
  }

  async updateMasterService(id: string, updates: Partial<InsertMasterService>): Promise<MasterService | undefined> {
    const service = this.masterServices.get(id);
    if (!service) return undefined;
    const updated = { ...service, ...updates, updatedAt: new Date() };
    this.masterServices.set(id, updated);
    return updated;
  }

  async deleteMasterService(id: string): Promise<boolean> {
    return this.masterServices.delete(id);
  }

  async duplicateMasterService(id: string): Promise<MasterService | undefined> {
    const original = this.masterServices.get(id);
    if (!original) return undefined;
    
    const newId = randomUUID();
    const now = new Date();
    const duplicated: MasterService = {
      ...original,
      id: newId,
      name: `${original.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };
    this.masterServices.set(newId, duplicated);
    return duplicated;
  }

  // Vendor Catalogues
  async getVendorCatalogue(id: string): Promise<VendorCatalogue | undefined> {
    return this.vendorCatalogues.get(id);
  }

  async getVendorCataloguesByVendor(vendorId: string): Promise<VendorCatalogue[]> {
    return Array.from(this.vendorCatalogues.values()).filter((c) => c.vendorId === vendorId);
  }

  async createVendorCatalogue(insertCatalogue: InsertVendorCatalogue): Promise<VendorCatalogue> {
    const id = randomUUID();
    const now = new Date();
    const catalogue: VendorCatalogue = { ...insertCatalogue, id, createdAt: now, updatedAt: now };
    this.vendorCatalogues.set(id, catalogue);
    return catalogue;
  }

  async updateVendorCatalogue(id: string, updates: Partial<InsertVendorCatalogue>): Promise<VendorCatalogue | undefined> {
    const catalogue = this.vendorCatalogues.get(id);
    if (!catalogue) return undefined;
    const updated = { ...catalogue, ...updates, updatedAt: new Date() };
    this.vendorCatalogues.set(id, updated);
    return updated;
  }

  async deleteVendorCatalogue(id: string): Promise<boolean> {
    return this.vendorCatalogues.delete(id);
  }

  async duplicateVendorCatalogue(id: string): Promise<VendorCatalogue | undefined> {
    const original = this.vendorCatalogues.get(id);
    if (!original) return undefined;
    
    const newId = randomUUID();
    const now = new Date();
    const duplicated: VendorCatalogue = {
      ...original,
      id: newId,
      name: `${original.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };
    this.vendorCatalogues.set(newId, duplicated);
    return duplicated;
  }

  // Custom Service Requests
  async getCustomServiceRequest(id: string): Promise<CustomServiceRequest | undefined> {
    return this.customServiceRequests.get(id);
  }

  async getCustomServiceRequestsByVendor(vendorId: string): Promise<CustomServiceRequest[]> {
    return Array.from(this.customServiceRequests.values()).filter((r) => r.vendorId === vendorId);
  }

  async getAllCustomServiceRequests(status?: string): Promise<CustomServiceRequest[]> {
    const requests = Array.from(this.customServiceRequests.values());
    return status ? requests.filter((r) => r.status === status) : requests;
  }

  async createCustomServiceRequest(insertRequest: InsertCustomServiceRequest): Promise<CustomServiceRequest> {
    const id = randomUUID();
    const now = new Date();
    const request: CustomServiceRequest = {
      ...insertRequest,
      id,
      createdAt: now,
      updatedAt: now,
      reviewedAt: null,
    };
    this.customServiceRequests.set(id, request);
    return request;
  }

  async updateCustomServiceRequest(
    id: string,
    updates: Partial<InsertCustomServiceRequest>
  ): Promise<CustomServiceRequest | undefined> {
    const request = this.customServiceRequests.get(id);
    if (!request) return undefined;
    const updated = { ...request, ...updates, updatedAt: new Date() };
    this.customServiceRequests.set(id, updated);
    return updated;
  }

  // Bookings (service bookings)
  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByVendor(vendorId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter((b) => b.vendorId === vendorId);
  }

  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const now = new Date();
    const booking: Booking = { ...insertBooking, id, createdAt: now, updatedAt: now };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBooking(id: string, updates: Partial<InsertBooking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    const updated = { ...booking, ...updates, updatedAt: new Date() };
    this.bookings.set(id, updated);
    return updated;
  }

  // Appointments (physical visit appointments)
  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async getAppointmentsByVendor(vendorId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter((a) => a.vendorId === vendorId);
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const now = new Date();
    const appointment: Appointment = { ...insertAppointment, id, createdAt: now, updatedAt: now };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(id: string, updates: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;
    const updated = { ...appointment, ...updates, updatedAt: new Date() };
    this.appointments.set(id, updated);
    return updated;
  }

  // Employees
  async getEmployee(id: string): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async getEmployeesByVendor(vendorId: string): Promise<Employee[]> {
    return Array.from(this.employees.values()).filter((e) => e.vendorId === vendorId);
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const id = randomUUID();
    const now = new Date();
    const employee: Employee = { ...insertEmployee, id, createdAt: now, updatedAt: now };
    this.employees.set(id, employee);
    return employee;
  }

  async updateEmployee(id: string, updates: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const employee = this.employees.get(id);
    if (!employee) return undefined;
    const updated = { ...employee, ...updates, updatedAt: new Date() };
    this.employees.set(id, updated);
    return updated;
  }

  async deleteEmployee(id: string): Promise<boolean> {
    return this.employees.delete(id);
  }

  // Tasks
  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTasksByVendor(vendorId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter((t) => t.vendorId === vendorId);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const now = new Date();
    const task: Task = { ...insertTask, id, createdAt: now, updatedAt: now, completedAt: null, verifiedAt: null };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    const updated = { ...task, ...updates, updatedAt: new Date() };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getTasksByEmployee(employeeId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter((t) => t.assignedTo === employeeId);
  }

  // Attendance
  async getAttendance(id: string): Promise<Attendance | undefined> {
    return this.attendance.get(id);
  }

  async getAttendanceByVendor(vendorId: string): Promise<Attendance[]> {
    return Array.from(this.attendance.values()).filter((a) => a.vendorId === vendorId);
  }

  async getAttendanceByEmployee(employeeId: string): Promise<Attendance[]> {
    return Array.from(this.attendance.values()).filter((a) => a.employeeId === employeeId);
  }

  async getAttendanceByDateRange(employeeId: string, startDate: Date, endDate: Date): Promise<Attendance[]> {
    return Array.from(this.attendance.values()).filter(
      (a) => a.employeeId === employeeId && a.date >= startDate && a.date <= endDate
    );
  }

  async createAttendance(insertAttendance: InsertAttendance): Promise<Attendance> {
    const id = randomUUID();
    const now = new Date();
    const attendance: Attendance = { ...insertAttendance, id, createdAt: now };
    this.attendance.set(id, attendance);
    return attendance;
  }

  async updateAttendance(id: string, updates: Partial<InsertAttendance>): Promise<Attendance | undefined> {
    const attendance = this.attendance.get(id);
    if (!attendance) return undefined;
    const updated = { ...attendance, ...updates };
    this.attendance.set(id, updated);
    return updated;
  }

  async deleteAttendance(id: string): Promise<boolean> {
    return this.attendance.delete(id);
  }

  // Leaves
  async getLeave(id: string): Promise<Leave | undefined> {
    return this.leaves.get(id);
  }

  async getLeavesByVendor(vendorId: string): Promise<Leave[]> {
    return Array.from(this.leaves.values()).filter((l) => l.vendorId === vendorId);
  }

  async getLeavesByEmployee(employeeId: string): Promise<Leave[]> {
    return Array.from(this.leaves.values()).filter((l) => l.employeeId === employeeId);
  }

  async createLeave(insertLeave: InsertLeave): Promise<Leave> {
    const id = randomUUID();
    const now = new Date();
    // Preserve approval fields if status is "approved"
    const leave: Leave = { 
      ...insertLeave, 
      id, 
      createdAt: now, 
      updatedAt: now,
      approvedBy: insertLeave.status === "approved" ? (insertLeave as any).approvedBy || null : null,
      approvedAt: insertLeave.status === "approved" ? ((insertLeave as any).approvedAt ? new Date((insertLeave as any).approvedAt) : now) : null,
    };
    this.leaves.set(id, leave);
    return leave;
  }

  async updateLeave(id: string, updates: Partial<InsertLeave>): Promise<Leave | undefined> {
    const leave = this.leaves.get(id);
    if (!leave) return undefined;
    const updated = { ...leave, ...updates, updatedAt: new Date() };
    this.leaves.set(id, updated);
    return updated;
  }

  async deleteLeave(id: string): Promise<boolean> {
    return this.leaves.delete(id);
  }

  // Leave Balances
  async getLeaveBalance(id: string): Promise<LeaveBalance | undefined> {
    return this.leaveBalances.get(id);
  }

  async getLeaveBalancesByEmployee(employeeId: string): Promise<LeaveBalance[]> {
    return Array.from(this.leaveBalances.values()).filter((lb) => lb.employeeId === employeeId);
  }

  async createLeaveBalance(insertBalance: InsertLeaveBalance): Promise<LeaveBalance> {
    const id = randomUUID();
    const balance: LeaveBalance = { ...insertBalance, id, updatedAt: new Date() };
    this.leaveBalances.set(id, balance);
    return balance;
  }

  async updateLeaveBalance(id: string, updates: Partial<InsertLeaveBalance>): Promise<LeaveBalance | undefined> {
    const balance = this.leaveBalances.get(id);
    if (!balance) return undefined;
    const updated = { ...balance, ...updates, updatedAt: new Date() };
    this.leaveBalances.set(id, updated);
    return updated;
  }

  // Payroll
  async getPayroll(id: string): Promise<Payroll | undefined> {
    return this.payroll.get(id);
  }

  async getPayrollByVendor(vendorId: string): Promise<Payroll[]> {
    return Array.from(this.payroll.values()).filter((p) => p.vendorId === vendorId);
  }

  async getPayrollByEmployee(employeeId: string): Promise<Payroll[]> {
    return Array.from(this.payroll.values()).filter((p) => p.employeeId === employeeId);
  }

  async createPayroll(insertPayroll: InsertPayroll): Promise<Payroll> {
    const id = randomUUID();
    const now = new Date();
    const payroll: Payroll = { ...insertPayroll, id, createdAt: now, updatedAt: now, paymentDate: null };
    this.payroll.set(id, payroll);
    return payroll;
  }

  async updatePayroll(id: string, updates: Partial<InsertPayroll>): Promise<Payroll | undefined> {
    const payroll = this.payroll.get(id);
    if (!payroll) return undefined;
    const updated = { ...payroll, ...updates, updatedAt: new Date() };
    this.payroll.set(id, updated);
    return updated;
  }

  async deletePayroll(id: string): Promise<boolean> {
    return this.payroll.delete(id);
  }

  // Holidays
  async getHoliday(id: string): Promise<Holiday | undefined> {
    return this.holidays.get(id);
  }

  async getHolidaysByVendor(vendorId: string): Promise<Holiday[]> {
    return Array.from(this.holidays.values()).filter((h) => h.vendorId === vendorId);
  }

  async createHoliday(insertHoliday: InsertHoliday): Promise<Holiday> {
    const id = randomUUID();
    const holiday: Holiday = { ...insertHoliday, id, createdAt: new Date() };
    this.holidays.set(id, holiday);
    return holiday;
  }

  async updateHoliday(id: string, updates: Partial<InsertHoliday>): Promise<Holiday | undefined> {
    const holiday = this.holidays.get(id);
    if (!holiday) return undefined;
    const updated = { ...holiday, ...updates };
    this.holidays.set(id, updated);
    return updated;
  }

  async deleteHoliday(id: string): Promise<boolean> {
    return this.holidays.delete(id);
  }

  // Coupons
  async getCoupon(id: string): Promise<Coupon | undefined> {
    return this.coupons.get(id);
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    return Array.from(this.coupons.values()).find((c) => c.code === code);
  }

  async getCouponsByVendor(vendorId: string): Promise<Coupon[]> {
    return Array.from(this.coupons.values()).filter((c) => c.vendorId === vendorId);
  }

  async validateCoupon(vendorId: string, code: string, subtotal: number): Promise<Coupon | null> {
    const coupon = await this.getCouponByCode(code);
    if (!coupon) return null;
    if (coupon.vendorId !== vendorId) return null;
    if (coupon.status !== "active") return null;
    if (new Date(coupon.expiryDate) < new Date()) return null;
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) return null;
    if (coupon.usedCount >= coupon.maxUsage) return null;
    
    return coupon;
  }

  async createCoupon(insertCoupon: InsertCoupon): Promise<Coupon> {
    const id = randomUUID();
    const now = new Date();
    const coupon: Coupon = { ...insertCoupon, id, createdAt: now, updatedAt: now };
    this.coupons.set(id, coupon);
    return coupon;
  }

  async updateCoupon(id: string, updates: Partial<InsertCoupon>): Promise<Coupon | undefined> {
    const coupon = this.coupons.get(id);
    if (!coupon) return undefined;
    const updated = { ...coupon, ...updates, updatedAt: new Date() };
    this.coupons.set(id, updated);
    return updated;
  }

  async deleteCoupon(id: string): Promise<boolean> {
    return this.coupons.delete(id);
  }

  // Transactions
  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getTransactionsByVendor(vendorId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter((t) => t.vendorId === vendorId);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = { ...insertTransaction, id, createdAt: new Date() };
    this.transactions.set(id, transaction);
    return transaction;
  }

  // Notifications
  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter((n) => n.userId === userId);
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = { ...insertNotification, id, createdAt: new Date() };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    notification.read = true;
    this.notifications.set(id, notification);
    return true;
  }

  // Master Products
  async getMasterProduct(id: string): Promise<MasterProduct | undefined> {
    return this.masterProducts.get(id);
  }

  async getAllMasterProducts(isUniversal?: boolean): Promise<MasterProduct[]> {
    const products = Array.from(this.masterProducts.values());
    return isUniversal !== undefined ? products.filter((p) => p.isUniversal === isUniversal) : products;
  }

  async createMasterProduct(insertProduct: InsertMasterProduct): Promise<MasterProduct> {
    const id = randomUUID();
    const now = new Date();
    const product: MasterProduct = { ...insertProduct, id, createdAt: now, updatedAt: now };
    this.masterProducts.set(id, product);
    return product;
  }

  async updateMasterProduct(id: string, updates: Partial<InsertMasterProduct>): Promise<MasterProduct | undefined> {
    const product = this.masterProducts.get(id);
    if (!product) return undefined;
    const updated = { ...product, ...updates, updatedAt: new Date() };
    this.masterProducts.set(id, updated);
    return updated;
  }

  async deleteMasterProduct(id: string): Promise<boolean> {
    return this.masterProducts.delete(id);
  }

  // Vendor Products
  async getVendorProduct(id: string): Promise<VendorProduct | undefined> {
    return this.vendorProducts.get(id);
  }

  async getVendorProductsByVendor(vendorId: string): Promise<VendorProduct[]> {
    return Array.from(this.vendorProducts.values()).filter((p) => p.vendorId === vendorId);
  }

  async createVendorProduct(insertProduct: InsertVendorProduct): Promise<VendorProduct> {
    const id = randomUUID();
    const now = new Date();
    const product: VendorProduct = { ...insertProduct, id, createdAt: now, updatedAt: now };
    this.vendorProducts.set(id, product);
    return product;
  }

  async updateVendorProduct(id: string, updates: Partial<InsertVendorProduct>): Promise<VendorProduct | undefined> {
    const product = this.vendorProducts.get(id);
    if (!product) return undefined;
    const updated = { ...product, ...updates, updatedAt: new Date() };
    this.vendorProducts.set(id, updated);
    return updated;
  }

  async deleteVendorProduct(id: string): Promise<boolean> {
    return this.vendorProducts.delete(id);
  }

  async getVendorProductsByMasterProduct(masterProductId: string): Promise<VendorProduct[]> {
    return Array.from(this.vendorProducts.values()).filter((p) => p.masterProductId === masterProductId);
  }

  async adoptMasterProduct(
    vendorId: string,
    masterProductId: string,
    customizations?: Partial<InsertVendorProduct>
  ): Promise<VendorProduct> {
    const masterProduct = await this.getMasterProduct(masterProductId);
    if (!masterProduct) {
      throw new Error("Master product not found");
    }

    const adoptedProduct: InsertVendorProduct = {
      vendorId,
      masterProductId,
      masterVersionAtAdoption: masterProduct.version,
      adoptedAt: new Date(),
      categoryId: masterProduct.categoryId,
      category: masterProduct.category,
      subcategoryId: masterProduct.subcategoryId,
      subcategory: masterProduct.subcategory,
      name: masterProduct.name,
      brand: masterProduct.brand,
      icon: masterProduct.icon,
      description: masterProduct.description,
      specifications: masterProduct.specifications,
      tags: masterProduct.tags,
      price: masterProduct.basePrice || 0,
      unit: masterProduct.unit,
      imageKeys: masterProduct.imageKeys,
      images: masterProduct.images,
      requiresPrescription: masterProduct.requiresPrescription,
      stock: 0,
      isActive: true,
      discountPercentage: 0,
      ...customizations,
    };

    return this.createVendorProduct(adoptedProduct);
  }

  // Orders
  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByVendor(vendorId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter((o) => o.vendorId === vendorId);
  }

  async getOrdersByVendorAndCustomer(vendorId: string, customerId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter((o) => 
      o.vendorId === vendorId && o.customerId === customerId
    );
  }


  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const now = new Date();
    const order: Order = { ...insertOrder, id, createdAt: now, updatedAt: now };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: string, updates: Partial<InsertOrder>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    const updated = { ...order, ...updates, updatedAt: new Date() };
    this.orders.set(id, updated);
    return updated;
  }

  // Order Items
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter((item) => item.orderId === orderId);
  }

  async createOrderItem(insertItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const now = new Date();
    const orderItem: OrderItem = { ...insertItem, id, createdAt: now };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  // Customers
  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getCustomersByVendor(vendorId: string, status?: string): Promise<Customer[]> {
    const customers = Array.from(this.customers.values()).filter((c) => c.vendorId === vendorId);
    return status ? customers.filter((c) => c.status === status) : customers;
  }

  async searchCustomers(vendorId: string, query: string): Promise<Customer[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.customers.values()).filter(
      (c) =>
        c.vendorId === vendorId &&
        (c.name.toLowerCase().includes(lowerQuery) ||
          c.phone.includes(query) ||
          c.email?.toLowerCase().includes(lowerQuery))
    );
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const now = new Date();
    const customer: Customer = { 
      ...insertCustomer, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomer(id: string, updates: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const customer = this.customers.get(id);
    if (!customer) return undefined;
    const updated = { ...customer, ...updates, updatedAt: new Date() };
    this.customers.set(id, updated);
    return updated;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    return this.customers.delete(id);
  }

  async getCustomerOrders(customerPhone: string, vendorId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.customerPhone === customerPhone && order.vendorId === vendorId
    );
  }

  async getCustomerBookings(customerPhone: string, vendorId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.patientPhone === customerPhone && booking.vendorId === vendorId
    );
  }

  // Admin: Get all customers across vendors with filtering
  async getAllCustomers(filters: Partial<AdminCustomersFilter>): Promise<{ customers: Customer[]; total: number }> {
    let customers = Array.from(this.customers.values());
    
    // Filter by vendor IDs
    if (filters.vendorIds && filters.vendorIds.length > 0) {
      customers = customers.filter((c) => filters.vendorIds!.includes(c.vendorId));
    }
    
    // Filter by customer type
    if (filters.customerType && filters.customerType.length > 0) {
      customers = customers.filter((c) => filters.customerType!.includes(c.customerType));
    }
    
    // Filter by status
    if (filters.status && filters.status.length > 0) {
      customers = customers.filter((c) => filters.status!.includes(c.status));
    }
    
    // Filter by membership type
    if (filters.membershipType && filters.membershipType.length > 0) {
      customers = customers.filter((c) => c.membershipType && filters.membershipType!.includes(c.membershipType));
    }
    
    // Filter by subscription status
    if (filters.subscriptionStatus && filters.subscriptionStatus.length > 0) {
      customers = customers.filter((c) => c.subscriptionStatus && filters.subscriptionStatus!.includes(c.subscriptionStatus));
    }
    
    // Filter by date range
    if (filters.dateRange) {
      if (filters.dateRange.start) {
        const startDate = new Date(filters.dateRange.start);
        customers = customers.filter((c) => new Date(c.createdAt) >= startDate);
      }
      if (filters.dateRange.end) {
        const endDate = new Date(filters.dateRange.end);
        customers = customers.filter((c) => new Date(c.createdAt) <= endDate);
      }
    }
    
    // Search filter
    if (filters.search) {
      const lowerQuery = filters.search.toLowerCase();
      customers = customers.filter((c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.phone.includes(filters.search!) ||
        c.email?.toLowerCase().includes(lowerQuery)
      );
    }
    
    const total = customers.length;
    
    // Sorting
    if (filters.sortBy) {
      const sortOrder = filters.sortOrder || 'desc';
      customers = customers.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (filters.sortBy) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'totalSpent':
            aValue = a.totalSpent || 0;
            bValue = b.totalSpent || 0;
            break;
          case 'lastVisit':
            aValue = a.lastVisit ? new Date(a.lastVisit).getTime() : 0;
            bValue = b.lastVisit ? new Date(b.lastVisit).getTime() : 0;
            break;
          case 'createdAt':
          default:
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
        }
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });
    }
    
    // Pagination
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    customers = customers.slice(offset, offset + limit);
    
    return { customers, total };
  }

  // Suppliers
  async getSupplier(id: string): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async getSuppliersByVendor(vendorId: string, filters?: { status?: string; category?: string }): Promise<Supplier[]> {
    let suppliers = Array.from(this.suppliers.values()).filter((s) => s.vendorId === vendorId);
    
    if (filters?.status) {
      suppliers = suppliers.filter((s) => s.status === filters.status);
    }
    
    if (filters?.category) {
      suppliers = suppliers.filter((s) => s.category === filters.category);
    }
    
    return suppliers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async searchSuppliers(vendorId: string, query: string): Promise<Supplier[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.suppliers.values()).filter(
      (s) => s.vendorId === vendorId &&
        (s.name.toLowerCase().includes(lowerQuery) ||
          s.businessName?.toLowerCase().includes(lowerQuery) ||
          s.phone.includes(query) ||
          s.email?.toLowerCase().includes(lowerQuery) ||
          s.contactPerson?.toLowerCase().includes(lowerQuery))
    );
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = randomUUID();
    const now = new Date();
    const supplier: Supplier = { 
      ...insertSupplier, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  async updateSupplier(id: string, updates: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const supplier = this.suppliers.get(id);
    if (!supplier) return undefined;
    const updated = { ...supplier, ...updates, updatedAt: new Date() };
    this.suppliers.set(id, updated);
    return updated;
  }

  async deleteSupplier(id: string): Promise<boolean> {
    return this.suppliers.delete(id);
  }

  // Supplier Payments
  async getSupplierPayment(id: string): Promise<SupplierPayment | undefined> {
    return this.supplierPayments.get(id);
  }

  async getSupplierPayments(supplierId: string): Promise<SupplierPayment[]> {
    return Array.from(this.supplierPayments.values())
      .filter((p) => p.supplierId === supplierId)
      .sort((a, b) => b.paymentDate.getTime() - a.paymentDate.getTime());
  }

  async getPaymentsByVendor(vendorId: string): Promise<SupplierPayment[]> {
    return Array.from(this.supplierPayments.values())
      .filter((p) => p.vendorId === vendorId)
      .sort((a, b) => b.paymentDate.getTime() - a.paymentDate.getTime());
  }

  async createSupplierPayment(insertPayment: InsertSupplierPayment): Promise<SupplierPayment> {
    const id = randomUUID();
    const now = new Date();
    const payment: SupplierPayment = { ...insertPayment, id, createdAt: now };
    this.supplierPayments.set(id, payment);

    // Update supplier's outstanding balance and last transaction date
    const supplier = await this.getSupplier(insertPayment.supplierId);
    if (supplier) {
      await this.updateSupplier(supplier.id, {
        outstandingBalance: Math.max(0, (supplier.outstandingBalance || 0) - insertPayment.amount),
        lastTransactionDate: insertPayment.paymentDate || now,
      });
    }

    return payment;
  }

  async deleteSupplierPayment(id: string): Promise<boolean> {
    const payment = this.supplierPayments.get(id);
    if (!payment) return false;

    // Update supplier's outstanding balance
    const supplier = await this.getSupplier(payment.supplierId);
    if (supplier) {
      await this.updateSupplier(supplier.id, {
        outstandingBalance: (supplier.outstandingBalance || 0) + payment.amount,
      });
    }

    return this.supplierPayments.delete(id);
  }

  // Expenses
  async getExpense(id: string): Promise<Expense | undefined> {
    return this.expenses.get(id);
  }

  async getExpensesByVendor(vendorId: string, filters?: { 
    category?: string; 
    paymentType?: string; 
    status?: string; 
    supplierId?: string; 
    department?: string;
    isRecurring?: boolean;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Expense[]> {
    let expenses = Array.from(this.expenses.values())
      .filter((e) => e.vendorId === vendorId);

    if (filters) {
      if (filters.category) {
        expenses = expenses.filter((e) => e.category === filters.category);
      }
      if (filters.paymentType) {
        expenses = expenses.filter((e) => e.paymentType === filters.paymentType);
      }
      if (filters.status) {
        expenses = expenses.filter((e) => e.status === filters.status);
      }
      if (filters.supplierId) {
        expenses = expenses.filter((e) => e.supplierId === filters.supplierId);
      }
      if (filters.department) {
        expenses = expenses.filter((e) => e.department === filters.department);
      }
      if (filters.isRecurring !== undefined) {
        expenses = expenses.filter((e) => e.isRecurring === filters.isRecurring);
      }
      if (filters.startDate) {
        expenses = expenses.filter((e) => e.expenseDate >= filters.startDate!);
      }
      if (filters.endDate) {
        expenses = expenses.filter((e) => e.expenseDate <= filters.endDate!);
      }
    }

    return expenses.sort((a, b) => b.expenseDate.getTime() - a.expenseDate.getTime());
  }

  async searchExpenses(vendorId: string, query: string): Promise<Expense[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.expenses.values())
      .filter(
        (e) =>
          e.vendorId === vendorId &&
          (e.title.toLowerCase().includes(lowerQuery) ||
           e.category.toLowerCase().includes(lowerQuery) ||
           e.paidTo?.toLowerCase().includes(lowerQuery) ||
           e.description?.toLowerCase().includes(lowerQuery) ||
           e.notes?.toLowerCase().includes(lowerQuery))
      )
      .sort((a, b) => b.expenseDate.getTime() - a.expenseDate.getTime());
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = randomUUID();
    const now = new Date();
    
    // Create ledger transaction for Hisab-Kitab integration
    // Map payment type to ledger payment method
    const paymentMethodMap: Record<string, string> = {
      'cash': 'cash',
      'upi': 'upi',
      'bank_transfer': 'bank',
      'card': 'card',
      'cheque': 'other',
      'wallet': 'other',
    };
    
    const ledgerTransaction = await this.createLedgerTransaction({
      vendorId: insertExpense.vendorId,
      customerId: null, // Expenses are business expenses, not customer-specific
      type: 'out', // Money going out
      amount: insertExpense.amount,
      transactionDate: insertExpense.expenseDate || now,
      category: 'expense',
      paymentMethod: paymentMethodMap[insertExpense.paymentType] || 'other',
      description: insertExpense.title,
      note: insertExpense.description || undefined,
      referenceType: 'expense',
      referenceId: id,
    });
    
    const expense: Expense = { 
      ...insertExpense, 
      id, 
      ledgerTransactionId: ledgerTransaction.id,
      createdAt: now, 
      updatedAt: now 
    };
    this.expenses.set(id, expense);

    // If linked to supplier, update supplier's total purchases
    if (insertExpense.supplierId) {
      const supplier = await this.getSupplier(insertExpense.supplierId);
      if (supplier) {
        await this.updateSupplier(supplier.id, {
          totalPurchases: (supplier.totalPurchases || 0) + insertExpense.amount,
          lastTransactionDate: insertExpense.expenseDate || now,
        });
      }
    }

    return expense;
  }

  async updateExpense(id: string, updates: Partial<InsertExpense>): Promise<Expense | undefined> {
    const expense = this.expenses.get(id);
    if (!expense) return undefined;

    const now = new Date();
    const updated = { ...expense, ...updates, updatedAt: now };
    
    // Update linked ledger transaction if financial fields changed
    if (expense.ledgerTransactionId) {
      const paymentMethodMap: Record<string, string> = {
        'cash': 'cash',
        'upi': 'upi',
        'bank_transfer': 'bank',
        'card': 'card',
        'cheque': 'other',
        'wallet': 'other',
      };
      
      // Build update payload with only defined values to avoid overwriting with undefined
      const ledgerUpdates: any = {};
      
      if (updates.amount !== undefined) {
        ledgerUpdates.amount = updates.amount;
      }
      
      if (updates.expenseDate !== undefined) {
        ledgerUpdates.transactionDate = updates.expenseDate;
      }
      
      if (updates.paymentType !== undefined) {
        ledgerUpdates.paymentMethod = paymentMethodMap[updates.paymentType] || 'other';
      }
      
      if (updates.title !== undefined) {
        ledgerUpdates.description = updates.title;
      }
      
      if (updates.description !== undefined) {
        ledgerUpdates.note = updates.description;
      }
      
      // Only update if there are actual changes
      if (Object.keys(ledgerUpdates).length > 0) {
        await this.updateLedgerTransaction(expense.ledgerTransactionId, ledgerUpdates);
      }
    }
    
    // Handle supplier changes and amount updates
    const oldSupplierId = expense.supplierId;
    const newSupplierId = updates.supplierId !== undefined ? updates.supplierId : oldSupplierId;
    const oldAmount = expense.amount;
    const newAmount = updates.amount !== undefined ? updates.amount : oldAmount;
    
    // If supplier changed, reverse old and apply new
    if (oldSupplierId !== newSupplierId) {
      // Remove from old supplier
      if (oldSupplierId) {
        const oldSupplier = await this.getSupplier(oldSupplierId);
        if (oldSupplier) {
          await this.updateSupplier(oldSupplier.id, {
            totalPurchases: Math.max(0, (oldSupplier.totalPurchases || 0) - oldAmount),
          });
        }
      }
      
      // Add to new supplier
      if (newSupplierId) {
        const newSupplier = await this.getSupplier(newSupplierId);
        if (newSupplier) {
          await this.updateSupplier(newSupplier.id, {
            totalPurchases: (newSupplier.totalPurchases || 0) + newAmount,
            lastTransactionDate: updates.expenseDate || expense.expenseDate || now,
          });
        }
      }
    } else if (oldSupplierId && oldAmount !== newAmount) {
      // Same supplier but amount changed
      const supplier = await this.getSupplier(oldSupplierId);
      if (supplier) {
        const amountDiff = newAmount - oldAmount;
        await this.updateSupplier(supplier.id, {
          totalPurchases: Math.max(0, (supplier.totalPurchases || 0) + amountDiff),
          lastTransactionDate: updates.expenseDate || expense.expenseDate || now,
        });
      }
    }
    
    this.expenses.set(id, updated);
    return updated;
  }

  async deleteExpense(id: string): Promise<boolean> {
    const expense = this.expenses.get(id);
    if (!expense) return false;

    // Delete linked ledger transaction if exists
    if (expense.ledgerTransactionId) {
      await this.deleteLedgerTransaction(expense.ledgerTransactionId);
    }

    // If linked to supplier, update supplier's total purchases
    if (expense.supplierId) {
      const supplier = await this.getSupplier(expense.supplierId);
      if (supplier) {
        await this.updateSupplier(supplier.id, {
          totalPurchases: Math.max(0, (supplier.totalPurchases || 0) - expense.amount),
        });
      }
    }

    return this.expenses.delete(id);
  }

  async getRecurringExpenses(vendorId: string): Promise<Expense[]> {
    return Array.from(this.expenses.values())
      .filter((e) => e.vendorId === vendorId && e.isRecurring)
      .sort((a, b) => b.expenseDate.getTime() - a.expenseDate.getTime());
  }

  async getUpcomingRecurringExpenses(vendorId: string, daysAhead: number = 30): Promise<Expense[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return Array.from(this.expenses.values())
      .filter((e) => 
        e.vendorId === vendorId && 
        e.isRecurring && 
        e.nextDueDate && 
        e.nextDueDate >= now && 
        e.nextDueDate <= futureDate
      )
      .sort((a, b) => (a.nextDueDate?.getTime() || 0) - (b.nextDueDate?.getTime() || 0));
  }

  async getExpensesBySupplier(supplierId: string): Promise<Expense[]> {
    return Array.from(this.expenses.values())
      .filter((e) => e.supplierId === supplierId)
      .sort((a, b) => b.expenseDate.getTime() - a.expenseDate.getTime());
  }

  // Customer Visits
  async getCustomerVisit(id: string): Promise<CustomerVisit | undefined> {
    return this.customerVisits.get(id);
  }

  async getCustomerVisits(customerId: string): Promise<CustomerVisit[]> {
    return Array.from(this.customerVisits.values())
      .filter((v) => v.customerId === customerId)
      .sort((a, b) => b.visitDate.getTime() - a.visitDate.getTime());
  }

  async getVisitsByVendor(vendorId: string): Promise<CustomerVisit[]> {
    return Array.from(this.customerVisits.values())
      .filter((v) => v.vendorId === vendorId)
      .sort((a, b) => b.visitDate.getTime() - a.visitDate.getTime());
  }

  async createCustomerVisit(insertVisit: InsertCustomerVisit): Promise<CustomerVisit> {
    const id = randomUUID();
    const now = new Date();
    const visit: CustomerVisit = { ...insertVisit, id, createdAt: now };
    this.customerVisits.set(id, visit);

    // Update customer's last visit date and total visits
    const customer = await this.getCustomer(insertVisit.customerId);
    if (customer) {
      await this.updateCustomer(customer.id, {
        lastVisitDate: insertVisit.visitDate || now,
        totalVisits: (customer.totalVisits || 0) + 1,
        totalSpent: (customer.totalSpent || 0) + (insertVisit.amountSpent || 0),
      });
    }

    return visit;
  }

  // Coupon Usages
  async getCouponUsages(couponId: string): Promise<CouponUsage[]> {
    return Array.from(this.couponUsages.values())
      .filter((u) => u.couponId === couponId)
      .sort((a, b) => b.usedAt.getTime() - a.usedAt.getTime());
  }

  async getCustomerCouponUsages(customerId: string): Promise<CouponUsage[]> {
    return Array.from(this.couponUsages.values())
      .filter((u) => u.customerId === customerId)
      .sort((a, b) => b.usedAt.getTime() - a.usedAt.getTime());
  }

  async createCouponUsage(insertUsage: InsertCouponUsage): Promise<CouponUsage> {
    const id = randomUUID();
    const now = new Date();
    const usage: CouponUsage = { ...insertUsage, id, usedAt: now };
    this.couponUsages.set(id, usage);

    // Update coupon usage count
    const coupon = this.coupons.get(insertUsage.couponId);
    if (coupon) {
      coupon.usedCount = (coupon.usedCount || 0) + 1;
      this.coupons.set(coupon.id, coupon);
    }

    return usage;
  }

  // Customer Tasks
  async getCustomerTask(id: string): Promise<CustomerTask | undefined> {
    return this.customerTasks.get(id);
  }

  async getCustomerTasks(customerId: string): Promise<CustomerTask[]> {
    return Array.from(this.customerTasks.values())
      .filter((t) => t.customerId === customerId)
      .sort((a, b) => {
        if (a.dueDate && b.dueDate) {
          return a.dueDate.getTime() - b.dueDate.getTime();
        }
        return 0;
      });
  }

  async getTasksByVendor(vendorId: string, status?: string): Promise<CustomerTask[]> {
    const tasks = Array.from(this.customerTasks.values()).filter((t) => t.vendorId === vendorId);
    return status ? tasks.filter((t) => t.status === status) : tasks;
  }

  async createCustomerTask(insertTask: InsertCustomerTask): Promise<CustomerTask> {
    const id = randomUUID();
    const now = new Date();
    const task: CustomerTask = { ...insertTask, id, createdAt: now, updatedAt: now };
    this.customerTasks.set(id, task);
    return task;
  }

  async updateCustomerTask(id: string, updates: Partial<InsertCustomerTask>): Promise<CustomerTask | undefined> {
    const task = this.customerTasks.get(id);
    if (!task) return undefined;
    const updated = { ...task, ...updates, updatedAt: new Date() };
    if (updates.status === "completed" && !updated.completedAt) {
      updated.completedAt = new Date();
    }
    this.customerTasks.set(id, updated);
    return updated;
  }

  async deleteCustomerTask(id: string): Promise<boolean> {
    return this.customerTasks.delete(id);
  }

  // ========== Lead Management Methods ==========

  async getLead(id: string): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async getLeadsByVendor(
    vendorId: string,
    filters?: { status?: string; source?: string; assignedEmployeeId?: string }
  ): Promise<Lead[]> {
    let leads = Array.from(this.leads.values()).filter((l) => l.vendorId === vendorId);
    
    if (filters?.status) {
      leads = leads.filter((l) => l.status === filters.status);
    }
    if (filters?.source) {
      leads = leads.filter((l) => l.source === filters.source);
    }
    if (filters?.assignedEmployeeId) {
      leads = leads.filter((l) => l.assignedEmployeeId === filters.assignedEmployeeId);
    }
    
    return leads;
  }

  async searchLeads(vendorId: string, query: string): Promise<Lead[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.leads.values()).filter(
      (lead) =>
        lead.vendorId === vendorId &&
        (lead.name.toLowerCase().includes(lowerQuery) ||
          lead.phone.includes(query) ||
          lead.email?.toLowerCase().includes(lowerQuery))
    );
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const now = new Date();
    const lead: Lead = { 
      ...insertLead, 
      id, 
      createdAt: now, 
      updatedAt: now,
      status: insertLead.status || "new",
      source: insertLead.source || "offline",
      priority: insertLead.priority || "medium",
      leadScore: insertLead.leadScore || 0,
      tags: insertLead.tags || [],
    };
    this.leads.set(id, lead);
    return lead;
  }

  async updateLead(id: string, updates: Partial<InsertLead>): Promise<Lead | undefined> {
    const lead = this.leads.get(id);
    if (!lead) return undefined;
    const updated = { ...lead, ...updates, updatedAt: new Date() };
    this.leads.set(id, updated);
    return updated;
  }

  async deleteLead(id: string): Promise<boolean> {
    return this.leads.delete(id);
  }

  async convertLeadToCustomer(leadId: string, customerId: string): Promise<Lead | undefined> {
    const lead = this.leads.get(leadId);
    if (!lead) return undefined;
    const updated = {
      ...lead,
      status: "converted",
      convertedToCustomerId: customerId,
      convertedAt: new Date(),
      updatedAt: new Date(),
    };
    this.leads.set(leadId, updated);
    return updated;
  }

  // Admin: Get all leads across vendors with filtering
  async getAllLeads(filters: Partial<AdminLeadsFilter>): Promise<{ leads: Lead[]; total: number }> {
    let leads = Array.from(this.leads.values());
    
    // Filter by vendor IDs
    if (filters.vendorIds && filters.vendorIds.length > 0) {
      leads = leads.filter((l) => filters.vendorIds!.includes(l.vendorId));
    }
    
    // Filter by vendor category
    if (filters.categories && filters.categories.length > 0) {
      leads = leads.filter((l) => {
        const vendor = this.vendors.get(l.vendorId);
        if (!vendor) return false;
        const vendorCategory = vendor.customCategory || vendor.category;
        return filters.categories!.includes(vendorCategory);
      });
    }
    
    // Filter by status
    if (filters.status && filters.status.length > 0) {
      leads = leads.filter((l) => filters.status!.includes(l.status));
    }
    
    // Filter by source
    if (filters.source && filters.source.length > 0) {
      leads = leads.filter((l) => filters.source!.includes(l.source));
    }
    
    // Filter by assigned employees (multi-select)
    if (filters.assignedEmployeeIds && filters.assignedEmployeeIds.length > 0) {
      leads = leads.filter((l) => l.assignedEmployeeId && filters.assignedEmployeeIds!.includes(l.assignedEmployeeId));
    }
    
    // Filter by priority
    if (filters.priority && filters.priority.length > 0) {
      leads = leads.filter((l) => filters.priority!.includes(l.priority));
    }
    
    // Filter by lead score range
    if (filters.leadScoreMin !== undefined) {
      leads = leads.filter((l) => l.leadScore !== null && l.leadScore !== undefined && l.leadScore >= filters.leadScoreMin!);
    }
    if (filters.leadScoreMax !== undefined) {
      leads = leads.filter((l) => l.leadScore !== null && l.leadScore !== undefined && l.leadScore <= filters.leadScoreMax!);
    }
    
    // Filter by date range
    if (filters.dateRange) {
      if (filters.dateRange.start) {
        const startDate = new Date(filters.dateRange.start);
        leads = leads.filter((l) => new Date(l.createdAt) >= startDate);
      }
      if (filters.dateRange.end) {
        const endDate = new Date(filters.dateRange.end);
        leads = leads.filter((l) => new Date(l.createdAt) <= endDate);
      }
    }
    
    // Search filter
    if (filters.search) {
      const lowerQuery = filters.search.toLowerCase();
      leads = leads.filter((l) =>
        l.name.toLowerCase().includes(lowerQuery) ||
        l.phone.includes(filters.search!) ||
        l.email?.toLowerCase().includes(lowerQuery)
      );
    }
    
    const total = leads.length;
    
    // Sorting
    if (filters.sortBy) {
      const sortOrder = filters.sortOrder || 'desc';
      leads = leads.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (filters.sortBy) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'leadScore':
            aValue = a.leadScore || 0;
            bValue = b.leadScore || 0;
            break;
          case 'nextFollowUpDate':
            aValue = a.nextFollowUpDate ? new Date(a.nextFollowUpDate).getTime() : 0;
            bValue = b.nextFollowUpDate ? new Date(b.nextFollowUpDate).getTime() : 0;
            break;
          case 'createdAt':
          default:
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
        }
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });
    }
    
    // Pagination
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    leads = leads.slice(offset, offset + limit);
    
    return { leads, total };
  }

  // ========== Demo Requests Methods ==========

  async getDemoRequest(id: string): Promise<DemoRequest | undefined> {
    return this.demoRequests.get(id);
  }

  async getAllDemoRequests(filters?: { status?: string }): Promise<DemoRequest[]> {
    let requests = Array.from(this.demoRequests.values());
    
    if (filters?.status) {
      requests = requests.filter(r => r.status === filters.status);
    }
    
    // Sort by createdAt descending (newest first)
    requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return requests;
  }

  async createDemoRequest(insertData: InsertDemoRequest): Promise<DemoRequest> {
    const id = randomUUID();
    const now = new Date();
    const demoRequest: DemoRequest = {
      ...insertData,
      id,
      status: insertData.status || "new",
      source: insertData.source || "landing_page",
      createdAt: now,
      updatedAt: now,
      email: insertData.email || null,
      businessName: insertData.businessName || null,
      notes: insertData.notes || null,
      scheduledAt: insertData.scheduledAt || null,
      completedAt: insertData.completedAt || null,
    };
    this.demoRequests.set(id, demoRequest);
    return demoRequest;
  }

  async updateDemoRequest(id: string, updates: Partial<InsertDemoRequest>): Promise<DemoRequest | undefined> {
    const existing = this.demoRequests.get(id);
    if (!existing) return undefined;
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.demoRequests.set(id, updated);
    return updated;
  }

  async deleteDemoRequest(id: string): Promise<boolean> {
    return this.demoRequests.delete(id);
  }

  // ========== Lead Communications Methods ==========

  async getLeadCommunication(id: string): Promise<LeadCommunication | undefined> {
    return this.leadCommunications.get(id);
  }

  async getLeadCommunications(leadId: string): Promise<LeadCommunication[]> {
    return Array.from(this.leadCommunications.values())
      .filter((c) => c.leadId === leadId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Most recent first
  }

  async createLeadCommunication(insertComm: InsertLeadCommunication): Promise<LeadCommunication> {
    const id = randomUUID();
    const now = new Date();
    const communication: LeadCommunication = {
      ...insertComm,
      id,
      createdAt: now,
      direction: insertComm.direction || "outbound",
      attachments: insertComm.attachments || [],
    };
    this.leadCommunications.set(id, communication);
    return communication;
  }

  // ========== Lead Tasks Methods ==========

  async getLeadTask(id: string): Promise<LeadTask | undefined> {
    return this.leadTasks.get(id);
  }

  async getLeadTasks(leadId: string, status?: string): Promise<LeadTask[]> {
    const tasks = Array.from(this.leadTasks.values()).filter((t) => t.leadId === leadId);
    return status ? tasks.filter((t) => t.status === status) : tasks;
  }

  async getLeadTasksByEmployee(employeeId: string): Promise<LeadTask[]> {
    return Array.from(this.leadTasks.values())
      .filter((t) => t.assignedTo === employeeId)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()); // Sort by due date
  }

  async createLeadTask(insertTask: InsertLeadTask): Promise<LeadTask> {
    const id = randomUUID();
    const now = new Date();
    const task: LeadTask = {
      ...insertTask,
      id,
      createdAt: now,
      updatedAt: now,
      type: insertTask.type || "follow_up",
      priority: insertTask.priority || "medium",
      status: insertTask.status || "pending",
      reminderEnabled: insertTask.reminderEnabled || false,
    };
    this.leadTasks.set(id, task);
    return task;
  }

  async updateLeadTask(id: string, updates: Partial<InsertLeadTask>): Promise<LeadTask | undefined> {
    const task = this.leadTasks.get(id);
    if (!task) return undefined;
    const updated = { ...task, ...updates, updatedAt: new Date() };
    if (updates.status === "completed" && !updated.completedAt) {
      updated.completedAt = new Date();
    }
    this.leadTasks.set(id, updated);
    return updated;
  }

  async deleteLeadTask(id: string): Promise<boolean> {
    return this.leadTasks.delete(id);
  }

  // Quotations
  async getQuotation(id: string): Promise<Quotation | undefined> {
    return this.quotations.get(id);
  }

  async getQuotationsByVendor(vendorId: string, filters?: { status?: string; customerId?: string }): Promise<Quotation[]> {
    let quotations = Array.from(this.quotations.values()).filter(q => q.vendorId === vendorId);
    
    if (filters?.status) {
      quotations = quotations.filter(q => q.status === filters.status);
    }
    
    if (filters?.customerId) {
      quotations = quotations.filter(q => q.customerId === filters.customerId);
    }
    
    return quotations.sort((a, b) => 
      new Date(b.quotationDate).getTime() - new Date(a.quotationDate).getTime()
    );
  }

  async getQuotationsByCustomer(customerId: string): Promise<Quotation[]> {
    return Array.from(this.quotations.values())
      .filter(q => q.customerId === customerId)
      .sort((a, b) => 
        new Date(b.quotationDate).getTime() - new Date(a.quotationDate).getTime()
      );
  }

  async createQuotation(insertQuotation: InsertQuotation): Promise<Quotation> {
    const id = randomUUID();
    const now = new Date();
    const quotation: Quotation = {
      ...insertQuotation,
      id,
      status: insertQuotation.status || "draft",
      subtotal: insertQuotation.subtotal || "0",
      taxAmount: insertQuotation.taxAmount || "0",
      discountAmount: insertQuotation.discountAmount || "0",
      additionalCharges: insertQuotation.additionalCharges || "0",
      totalAmount: insertQuotation.totalAmount || "0",
      createdAt: now,
      updatedAt: now,
    };
    this.quotations.set(id, quotation);
    return quotation;
  }

  async updateQuotation(id: string, updates: Partial<InsertQuotation>): Promise<Quotation | undefined> {
    const quotation = this.quotations.get(id);
    if (!quotation) return undefined;
    
    const updated = { ...quotation, ...updates, updatedAt: new Date() };
    
    // Update status-specific timestamps
    if (updates.status === "sent" && !updated.sentAt) {
      updated.sentAt = new Date();
    } else if (updates.status === "accepted" && !updated.acceptedAt) {
      updated.acceptedAt = new Date();
    } else if (updates.status === "rejected" && !updated.rejectedAt) {
      updated.rejectedAt = new Date();
    }
    
    this.quotations.set(id, updated);
    return updated;
  }

  async deleteQuotation(id: string): Promise<boolean> {
    // Delete associated items first
    const items = Array.from(this.quotationItems.values()).filter(item => item.quotationId === id);
    items.forEach(item => this.quotationItems.delete(item.id));
    
    return this.quotations.delete(id);
  }

  async generateQuotationNumber(vendorId: string): Promise<string> {
    const year = new Date().getFullYear();
    const vendorQuotations = Array.from(this.quotations.values())
      .filter(q => q.vendorId === vendorId && q.quotationNumber.includes(`QUO-${year}`));
    
    const nextNumber = vendorQuotations.length + 1;
    return `QUO-${year}-${String(nextNumber).padStart(4, '0')}`;
  }

  // Quotation Items
  async getQuotationItem(id: string): Promise<QuotationItem | undefined> {
    return this.quotationItems.get(id);
  }

  async getQuotationItems(quotationId: string): Promise<QuotationItem[]> {
    return Array.from(this.quotationItems.values())
      .filter(item => item.quotationId === quotationId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async createQuotationItem(insertItem: InsertQuotationItem): Promise<QuotationItem> {
    const id = randomUUID();
    const now = new Date();
    const item: QuotationItem = {
      ...insertItem,
      id,
      quantity: insertItem.quantity || "1",
      taxPercent: insertItem.taxPercent || "0",
      taxAmount: insertItem.taxAmount || "0",
      discountPercent: insertItem.discountPercent || "0",
      discountAmount: insertItem.discountAmount || "0",
      sortOrder: insertItem.sortOrder || 0,
      createdAt: now,
    };
    this.quotationItems.set(id, item);
    return item;
  }

  async updateQuotationItem(id: string, updates: Partial<InsertQuotationItem>): Promise<QuotationItem | undefined> {
    const item = this.quotationItems.get(id);
    if (!item) return undefined;
    const updated = { ...item, ...updates };
    this.quotationItems.set(id, updated);
    return updated;
  }

  async deleteQuotationItem(id: string): Promise<boolean> {
    return this.quotationItems.delete(id);
  }

  // Seed sample customers
  private seedSampleCustomers() {
    const sampleCustomers: Customer[] = [
      // Gym member
      {
        id: "cust-1",
        vendorId: "vendor-1",
        name: "Ananya Iyer",
        email: "ananya.iyer@email.com",
        phone: "+91 98765 12345",
        alternatePhone: null,
        dateOfBirth: new Date("1995-06-15"),
        gender: "female",
        address: "Flat 402, Skyline Apartments, Koramangala",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560034",
        membershipType: "Gold",
        membershipStartDate: new Date("2024-01-01"),
        membershipEndDate: new Date("2024-12-31"),
        subscriptionStatus: "active",
        activePackages: ["Personal Training - 12 sessions", "Group Classes - Unlimited"],
        servicesEnrolled: ["Yoga", "CrossFit", "Zumba"],
        customerType: "online",
        source: "Instagram Ad",
        referredBy: null,
        status: "active",
        lastVisitDate: new Date("2024-10-18"),
        totalVisits: 45,
        totalSpent: 25000,
        notes: "Prefers evening slots. Vegetarian diet preferences.",
        preferences: ["Evening workouts", "High-intensity training"],
        allergies: [],
        emergencyContactName: "Raj Iyer",
        emergencyContactPhone: "+91 98765 54321",
        documents: [],
        avatar: null,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date(),
      },
      // Library member
      {
        id: "cust-2",
        vendorId: "vendor-1",
        name: "Rohan Malhotra",
        email: "rohan.m@email.com",
        phone: "+91 87654 32198",
        alternatePhone: null,
        dateOfBirth: new Date("2008-03-22"),
        gender: "male",
        address: "C-12, Green Park Society",
        city: "Delhi",
        state: "Delhi",
        pincode: "110016",
        membershipType: "Student",
        membershipStartDate: new Date("2024-04-01"),
        membershipEndDate: new Date("2025-03-31"),
        subscriptionStatus: "active",
        activePackages: ["Annual Student Membership"],
        servicesEnrolled: ["Reference Section Access", "Computer Lab"],
        customerType: "walk-in",
        source: "School referral",
        referredBy: null,
        status: "active",
        lastVisitDate: new Date("2024-10-19"),
        totalVisits: 120,
        totalSpent: 500,
        notes: "Interested in science fiction and technology books.",
        preferences: ["Weekend visits", "Digital resources"],
        allergies: [],
        emergencyContactName: "Mrs. Malhotra",
        emergencyContactPhone: "+91 98765 43210",
        documents: [],
        avatar: null,
        createdAt: new Date("2024-04-01"),
        updatedAt: new Date(),
      },
      // Coaching student
      {
        id: "cust-3",
        vendorId: "vendor-1",
        name: "Priya Deshmukh",
        email: "priya.d@email.com",
        phone: "+91 76543 21087",
        alternatePhone: "+91 76543 21088",
        dateOfBirth: new Date("2009-11-30"),
        gender: "female",
        address: "B-45, Education Hub, Satellite Road",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380015",
        membershipType: "Premium",
        membershipStartDate: new Date("2024-06-01"),
        membershipEndDate: new Date("2025-05-31"),
        subscriptionStatus: "active",
        activePackages: ["JEE Main + Advanced Batch 2025"],
        servicesEnrolled: ["Mathematics", "Physics", "Chemistry"],
        customerType: "referral",
        source: "Parent referral",
        referredBy: null,
        status: "active",
        lastVisitDate: new Date("2024-10-19"),
        totalVisits: 85,
        totalSpent: 45000,
        notes: "Strong in Mathematics. Needs extra help in Organic Chemistry.",
        preferences: ["Morning batches", "Small group classes"],
        allergies: [],
        emergencyContactName: "Mr. Deshmukh",
        emergencyContactPhone: "+91 98765 67890",
        documents: ["aadhar_priya.pdf"],
        avatar: null,
        createdAt: new Date("2024-06-01"),
        updatedAt: new Date(),
      },
      // Construction client
      {
        id: "cust-4",
        vendorId: "vendor-1",
        name: "Sunita Enterprises",
        email: "sunita.ent@business.com",
        phone: "+91 91234 56789",
        alternatePhone: "+91 91234 56780",
        dateOfBirth: null,
        gender: null,
        address: "Plot 23, Industrial Area Phase 2",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411019",
        membershipType: "Corporate",
        membershipStartDate: null,
        membershipEndDate: null,
        subscriptionStatus: null,
        activePackages: ["Residential Project - Viman Nagar"],
        servicesEnrolled: ["Construction", "Interior Design", "Landscaping"],
        customerType: "corporate",
        source: "Business network",
        referredBy: null,
        status: "active",
        lastVisitDate: new Date("2024-10-15"),
        totalVisits: 12,
        totalSpent: 2500000,
        notes: "Major client. Premium villa project. Payment terms: 30 days.",
        preferences: ["Monthly progress meetings", "Digital documentation"],
        allergies: [],
        emergencyContactName: "Ramesh Patil",
        emergencyContactPhone: "+91 98765 11111",
        documents: ["gst_certificate.pdf", "pan_card.pdf"],
        avatar: null,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date(),
      },
      // Inactive customer (pending follow-up)
      {
        id: "cust-5",
        vendorId: "vendor-1",
        name: "Vikram Singh",
        email: "vikram.s@email.com",
        phone: "+91 82345 67890",
        alternatePhone: null,
        dateOfBirth: new Date("1988-08-10"),
        gender: "male",
        address: "House No. 45, Sector 18",
        city: "Noida",
        state: "Uttar Pradesh",
        pincode: "201301",
        membershipType: "Basic",
        membershipStartDate: new Date("2024-01-01"),
        membershipEndDate: new Date("2024-06-30"),
        subscriptionStatus: "expired",
        activePackages: [],
        servicesEnrolled: [],
        customerType: "online",
        source: "Google Search",
        referredBy: null,
        status: "pending_followup",
        lastVisitDate: new Date("2024-06-28"),
        totalVisits: 15,
        totalSpent: 8000,
        notes: "Membership expired. Last visited in June. Follow up for renewal.",
        preferences: [],
        allergies: [],
        emergencyContactName: null,
        emergencyContactPhone: null,
        documents: [],
        avatar: null,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date(),
      },
    ];

    sampleCustomers.forEach(customer => {
      this.customers.set(customer.id, customer);
    });
  }

  private seedSampleCoupons() {
    const sampleCoupons: Coupon[] = [
      {
        id: "coup-1",
        vendorId: "vendor-1",
        code: "WELCOME20",
        description: "Welcome offer! Get 20% off on your first purchase of lab tests",
        image: null,
        discountType: "percentage",
        discountValue: 20,
        minOrderAmount: 500,
        expiryDate: new Date("2025-12-31"),
        maxUsage: 100,
        usedCount: 23,
        status: "active",
        applicationType: "all",
        applicableServices: [],
        applicableProducts: [],
        applicableCategories: [],
        createdAt: new Date("2024-10-01"),
        updatedAt: new Date(),
      },
      {
        id: "coup-2",
        vendorId: "vendor-1",
        code: "HEALTH50",
        description: "Flat ₹50 off on health checkup packages",
        image: null,
        discountType: "fixed",
        discountValue: 50,
        minOrderAmount: 200,
        expiryDate: new Date("2025-06-30"),
        maxUsage: 200,
        usedCount: 87,
        status: "active",
        applicationType: "specific_category",
        applicableServices: [],
        applicableProducts: [],
        applicableCategories: ["healthcare", "diagnostics"],
        createdAt: new Date("2024-09-15"),
        updatedAt: new Date(),
      },
      {
        id: "coup-3",
        vendorId: "vendor-1",
        code: "DIWALI30",
        description: "Diwali special! 30% discount on all products and services",
        image: null,
        discountType: "percentage",
        discountValue: 30,
        minOrderAmount: 1000,
        expiryDate: new Date("2024-11-15"),
        maxUsage: 50,
        usedCount: 45,
        status: "active",
        applicationType: "all",
        applicableServices: [],
        applicableProducts: [],
        applicableCategories: [],
        createdAt: new Date("2024-10-20"),
        updatedAt: new Date(),
      },
      {
        id: "coup-4",
        vendorId: "vendor-1",
        code: "SAVE100",
        description: "Save ₹100 on medicine orders above ₹800",
        image: null,
        discountType: "fixed",
        discountValue: 100,
        minOrderAmount: 800,
        expiryDate: new Date("2025-03-31"),
        maxUsage: 150,
        usedCount: 42,
        status: "active",
        applicationType: "specific_products",
        applicableServices: [],
        applicableProducts: ["vp-1", "vp-2", "vp-3"],
        applicableCategories: [],
        createdAt: new Date("2024-10-10"),
        updatedAt: new Date(),
      },
      {
        id: "coup-5",
        vendorId: "vendor-1",
        code: "SUNDAY15",
        description: "Sunday special - 15% off on all lab tests",
        image: null,
        discountType: "percentage",
        discountValue: 15,
        minOrderAmount: 300,
        expiryDate: new Date("2025-12-31"),
        maxUsage: 500,
        usedCount: 234,
        status: "active",
        applicationType: "specific_category",
        applicableServices: [],
        applicableProducts: [],
        applicableCategories: ["lab", "diagnostics"],
        createdAt: new Date("2024-08-01"),
        updatedAt: new Date(),
      },
      {
        id: "coup-6",
        vendorId: "vendor-1",
        code: "FIRST200",
        description: "₹200 off for first time customers on orders above ₹1500",
        image: null,
        discountType: "fixed",
        discountValue: 200,
        minOrderAmount: 1500,
        expiryDate: new Date("2025-12-31"),
        maxUsage: 1000,
        usedCount: 156,
        status: "active",
        applicationType: "all",
        applicableServices: [],
        applicableProducts: [],
        applicableCategories: [],
        createdAt: new Date("2024-07-01"),
        updatedAt: new Date(),
      },
      {
        id: "coup-7",
        vendorId: "vendor-1",
        code: "NEWYEAR2025",
        description: "New Year Sale - 25% off on selected vitamins and supplements",
        image: null,
        discountType: "percentage",
        discountValue: 25,
        minOrderAmount: 600,
        expiryDate: new Date("2025-01-15"),
        maxUsage: 300,
        usedCount: 178,
        status: "active",
        applicationType: "specific_products",
        applicableServices: [],
        applicableProducts: ["vp-2", "vp-5", "vp-7"],
        applicableCategories: [],
        createdAt: new Date("2024-12-20"),
        updatedAt: new Date(),
      },
      {
        id: "coup-8",
        vendorId: "vendor-1",
        code: "SUMMER10",
        description: "Summer cooldown - 10% off on immunity boosters",
        image: null,
        discountType: "percentage",
        discountValue: 10,
        minOrderAmount: 400,
        expiryDate: new Date("2024-11-01"),
        maxUsage: 100,
        usedCount: 100,
        status: "inactive",
        applicationType: "specific_category",
        applicableServices: [],
        applicableProducts: [],
        applicableCategories: ["supplements", "healthcare"],
        createdAt: new Date("2024-05-01"),
        updatedAt: new Date(),
      },
      {
        id: "coup-9",
        vendorId: "vendor-1",
        code: "MEGA500",
        description: "Mega discount! ₹500 off on purchases above ₹5000",
        image: null,
        discountType: "fixed",
        discountValue: 500,
        minOrderAmount: 5000,
        expiryDate: new Date("2025-12-31"),
        maxUsage: 50,
        usedCount: 12,
        status: "active",
        applicationType: "all",
        applicableServices: [],
        applicableProducts: [],
        applicableCategories: [],
        createdAt: new Date("2024-10-25"),
        updatedAt: new Date(),
      },
      {
        id: "coup-10",
        vendorId: "vendor-1",
        code: "EXPIRED50",
        description: "This coupon has expired - 50% off",
        image: null,
        discountType: "percentage",
        discountValue: 50,
        minOrderAmount: 0,
        expiryDate: new Date("2024-10-01"),
        maxUsage: 100,
        usedCount: 89,
        status: "active",
        applicationType: "all",
        applicableServices: [],
        applicableProducts: [],
        applicableCategories: [],
        createdAt: new Date("2024-08-01"),
        updatedAt: new Date(),
      },
      {
        id: "coup-11",
        vendorId: "vendor-1",
        code: "PREMIUM25",
        description: "Premium membership benefit - 25% off on all diagnostic services",
        image: null,
        discountType: "percentage",
        discountValue: 25,
        minOrderAmount: 0,
        expiryDate: new Date("2025-12-31"),
        maxUsage: 1000,
        usedCount: 345,
        status: "active",
        applicationType: "specific_services",
        applicableServices: ["vc-1", "vc-2"],
        applicableProducts: [],
        applicableCategories: [],
        createdAt: new Date("2024-06-01"),
        updatedAt: new Date(),
      },
      {
        id: "coup-12",
        vendorId: "vendor-1",
        code: "FLASH75",
        description: "Flash sale! ₹75 instant discount on orders above ₹600",
        image: null,
        discountType: "fixed",
        discountValue: 75,
        minOrderAmount: 600,
        expiryDate: new Date("2025-11-30"),
        maxUsage: 200,
        usedCount: 67,
        status: "active",
        applicationType: "all",
        applicableServices: [],
        applicableProducts: [],
        applicableCategories: [],
        createdAt: new Date("2024-10-15"),
        updatedAt: new Date(),
      },
    ];

    sampleCoupons.forEach(coupon => {
      this.coupons.set(coupon.id, coupon);
    });
  }

  private seedSampleMasterServices() {
    const sampleServices: MasterService[] = [
      {
        id: "ms-1",
        name: "Classic Home Cleaning",
        category: "Home Cleaning",
        icon: "🏠",
        description: "Professional home cleaning service for your entire house. Our trained professionals will deep clean your home to make it spotless.",
        inclusions: [
          "Dusting & Vacuuming",
          "Mopping all floors",
          "Bathroom cleaning",
          "Kitchen cleaning",
          "Balcony cleaning"
        ],
        exclusions: ["Deep cleaning", "Carpet shampooing", "Appliance cleaning"],
        tags: ["cleaning", "home", "maintenance"],
        sampleType: null,
        tat: "2-3 hours",
        basePrice: 599,
        isUniversal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "ms-2",
        name: "Bathroom Deep Cleaning",
        category: "Home Cleaning",
        icon: "🚿",
        description: "Intensive deep cleaning for bathrooms. Remove tough stains, soap scum, and limescale buildup.",
        inclusions: [
          "Toilet deep scrubbing",
          "Tiles & grout cleaning",
          "Sink & faucet polishing",
          "Mirror cleaning",
          "Exhaust fan cleaning"
        ],
        exclusions: ["Plumbing repairs", "Replacement of fixtures"],
        tags: ["cleaning", "bathroom", "deep-clean"],
        sampleType: null,
        tat: "1-1.5 hours",
        basePrice: 449,
        isUniversal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "ms-3",
        name: "Kitchen Deep Cleaning",
        category: "Home Cleaning",
        icon: "🍳",
        description: "Complete kitchen deep cleaning including chimney, stove, and cabinets",
        inclusions: [
          "Chimney cleaning",
          "Gas stove deep cleaning",
          "Countertop sanitization",
          "Cabinet exterior cleaning",
          "Sink & drain cleaning"
        ],
        exclusions: ["Appliance servicing", "Pest control"],
        tags: ["cleaning", "kitchen", "deep-clean"],
        sampleType: null,
        tat: "2-3 hours",
        basePrice: 849,
        isUniversal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "ms-4",
        name: "AC Service & Repair",
        category: "Appliance Repair",
        icon: "❄️",
        description: "Complete AC servicing including gas check, filter cleaning, and repairs",
        inclusions: [
          "Filter cleaning",
          "Coil cleaning",
          "Gas level check",
          "Cooling check",
          "90-day warranty"
        ],
        exclusions: ["Gas refilling", "Spare parts"],
        tags: ["ac", "repair", "service"],
        sampleType: null,
        tat: "1-2 hours",
        basePrice: 399,
        isUniversal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "ms-5",
        name: "Washing Machine Repair",
        category: "Appliance Repair",
        icon: "🧺",
        description: "Expert washing machine repair for all brands. Quick diagnosis and repair.",
        inclusions: [
          "Free inspection",
          "Problem diagnosis",
          "Repair/replacement",
          "Testing after repair",
          "30-day service warranty"
        ],
        exclusions: ["Spare parts cost", "Installation"],
        tags: ["washing-machine", "repair", "appliance"],
        sampleType: null,
        tat: "1-2 hours",
        basePrice: 299,
        isUniversal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "ms-6",
        name: "Sofa Cleaning (3-seater)",
        category: "Home Cleaning",
        icon: "🛋️",
        description: "Professional sofa dry cleaning service with stain removal",
        inclusions: [
          "Dry vacuuming",
          "Stain removal",
          "Fabric shampooing",
          "Odor removal",
          "Sanitization"
        ],
        exclusions: ["Pet hair removal", "Leather polishing"],
        tags: ["cleaning", "sofa", "upholstery"],
        sampleType: null,
        tat: "1-2 hours",
        basePrice: 999,
        isUniversal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "ms-7",
        name: "Plumbing Services",
        category: "Home Repairs",
        icon: "🔧",
        description: "Expert plumbing services for leaks, installations, and repairs",
        inclusions: [
          "Leak detection & repair",
          "Tap & mixer installation",
          "Pipe repair/replacement",
          "Drain unclogging",
          "Free inspection"
        ],
        exclusions: ["Material cost", "Major installations"],
        tags: ["plumbing", "repair", "home-service"],
        sampleType: null,
        tat: "1-2 hours",
        basePrice: 199,
        isUniversal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "ms-8",
        name: "Electrical Services",
        category: "Home Repairs",
        icon: "⚡",
        description: "Professional electrical repair and installation services",
        inclusions: [
          "Switch/socket repair",
          "Fan installation",
          "Light fixture installation",
          "Wiring inspection",
          "MCB replacement"
        ],
        exclusions: ["Major rewiring", "Appliance repair"],
        tags: ["electrical", "repair", "home-service"],
        sampleType: null,
        tat: "1-2 hours",
        basePrice: 199,
        isUniversal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "ms-9",
        name: "Wall Painting - 1 BHK",
        category: "Painting",
        icon: "🎨",
        description: "Professional wall painting service for 1 BHK apartment with premium finish",
        inclusions: [
          "Wall preparation",
          "2 coats of paint",
          "Premium emulsion",
          "Furniture covering",
          "2-year warranty"
        ],
        exclusions: ["Ceiling painting", "Putty work"],
        tags: ["painting", "home-improvement", "decoration"],
        sampleType: null,
        tat: "3-4 days",
        basePrice: 8999,
        isUniversal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "ms-10",
        name: "Pest Control - Cockroaches",
        category: "Pest Control",
        icon: "🪳",
        description: "Effective cockroach control with gel treatment and spray",
        inclusions: [
          "Gel treatment",
          "Spray in hidden areas",
          "Kitchen treatment",
          "Bathroom treatment",
          "30-day warranty"
        ],
        exclusions: ["Deep infestation treatment"],
        tags: ["pest-control", "cockroach", "home-service"],
        sampleType: null,
        tat: "1-2 hours",
        basePrice: 699,
        isUniversal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "ms-11",
        name: "Pest Control - Bed Bugs",
        category: "Pest Control",
        icon: "🛏️",
        description: "Complete bed bug elimination with chemical spray treatment",
        inclusions: [
          "Mattress treatment",
          "Bed frame treatment",
          "Room corners spray",
          "Furniture treatment",
          "60-day warranty"
        ],
        exclusions: ["Repeat visits"],
        tags: ["pest-control", "bed-bugs", "home-service"],
        sampleType: null,
        tat: "1-2 hours",
        basePrice: 1499,
        isUniversal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "ms-12",
        name: "Carpentry Services",
        category: "Home Repairs",
        icon: "🪚",
        description: "Professional carpentry work for furniture repair and installation",
        inclusions: [
          "Furniture repair",
          "Door/window fixing",
          "Handle installation",
          "Hinge replacement",
          "Lock installation"
        ],
        exclusions: ["Custom furniture making", "Material cost"],
        tags: ["carpentry", "repair", "furniture"],
        sampleType: null,
        tat: "1-2 hours",
        basePrice: 199,
        isUniversal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "ms-13",
        name: "Salon at Home - Women",
        category: "Beauty & Wellness",
        icon: "💅",
        description: "Professional beauty services at your doorstep for women",
        inclusions: [
          "Hair care services",
          "Facial & cleanup",
          "Waxing services",
          "Manicure & pedicure",
          "Threading & bleach"
        ],
        exclusions: ["Bridal packages", "Hair coloring"],
        tags: ["salon", "beauty", "women"],
        sampleType: null,
        tat: "1-2 hours",
        basePrice: 599,
        isUniversal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "ms-14",
        name: "Haircut at Home - Men",
        category: "Beauty & Wellness",
        icon: "✂️",
        description: "Professional haircut and grooming services for men at home",
        inclusions: [
          "Haircut as per style",
          "Beard trimming",
          "Head massage",
          "Hair wash",
          "Styling"
        ],
        exclusions: ["Hair coloring", "Advanced styling"],
        tags: ["haircut", "grooming", "men"],
        sampleType: null,
        tat: "45 minutes",
        basePrice: 299,
        isUniversal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "ms-15",
        name: "RO Water Purifier Service",
        category: "Appliance Repair",
        icon: "💧",
        description: "Complete RO water purifier servicing and maintenance",
        inclusions: [
          "Filter replacement",
          "Membrane cleaning",
          "TDS check",
          "Sanitization",
          "Water quality test"
        ],
        exclusions: ["Spare parts", "Major repairs"],
        tags: ["ro", "water-purifier", "service"],
        sampleType: null,
        tat: "1-2 hours",
        basePrice: 349,
        isUniversal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleServices.forEach(service => {
      this.masterServices.set(service.id, service);
    });
  }

  private seedSampleVendorCatalogues() {
    const sampleCatalogues: VendorCatalogue[] = [
      {
        id: "vc-1",
        vendorId: "vendor-1",
        masterServiceId: "ms-1",
        name: "Expert Consultation",
        price: 750,
        category: "services",
        description: "Professional one-on-one consultation for your specific needs",
        image: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vc-2",
        vendorId: "vendor-1",
        masterServiceId: "ms-2",
        name: "Personal Training",
        price: 1000,
        category: "training",
        description: "Customized individual training with progress tracking",
        image: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vc-3",
        vendorId: "vendor-1",
        masterServiceId: "ms-3",
        name: "Group Class",
        price: 450,
        category: "training",
        description: "Interactive group session with expert guidance",
        image: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vc-4",
        vendorId: "vendor-1",
        masterServiceId: "ms-4",
        name: "Professional Assessment",
        price: 1400,
        category: "assessment",
        description: "Comprehensive evaluation with detailed recommendations",
        image: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vc-5",
        vendorId: "vendor-1",
        masterServiceId: "ms-5",
        name: "Monthly Access Pass",
        price: 1800,
        category: "membership",
        description: "Full access for one month with member benefits",
        image: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vc-6",
        vendorId: "vendor-1",
        masterServiceId: "ms-6",
        name: "Equipment Hire",
        price: 450,
        category: "rental",
        description: "Quality equipment rental with support and maintenance",
        image: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vc-7",
        vendorId: "vendor-1",
        masterServiceId: "ms-7",
        name: "On-Site Survey",
        price: 2200,
        category: "assessment",
        description: "Detailed site inspection with comprehensive report",
        image: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vc-8",
        vendorId: "vendor-1",
        masterServiceId: "ms-8",
        name: "Online Access",
        price: 250,
        category: "digital",
        description: "Full digital resources and online platform access",
        image: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vc-9",
        vendorId: "vendor-1",
        masterServiceId: "ms-9",
        name: "Hands-On Workshop",
        price: 1300,
        category: "events",
        description: "Interactive workshop with certificate and materials",
        image: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vc-10",
        vendorId: "vendor-1",
        masterServiceId: "ms-10",
        name: "Project Planning Service",
        price: 4500,
        category: "planning",
        description: "End-to-end project planning with timeline and budget",
        image: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vc-11",
        vendorId: "vendor-1",
        masterServiceId: "ms-11",
        name: "Standard Checkup",
        price: 550,
        category: "services",
        description: "Basic inspection and assessment service",
        image: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vc-12",
        vendorId: "vendor-1",
        masterServiceId: "ms-12",
        name: "3-Month Package",
        price: 5000,
        category: "membership",
        description: "Quarterly membership with all premium benefits",
        image: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vc-13",
        vendorId: "vendor-1",
        masterServiceId: "ms-13",
        name: "Private Room Booking",
        price: 180,
        category: "rental",
        description: "Hourly private room with WiFi and amenities",
        image: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vc-14",
        vendorId: "vendor-1",
        masterServiceId: "ms-14",
        name: "Nutrition Consultation",
        price: 1600,
        category: "wellness",
        description: "Personalized diet planning with ongoing support",
        image: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "vc-15",
        vendorId: "vendor-1",
        masterServiceId: "ms-15",
        name: "VIP Annual Membership",
        price: 18000,
        category: "membership",
        description: "Premium yearly access with exclusive VIP privileges",
        image: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleCatalogues.forEach(catalogue => {
      this.vendorCatalogues.set(catalogue.id, catalogue);
    });
  }

  // ========== MINI-WEBSITE METHODS ==========
  
  async getMiniWebsiteByVendor(vendorId: string): Promise<MiniWebsite | undefined> {
    return Array.from(this.miniWebsites.values()).find(w => w.vendorId === vendorId);
  }

  async getMiniWebsiteBySubdomain(subdomain: string): Promise<MiniWebsite | undefined> {
    // Case-insensitive subdomain lookup
    const normalizedSubdomain = subdomain.toLowerCase();
    return Array.from(this.miniWebsites.values()).find(w => w.subdomain.toLowerCase() === normalizedSubdomain);
  }

  async getMiniWebsite(id: string): Promise<MiniWebsite | undefined> {
    return this.miniWebsites.get(id);
  }

  async createMiniWebsite(data: InsertMiniWebsite): Promise<MiniWebsite> {
    const id = `mini-${nanoid()}`;
    const now = new Date();
    const miniWebsite: MiniWebsite = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    this.miniWebsites.set(id, miniWebsite);
    return miniWebsite;
  }

  async updateMiniWebsite(id: string, data: Partial<InsertMiniWebsite>): Promise<MiniWebsite | null> {
    const existing = this.miniWebsites.get(id);
    if (!existing) return null;

    const updated: MiniWebsite = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    this.miniWebsites.set(id, updated);
    return updated;
  }

  async publishMiniWebsite(id: string): Promise<MiniWebsite | null> {
    return this.updateMiniWebsite(id, {
      status: "published",
      publishedAt: new Date(),
    });
  }

  async deleteMiniWebsite(id: string): Promise<boolean> {
    return this.miniWebsites.delete(id);
  }

  // Mini-Website Reviews

  async createReview(data: InsertMiniWebsiteReview): Promise<MiniWebsiteReview> {
    const id = `review-${nanoid()}`;
    const review: MiniWebsiteReview = {
      id,
      ...data,
      createdAt: new Date(),
    };
    this.miniWebsiteReviews.set(id, review);
    return review;
  }

  async getReviewsByMiniWebsite(miniWebsiteId: string, approved: boolean = false): Promise<MiniWebsiteReview[]> {
    const reviews = Array.from(this.miniWebsiteReviews.values())
      .filter(r => r.miniWebsiteId === miniWebsiteId);
    
    if (approved) {
      return reviews.filter(r => r.status === "approved");
    }
    return reviews;
  }

  async approveReview(id: string): Promise<MiniWebsiteReview | null> {
    const review = this.miniWebsiteReviews.get(id);
    if (!review) return null;

    const updated: MiniWebsiteReview = {
      ...review,
      status: "approved",
      approvedAt: new Date(),
    };
    this.miniWebsiteReviews.set(id, updated);
    return updated;
  }

  async deleteReview(id: string): Promise<boolean> {
    return this.miniWebsiteReviews.delete(id);
  }

  // Mini-Website Leads

  async createMiniWebsiteLead(data: InsertMiniWebsiteLead): Promise<MiniWebsiteLead> {
    const id = `mwlead-${nanoid()}`;
    const lead: MiniWebsiteLead = {
      id,
      ...data,
      createdAt: new Date(),
    };
    this.miniWebsiteLeads.set(id, lead);
    return lead;
  }

  async getMiniWebsiteLeadsByVendor(vendorId: string): Promise<MiniWebsiteLead[]> {
    return Array.from(this.miniWebsiteLeads.values())
      .filter(l => l.vendorId === vendorId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateMiniWebsiteLead(id: string, data: Partial<InsertMiniWebsiteLead>): Promise<MiniWebsiteLead | null> {
    const existing = this.miniWebsiteLeads.get(id);
    if (!existing) return null;

    const updated: MiniWebsiteLead = {
      ...existing,
      ...data,
    };
    this.miniWebsiteLeads.set(id, updated);
    return updated;
  }

  // ==================== SUBSCRIPTION & BILLING MODULE IMPLEMENTATION ====================
  
  // Subscription Plans
  async getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined> {
    return this.subscriptionPlans.get(id);
  }

  async getAllSubscriptionPlans(activeOnly: boolean = false): Promise<SubscriptionPlan[]> {
    const plans = Array.from(this.subscriptionPlans.values());
    if (activeOnly) {
      return plans.filter(p => p.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
    }
    return plans.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const id = `plan-${nanoid()}`;
    const newPlan: SubscriptionPlan = {
      id,
      ...plan,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.subscriptionPlans.set(id, newPlan);
    return newPlan;
  }

  async updateSubscriptionPlan(id: string, updates: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan | undefined> {
    const plan = this.subscriptionPlans.get(id);
    if (!plan) return undefined;

    const updated: SubscriptionPlan = {
      ...plan,
      ...updates,
      updatedAt: new Date(),
    };
    this.subscriptionPlans.set(id, updated);
    return updated;
  }

  async deleteSubscriptionPlan(id: string): Promise<boolean> {
    return this.subscriptionPlans.delete(id);
  }

  // Vendor Subscriptions
  async getVendorSubscription(id: string): Promise<VendorSubscription | undefined> {
    return this.vendorSubscriptions.get(id);
  }

  async getVendorSubscriptionByVendor(vendorId: string): Promise<VendorSubscription | undefined> {
    return Array.from(this.vendorSubscriptions.values()).find(s => s.vendorId === vendorId);
  }

  async getAllVendorSubscriptions(status?: string): Promise<VendorSubscription[]> {
    const subscriptions = Array.from(this.vendorSubscriptions.values());
    if (status) {
      return subscriptions.filter(s => s.status === status);
    }
    return subscriptions;
  }

  async createVendorSubscription(subscription: InsertVendorSubscription): Promise<VendorSubscription> {
    const id = `sub-${nanoid()}`;
    const newSubscription: VendorSubscription = {
      id,
      ...subscription,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.vendorSubscriptions.set(id, newSubscription);
    return newSubscription;
  }

  async updateVendorSubscription(id: string, updates: Partial<InsertVendorSubscription>): Promise<VendorSubscription | undefined> {
    const subscription = this.vendorSubscriptions.get(id);
    if (!subscription) return undefined;

    const updated: VendorSubscription = {
      ...subscription,
      ...updates,
      updatedAt: new Date(),
    };
    this.vendorSubscriptions.set(id, updated);
    return updated;
  }

  async cancelVendorSubscription(id: string): Promise<VendorSubscription | undefined> {
    const subscription = this.vendorSubscriptions.get(id);
    if (!subscription) return undefined;

    const updated: VendorSubscription = {
      ...subscription,
      status: "canceled",
      canceledAt: new Date(),
      updatedAt: new Date(),
    };
    this.vendorSubscriptions.set(id, updated);
    return updated;
  }

  // Billing History
  async getBillingHistory(id: string): Promise<BillingHistory | undefined> {
    return this.billingHistories.get(id);
  }

  async getBillingHistoryByVendor(vendorId: string): Promise<BillingHistory[]> {
    return Array.from(this.billingHistories.values())
      .filter(b => b.vendorId === vendorId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAllBillingHistory(): Promise<BillingHistory[]> {
    return Array.from(this.billingHistories.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createBillingHistory(billing: InsertBillingHistory): Promise<BillingHistory> {
    const id = `bill-${nanoid()}`;
    const newBilling: BillingHistory = {
      id,
      ...billing,
      createdAt: new Date(),
    };
    this.billingHistories.set(id, newBilling);
    return newBilling;
  }

  async updateBillingHistory(id: string, updates: Partial<InsertBillingHistory>): Promise<BillingHistory | undefined> {
    const billing = this.billingHistories.get(id);
    if (!billing) return undefined;

    const updated: BillingHistory = {
      ...billing,
      ...updates,
    };
    this.billingHistories.set(id, updated);
    return updated;
  }

  // Usage Logs
  async createUsageLog(log: InsertUsageLog): Promise<UsageLog> {
    const id = `log-${nanoid()}`;
    const newLog: UsageLog = {
      id,
      ...log,
      logDate: new Date(),
    };
    this.usageLogs.set(id, newLog);
    return newLog;
  }

  async getUsageLogsByVendor(vendorId: string, feature?: string): Promise<UsageLog[]> {
    const logs = Array.from(this.usageLogs.values()).filter(l => l.vendorId === vendorId);
    if (feature) {
      return logs.filter(l => l.feature === feature);
    }
    return logs.sort((a, b) => b.logDate.getTime() - a.logDate.getTime());
  }

  // ==================== STOCK TURNOVER MODULE IMPLEMENTATION ====================
  
  // Inventory Locations
  async getInventoryLocation(id: string): Promise<InventoryLocation | undefined> {
    return this.inventoryLocations.get(id);
  }

  async getInventoryLocationsByVendor(vendorId: string): Promise<InventoryLocation[]> {
    return Array.from(this.inventoryLocations.values())
      .filter(loc => loc.vendorId === vendorId)
      .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
  }

  async getDefaultLocation(vendorId: string): Promise<InventoryLocation | undefined> {
    return Array.from(this.inventoryLocations.values())
      .find(loc => loc.vendorId === vendorId && loc.isDefault);
  }

  async createInventoryLocation(location: InsertInventoryLocation): Promise<InventoryLocation> {
    const id = `loc-${nanoid()}`;
    const now = new Date();
    
    const existingLocs = await this.getInventoryLocationsByVendor(location.vendorId);
    const isDefault = location.isDefault || existingLocs.length === 0;
    
    if (isDefault) {
      for (const loc of existingLocs) {
        if (loc.isDefault) {
          await this.updateInventoryLocation(loc.id, { isDefault: false });
        }
      }
    }

    const newLocation: InventoryLocation = {
      ...location,
      id,
      isDefault,
      createdAt: now,
      updatedAt: now,
    };
    
    this.inventoryLocations.set(id, newLocation);
    return newLocation;
  }

  async updateInventoryLocation(id: string, updates: Partial<InsertInventoryLocation>): Promise<InventoryLocation | undefined> {
    const existing = this.inventoryLocations.get(id);
    if (!existing) return undefined;

    const updated: InventoryLocation = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.inventoryLocations.set(id, updated);
    return updated;
  }

  async deleteInventoryLocation(id: string): Promise<boolean> {
    return this.inventoryLocations.delete(id);
  }

  // Stock Batches
  async getStockBatch(id: string): Promise<StockBatch | undefined> {
    return this.stockBatches.get(id);
  }

  async getStockBatchesByProduct(vendorProductId: string): Promise<StockBatch[]> {
    return Array.from(this.stockBatches.values())
      .filter(batch => batch.vendorProductId === vendorProductId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getExpiringBatches(vendorId: string, days: number): Promise<StockBatch[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const vendorProducts = Array.from(this.vendorProducts.values())
      .filter(p => p.vendorId === vendorId)
      .map(p => p.id);

    return Array.from(this.stockBatches.values())
      .filter(batch => 
        vendorProducts.includes(batch.vendorProductId) &&
        batch.expiryDate &&
        batch.expiryDate <= futureDate &&
        batch.quantity > 0
      )
      .sort((a, b) => (a.expiryDate?.getTime() || 0) - (b.expiryDate?.getTime() || 0));
  }

  async createStockBatch(batch: InsertStockBatch): Promise<StockBatch> {
    const id = `batch-${nanoid()}`;
    const now = new Date();

    const newBatch: StockBatch = {
      ...batch,
      id,
      createdAt: now,
      updatedAt: now,
    };
    
    this.stockBatches.set(id, newBatch);
    return newBatch;
  }

  async updateStockBatch(id: string, updates: Partial<InsertStockBatch>): Promise<StockBatch | undefined> {
    const existing = this.stockBatches.get(id);
    if (!existing) return undefined;

    const updated: StockBatch = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.stockBatches.set(id, updated);
    return updated;
  }

  async deleteStockBatch(id: string): Promise<boolean> {
    return this.stockBatches.delete(id);
  }

  // Stock Movements
  async getStockMovement(id: string): Promise<StockMovement | undefined> {
    return this.stockMovements.get(id);
  }

  async getStockMovementsByVendor(vendorId: string, filters?: { productId?: string; movementType?: string; startDate?: Date; endDate?: Date }): Promise<StockMovement[]> {
    let movements = Array.from(this.stockMovements.values())
      .filter(m => m.vendorId === vendorId);

    if (filters) {
      if (filters.productId) {
        movements = movements.filter(m => m.vendorProductId === filters.productId);
      }
      if (filters.movementType) {
        movements = movements.filter(m => m.movementType === filters.movementType);
      }
      if (filters.startDate) {
        movements = movements.filter(m => m.createdAt >= filters.startDate!);
      }
      if (filters.endDate) {
        movements = movements.filter(m => m.createdAt <= filters.endDate!);
      }
    }

    return movements.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getStockMovementsByProduct(vendorProductId: string): Promise<StockMovement[]> {
    return Array.from(this.stockMovements.values())
      .filter(m => m.vendorProductId === vendorProductId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createStockMovement(movement: InsertStockMovement): Promise<StockMovement> {
    const id = `mov-${nanoid()}`;
    const now = new Date();

    const newMovement: StockMovement = {
      ...movement,
      id,
      createdAt: now,
    };
    
    this.stockMovements.set(id, newMovement);
    return newMovement;
  }

  async recordStockIn(vendorProductId: string, quantity: number, data: Partial<InsertStockMovement>, userId?: string): Promise<{ movement: StockMovement; newStock: number }> {
    const product = this.vendorProducts.get(vendorProductId);
    if (!product) throw new Error("Product not found");

    const previousStock = product.stock;
    const newStock = previousStock + quantity;

    product.stock = newStock;
    product.updatedAt = new Date();
    this.vendorProducts.set(vendorProductId, product);

    const movement = await this.createStockMovement({
      vendorId: product.vendorId,
      vendorProductId,
      movementType: 'in',
      quantity,
      previousStock,
      newStock,
      unitCost: data.unitCost,
      totalValue: data.unitCost ? data.unitCost * quantity : undefined,
      referenceType: data.referenceType || 'manual',
      referenceId: data.referenceId,
      reason: data.reason || 'Stock In',
      notes: data.notes,
      performedBy: userId,
      locationId: data.locationId,
      batchId: data.batchId,
    });

    await this.checkAndGenerateAlerts(product.vendorId);
    return { movement, newStock };
  }

  async recordStockOut(vendorProductId: string, quantity: number, data: Partial<InsertStockMovement>, userId?: string): Promise<{ movement: StockMovement; newStock: number }> {
    const product = this.vendorProducts.get(vendorProductId);
    if (!product) throw new Error("Product not found");

    const previousStock = product.stock;
    const newStock = Math.max(0, previousStock - quantity);

    product.stock = newStock;
    product.updatedAt = new Date();
    this.vendorProducts.set(vendorProductId, product);

    const movement = await this.createStockMovement({
      vendorId: product.vendorId,
      vendorProductId,
      movementType: data.movementType || 'out',
      quantity: -quantity,
      previousStock,
      newStock,
      unitCost: data.unitCost,
      totalValue: data.unitCost ? data.unitCost * quantity : undefined,
      referenceType: data.referenceType || 'manual',
      referenceId: data.referenceId,
      reason: data.reason || 'Stock Out',
      notes: data.notes,
      performedBy: userId,
      locationId: data.locationId,
      batchId: data.batchId,
    });

    await this.checkAndGenerateAlerts(product.vendorId);
    return { movement, newStock };
  }

  // Stock Configs
  async getStockConfig(vendorProductId: string): Promise<StockConfig | undefined> {
    return Array.from(this.stockConfigs.values())
      .find(config => config.vendorProductId === vendorProductId);
  }

  async getStockConfigsByVendor(vendorId: string): Promise<StockConfig[]> {
    const vendorProducts = Array.from(this.vendorProducts.values())
      .filter(p => p.vendorId === vendorId)
      .map(p => p.id);

    return Array.from(this.stockConfigs.values())
      .filter(config => vendorProducts.includes(config.vendorProductId));
  }

  async createStockConfig(config: InsertStockConfig): Promise<StockConfig> {
    const id = `cfg-${nanoid()}`;
    const now = new Date();

    const newConfig: StockConfig = {
      ...config,
      id,
      createdAt: now,
      updatedAt: now,
    };
    
    this.stockConfigs.set(id, newConfig);
    return newConfig;
  }

  async updateStockConfig(id: string, updates: Partial<InsertStockConfig>): Promise<StockConfig | undefined> {
    const existing = this.stockConfigs.get(id);
    if (!existing) return undefined;

    const updated: StockConfig = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.stockConfigs.set(id, updated);
    return updated;
  }

  async ensureStockConfig(vendorProductId: string): Promise<StockConfig> {
    let config = await this.getStockConfig(vendorProductId);
    if (!config) {
      config = await this.createStockConfig({
        vendorProductId,
        minimumStock: 10,
        reorderPoint: 20,
        reorderQuantity: 50,
        expiryAlertDays: 30,
        trackExpiry: false,
        trackBatches: false,
        trackWarranty: false,
        enableLowStockAlerts: true,
        enableExpiryAlerts: true,
        notificationChannels: ['dashboard'],
      });
    }
    return config;
  }

  // Stock Alerts
  async getStockAlert(id: string): Promise<StockAlert | undefined> {
    return this.stockAlerts.get(id);
  }

  async getStockAlertsByVendor(vendorId: string, filters?: { status?: string; alertType?: string }): Promise<StockAlert[]> {
    let alerts = Array.from(this.stockAlerts.values())
      .filter(alert => alert.vendorId === vendorId);

    if (filters) {
      if (filters.status) {
        alerts = alerts.filter(a => a.status === filters.status);
      }
      if (filters.alertType) {
        alerts = alerts.filter(a => a.alertType === filters.alertType);
      }
    }

    return alerts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createStockAlert(alert: InsertStockAlert): Promise<StockAlert> {
    const id = `alert-${nanoid()}`;
    const now = new Date();

    const newAlert: StockAlert = {
      ...alert,
      id,
      createdAt: now,
    };
    
    this.stockAlerts.set(id, newAlert);
    return newAlert;
  }

  async acknowledgeStockAlert(id: string, userId: string): Promise<StockAlert | undefined> {
    const alert = this.stockAlerts.get(id);
    if (!alert) return undefined;

    const updated: StockAlert = {
      ...alert,
      status: 'acknowledged',
      acknowledgedBy: userId,
      acknowledgedAt: new Date(),
    };
    
    this.stockAlerts.set(id, updated);
    return updated;
  }

  async resolveStockAlert(id: string): Promise<StockAlert | undefined> {
    const alert = this.stockAlerts.get(id);
    if (!alert) return undefined;

    const updated: StockAlert = {
      ...alert,
      status: 'resolved',
      resolvedAt: new Date(),
    };
    
    this.stockAlerts.set(id, updated);
    return updated;
  }

  async dismissStockAlert(id: string): Promise<StockAlert | undefined> {
    const alert = this.stockAlerts.get(id);
    if (!alert) return undefined;

    const updated: StockAlert = {
      ...alert,
      status: 'dismissed',
    };
    
    this.stockAlerts.set(id, updated);
    return updated;
  }

  async checkAndGenerateAlerts(vendorId: string): Promise<StockAlert[]> {
    const generatedAlerts: StockAlert[] = [];
    const vendorProducts = Array.from(this.vendorProducts.values())
      .filter(p => p.vendorId === vendorId);

    for (const product of vendorProducts) {
      const config = await this.getStockConfig(product.id);
      if (!config) continue;

      if (config.enableLowStockAlerts && product.stock <= config.minimumStock) {
        const existingAlert = Array.from(this.stockAlerts.values())
          .find(a => 
            a.vendorProductId === product.id &&
            a.alertType === (product.stock === 0 ? 'out_of_stock' : 'low_stock') &&
            a.status === 'active'
          );

        if (!existingAlert) {
          const alert = await this.createStockAlert({
            vendorId,
            vendorProductId: product.id,
            alertType: product.stock === 0 ? 'out_of_stock' : 'low_stock',
            severity: product.stock === 0 ? 'critical' : 'medium',
            message: product.stock === 0 
              ? `${product.name} is out of stock`
              : `${product.name} stock is low (${product.stock} ${product.unit} remaining)`,
            currentStock: product.stock,
            minimumStock: config.minimumStock,
            status: 'active',
          });
          generatedAlerts.push(alert);
        }
      }

      if (config.enableExpiryAlerts && config.trackExpiry) {
        const expiringBatches = await this.getExpiringBatches(vendorId, config.expiryAlertDays);
        for (const batch of expiringBatches) {
          if (batch.vendorProductId !== product.id) continue;

          const existingAlert = Array.from(this.stockAlerts.values())
            .find(a => 
              a.batchId === batch.id &&
              a.alertType === 'expiring_soon' &&
              a.status === 'active'
            );

          if (!existingAlert && batch.expiryDate) {
            const daysUntilExpiry = Math.ceil((batch.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            const alert = await this.createStockAlert({
              vendorId,
              vendorProductId: product.id,
              batchId: batch.id,
              alertType: 'expiring_soon',
              severity: daysUntilExpiry <= 7 ? 'high' : 'medium',
              message: `${product.name} (Batch ${batch.batchNumber}) expires in ${daysUntilExpiry} days`,
              expiryDate: batch.expiryDate,
              status: 'active',
            });
            generatedAlerts.push(alert);
          }
        }
      }
    }

    return generatedAlerts;
  }

  // Stock Analytics
  async getStockTurnoverRate(vendorProductId: string, days: number): Promise<number> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const sales = Array.from(this.stockMovements.values())
      .filter(m => 
        m.vendorProductId === vendorProductId &&
        m.movementType === 'sale' &&
        m.createdAt >= startDate
      );

    const totalSold = sales.reduce((sum, m) => sum + Math.abs(m.quantity), 0);
    const product = this.vendorProducts.get(vendorProductId);
    
    if (!product || product.stock === 0) return 0;
    
    return totalSold / days;
  }

  async getSlowMovingProducts(vendorId: string, days: number): Promise<VendorProduct[]> {
    const products = Array.from(this.vendorProducts.values())
      .filter(p => p.vendorId === vendorId && p.stock > 0);

    const slowMoving: VendorProduct[] = [];

    for (const product of products) {
      const turnoverRate = await this.getStockTurnoverRate(product.id, days);
      if (turnoverRate < 1) {
        slowMoving.push(product);
      }
    }

    return slowMoving;
  }

  async getStockValue(vendorId: string): Promise<number> {
    const products = Array.from(this.vendorProducts.values())
      .filter(p => p.vendorId === vendorId);

    return products.reduce((total, product) => {
      return total + (product.stock * product.price);
    }, 0);
  }

  async getComprehensiveStockAnalytics(vendorId: string) {
    const products = Array.from(this.vendorProducts.values())
      .filter(p => p.vendorId === vendorId);

    const configs = await this.getStockConfigsByVendor(vendorId);
    const configMap = new Map(configs.map(c => [c.vendorProductId, c]));

    let totalStockValue = 0;
    let lowStockItems = 0;
    let highStockItems = 0;
    let outOfStockItems = 0;
    let bestSellingCount = 0;
    let leastSellingCount = 0;

    const productTurnoverRates: { product: VendorProduct; turnoverRate: number }[] = [];

    for (const product of products) {
      totalStockValue += product.stock * product.price;

      if (product.stock === 0) {
        outOfStockItems++;
      } else {
        const config = configMap.get(product.id);
        const minLevel = config?.minStockLevel || 10;
        const maxLevel = config?.maxStockLevel || 100;

        if (product.stock <= minLevel) {
          lowStockItems++;
        }
        if (product.stock >= maxLevel) {
          highStockItems++;
        }
      }

      const turnoverRate = await this.getStockTurnoverRate(product.id, 30);
      productTurnoverRates.push({ product, turnoverRate });
    }

    productTurnoverRates.sort((a, b) => b.turnoverRate - a.turnoverRate);
    
    const topThreshold = productTurnoverRates.length > 0 
      ? productTurnoverRates[Math.floor(productTurnoverRates.length * 0.2)]?.turnoverRate || 0 
      : 0;
    const bottomThreshold = productTurnoverRates.length > 0 
      ? productTurnoverRates[Math.floor(productTurnoverRates.length * 0.8)]?.turnoverRate || 0 
      : 0;

    for (const item of productTurnoverRates) {
      if (item.turnoverRate >= topThreshold && item.turnoverRate > 0) {
        bestSellingCount++;
      }
      if (item.turnoverRate <= bottomThreshold && item.product.stock > 0) {
        leastSellingCount++;
      }
    }

    return {
      totalStockValue,
      lowStockItems,
      highStockItems,
      outOfStockItems,
      bestSellingItems: bestSellingCount,
      leastSellingItems: leastSellingCount,
    };
  }

  // ====================
  // LEDGER TRANSACTIONS (HISAB KITAB)
  // ====================

  async getLedgerTransaction(id: string): Promise<LedgerTransaction | undefined> {
    return this.ledgerTransactions.get(id);
  }

  async getLedgerTransactionsByVendor(
    vendorId: string, 
    filters?: {
      customerId?: string;
      type?: string;
      category?: string;
      paymentMethod?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<LedgerTransaction[]> {
    let transactions = Array.from(this.ledgerTransactions.values())
      .filter(t => t.vendorId === vendorId)
      .map(t => ({
        ...t,
        transactionDate: t.transactionDate instanceof Date ? t.transactionDate : new Date(t.transactionDate),
      }));

    if (filters) {
      if (filters.customerId) {
        transactions = transactions.filter(t => t.customerId === filters.customerId);
      }
      if (filters.type) {
        transactions = transactions.filter(t => t.type === filters.type);
      }
      if (filters.category) {
        transactions = transactions.filter(t => t.category === filters.category);
      }
      if (filters.paymentMethod) {
        transactions = transactions.filter(t => t.paymentMethod === filters.paymentMethod);
      }
      if (filters.startDate) {
        transactions = transactions.filter(t => t.transactionDate >= filters.startDate!);
      }
      if (filters.endDate) {
        transactions = transactions.filter(t => t.transactionDate <= filters.endDate!);
      }
    }

    return transactions.sort((a, b) => b.transactionDate.getTime() - a.transactionDate.getTime());
  }

  async getLedgerTransactionsByCustomer(customerId: string): Promise<LedgerTransaction[]> {
    return Array.from(this.ledgerTransactions.values())
      .filter(t => t.customerId === customerId)
      .sort((a, b) => b.transactionDate.getTime() - a.transactionDate.getTime());
  }

  async createLedgerTransaction(transaction: InsertLedgerTransaction): Promise<LedgerTransaction> {
    const newTransaction: LedgerTransaction = {
      id: nanoid(),
      ...transaction,
      transactionDate: transaction.transactionDate || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.ledgerTransactions.set(newTransaction.id, newTransaction);
    return newTransaction;
  }

  async updateLedgerTransaction(id: string, updates: Partial<InsertLedgerTransaction>): Promise<LedgerTransaction | undefined> {
    const transaction = this.ledgerTransactions.get(id);
    if (!transaction) return undefined;

    const updated: LedgerTransaction = {
      ...transaction,
      ...updates,
      updatedAt: new Date(),
    };

    this.ledgerTransactions.set(id, updated);
    return updated;
  }

  async deleteLedgerTransaction(id: string): Promise<boolean> {
    return this.ledgerTransactions.delete(id);
  }

  async getLedgerSummary(
    vendorId: string, 
    filters?: { 
      customerId?: string; 
      type?: string;
      category?: string;
      paymentMethod?: string;
      startDate?: Date; 
      endDate?: Date;
    }
  ): Promise<{
    totalIn: number;
    totalOut: number;
    balance: number;
    transactionCount: number;
  }> {
    const transactions = await this.getLedgerTransactionsByVendor(vendorId, filters);

    const totalIn = transactions
      .filter(t => t.type === 'in')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalOut = transactions
      .filter(t => t.type === 'out')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIn,
      totalOut,
      balance: totalIn - totalOut,
      transactionCount: transactions.length,
    };
  }

  async getCustomerLedgerBalance(customerId: string): Promise<number> {
    const transactions = await this.getLedgerTransactionsByCustomer(customerId);

    const totalIn = transactions
      .filter(t => t.type === 'in')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalOut = transactions
      .filter(t => t.type === 'out')
      .reduce((sum, t) => sum + t.amount, 0);

    return totalIn - totalOut;
  }

  async getRecurringLedgerTransactions(vendorId: string): Promise<LedgerTransaction[]> {
    return Array.from(this.ledgerTransactions.values())
      .filter(t => t.vendorId === vendorId && t.isRecurring === true)
      .sort((a, b) => {
        if (!a.nextOccurrenceDate || !b.nextOccurrenceDate) return 0;
        return a.nextOccurrenceDate.getTime() - b.nextOccurrenceDate.getTime();
      });
  }

  // ==================== GREETING & MARKETING MODULE ====================
  
  private seedSampleGreetingTemplates() {
    const sampleTemplates: GreetingTemplate[] = [
      {
        id: "gt-1",
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
        downloadCount: 150,
        shareCount: 89,
        status: "published",
        uploadedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "gt-2",
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
        downloadCount: 200,
        shareCount: 120,
        status: "published",
        uploadedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleTemplates.forEach(template => {
      this.greetingTemplates.set(template.id, template);
    });
  }

  private seedSampleLeads() {
    const sampleLeads: Lead[] = [
      {
        id: "lead-1",
        vendorId: "vendor-1",
        name: "Amit Patel",
        phone: "+91 98765 11111",
        email: "amit.patel@example.com",
        source: "website",
        status: "new",
        priority: "high",
        assignedEmployeeId: null,
        interestDescription: "Interested in annual membership and personal training",
        notes: "Called to inquire about gym membership packages. Wants to start next week.",
        estimatedBudget: 25000,
        preferredContactMethod: "phone",
        nextFollowUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        leadScore: 85,
        convertedToCustomerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "lead-2",
        vendorId: "vendor-1",
        name: "Priya Sharma",
        phone: "+91 98765 22222",
        email: "priya.s@example.com",
        source: "whatsapp",
        status: "contacted",
        priority: "medium",
        assignedEmployeeId: null,
        interestDescription: "Looking for diagnostic health checkup packages",
        notes: "WhatsApp inquiry about full body checkup. Requested quote for family package.",
        estimatedBudget: 8000,
        preferredContactMethod: "whatsapp",
        nextFollowUpDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        leadScore: 70,
        convertedToCustomerId: null,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date(),
      },
      {
        id: "lead-3",
        vendorId: "vendor-1",
        name: "Rajesh Kumar",
        phone: "+91 98765 33333",
        email: null,
        source: "offline",
        status: "interested",
        priority: "urgent",
        assignedEmployeeId: null,
        interestDescription: "Needs specialist consultation for chronic condition",
        notes: "Walk-in inquiry. Very interested in specialist consultation. Budget not a concern.",
        estimatedBudget: null,
        preferredContactMethod: "phone",
        nextFollowUpDate: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
        leadScore: 95,
        convertedToCustomerId: null,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        updatedAt: new Date(),
      },
    ];

    sampleLeads.forEach(lead => {
      this.leads.set(lead.id, lead);
    });
  }

  private seedSubscriptionPlans() {
    const currentDate = new Date();
    const plans: SubscriptionPlan[] = [
      {
        id: "plan-monthly",
        name: "monthly",
        displayName: "Monthly Plan",
        description: "Perfect for small businesses getting started. All essential features with monthly billing.",
        price: "299",
        currency: "INR",
        billingInterval: "month",
        maxServices: 10,
        maxProducts: 20,
        maxEmployees: 3,
        maxCustomers: 100,
        maxOrders: 50,
        maxBookings: 50,
        maxAppointments: 50,
        maxStorageGB: 1,
        hasAdvancedAnalytics: false,
        hasPrioritySupport: false,
        hasCustomDomain: false,
        hasMiniWebsite: true,
        hasWhiteLabel: false,
        hasAPI: false,
        hasMultiLocation: false,
        isActive: true,
        isPopular: false,
        displayOrder: 1,
        trialDays: 7,
        stripeProductId: null,
        stripePriceId: null,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        id: "plan-halfyearly",
        name: "halfyearly",
        displayName: "6 Months Plan",
        description: "Best value! Save 11% with our most popular 6-month plan. Includes advanced analytics and priority support.",
        price: "1599",
        currency: "INR",
        billingInterval: "month",
        maxServices: 50,
        maxProducts: 100,
        maxEmployees: 10,
        maxCustomers: 500,
        maxOrders: 200,
        maxBookings: 200,
        maxAppointments: 200,
        maxStorageGB: 5,
        hasAdvancedAnalytics: true,
        hasPrioritySupport: true,
        hasCustomDomain: true,
        hasMiniWebsite: true,
        hasWhiteLabel: false,
        hasAPI: true,
        hasMultiLocation: false,
        isActive: true,
        isPopular: true,
        displayOrder: 2,
        trialDays: 14,
        stripeProductId: null,
        stripePriceId: null,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        id: "plan-yearly",
        name: "yearly",
        displayName: "Annual Plan",
        description: "Maximum savings! Save 15% annually. Unlock all features including white-label and multi-location support.",
        price: "3049",
        currency: "INR",
        billingInterval: "year",
        maxServices: -1,
        maxProducts: -1,
        maxEmployees: -1,
        maxCustomers: -1,
        maxOrders: -1,
        maxBookings: -1,
        maxAppointments: -1,
        maxStorageGB: 20,
        hasAdvancedAnalytics: true,
        hasPrioritySupport: true,
        hasCustomDomain: true,
        hasMiniWebsite: true,
        hasWhiteLabel: true,
        hasAPI: true,
        hasMultiLocation: true,
        isActive: true,
        isPopular: false,
        displayOrder: 3,
        trialDays: 30,
        stripeProductId: null,
        stripePriceId: null,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    ];

    plans.forEach(plan => {
      this.subscriptionPlans.set(plan.id, plan);
    });

    // Create a default subscription for vendor-1 (Monthly Plan in trial)
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);
    
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const defaultSubscription: VendorSubscription = {
      id: "sub-default-vendor-1",
      vendorId: "vendor-1",
      planId: "plan-monthly",
      status: "trial",
      startDate: currentDate,
      currentPeriodStart: currentDate,
      currentPeriodEnd: periodEnd,
      trialEndDate: trialEndDate,
      canceledAt: null,
      endedAt: null,
      stripeSubscriptionId: null,
      stripeCustomerId: null,
      currentMonthOrders: 5,
      currentMonthBookings: 8,
      currentMonthAppointments: 3,
      lastUsageReset: currentDate,
      autoRenew: true,
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    this.vendorSubscriptions.set(defaultSubscription.id, defaultSubscription);
  }

  // Poster Categories
  private posterCategories: Map<string, any> = new Map();

  async getPosterCategories(): Promise<any[]> {
    return Array.from(this.posterCategories.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async createPosterCategory(category: any): Promise<any> {
    const id = crypto.randomUUID();
    const newCategory = {
      id,
      ...category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.posterCategories.set(id, newCategory);
    return newCategory;
  }

  async updatePosterCategory(id: string, updates: any): Promise<any> {
    const existing = this.posterCategories.get(id);
    if (!existing) throw new Error("Category not found");
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.posterCategories.set(id, updated);
    return updated;
  }

  async deletePosterCategory(id: string): Promise<boolean> {
    return this.posterCategories.delete(id);
  }

  async getGreetingTemplate(id: string): Promise<GreetingTemplate | undefined> {
    return this.greetingTemplates.get(id);
  }

  async getAllGreetingTemplates(filters?: {
    status?: string;
    occasions?: string[];
    offerTypes?: string[];
    industries?: string[];
    isTrending?: boolean;
  }): Promise<GreetingTemplate[]> {
    let templates = Array.from(this.greetingTemplates.values());

    if (filters) {
      if (filters.status) {
        templates = templates.filter(t => t.status === filters.status);
      }
      if (filters.occasions && filters.occasions.length > 0) {
        templates = templates.filter(t => 
          t.occasions.some(occ => filters.occasions!.includes(occ))
        );
      }
      if (filters.offerTypes && filters.offerTypes.length > 0) {
        templates = templates.filter(t => 
          t.offerTypes.some(type => filters.offerTypes!.includes(type))
        );
      }
      if (filters.industries && filters.industries.length > 0) {
        templates = templates.filter(t => 
          t.industries.some(ind => filters.industries!.includes(ind))
        );
      }
      if (filters.isTrending !== undefined) {
        templates = templates.filter(t => t.isTrending === filters.isTrending);
      }
    }

    return templates.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async searchGreetingTemplates(query: string, filters?: {
    occasions?: string[];
    offerTypes?: string[];
    industries?: string[];
  }): Promise<GreetingTemplate[]> {
    const lowerQuery = query.toLowerCase();
    let templates = Array.from(this.greetingTemplates.values()).filter(t =>
      t.title.toLowerCase().includes(lowerQuery) ||
      (t.description?.toLowerCase().includes(lowerQuery)) ||
      t.occasions.some(occ => occ.toLowerCase().includes(lowerQuery)) ||
      t.industries.some(ind => ind.toLowerCase().includes(lowerQuery))
    );

    if (filters) {
      if (filters.occasions && filters.occasions.length > 0) {
        templates = templates.filter(t => 
          t.occasions.some(occ => filters.occasions!.includes(occ))
        );
      }
      if (filters.offerTypes && filters.offerTypes.length > 0) {
        templates = templates.filter(t => 
          t.offerTypes.some(type => filters.offerTypes!.includes(type))
        );
      }
      if (filters.industries && filters.industries.length > 0) {
        templates = templates.filter(t => 
          t.industries.some(ind => filters.industries!.includes(ind))
        );
      }
    }

    return templates;
  }

  async createGreetingTemplate(template: InsertGreetingTemplate): Promise<GreetingTemplate> {
    const newTemplate: GreetingTemplate = {
      id: nanoid(),
      ...template,
      downloadCount: 0,
      shareCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.greetingTemplates.set(newTemplate.id, newTemplate);
    return newTemplate;
  }

  async updateGreetingTemplate(id: string, updates: Partial<InsertGreetingTemplate>): Promise<GreetingTemplate | undefined> {
    const template = this.greetingTemplates.get(id);
    if (!template) return undefined;

    const updated: GreetingTemplate = {
      ...template,
      ...updates,
      updatedAt: new Date(),
    };

    this.greetingTemplates.set(id, updated);
    return updated;
  }

  async deleteGreetingTemplate(id: string): Promise<boolean> {
    return this.greetingTemplates.delete(id);
  }

  async incrementTemplateDownload(id: string): Promise<void> {
    const template = this.greetingTemplates.get(id);
    if (template) {
      template.downloadCount++;
      template.updatedAt = new Date();
      this.greetingTemplates.set(id, template);
    }
  }

  async incrementTemplateShare(id: string): Promise<void> {
    const template = this.greetingTemplates.get(id);
    if (template) {
      template.shareCount++;
      template.updatedAt = new Date();
      this.greetingTemplates.set(id, template);
    }
  }

  // Greeting Template Usage
  async getGreetingTemplateUsage(id: string): Promise<GreetingTemplateUsage | undefined> {
    return this.greetingTemplateUsage.get(id);
  }

  async getTemplateUsageByVendor(vendorId: string): Promise<GreetingTemplateUsage[]> {
    return Array.from(this.greetingTemplateUsage.values())
      .filter(u => u.vendorId === vendorId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getTemplateUsageByTemplate(templateId: string): Promise<GreetingTemplateUsage[]> {
    return Array.from(this.greetingTemplateUsage.values())
      .filter(u => u.templateId === templateId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createGreetingTemplateUsage(usage: InsertGreetingTemplateUsage): Promise<GreetingTemplateUsage> {
    const newUsage: GreetingTemplateUsage = {
      id: nanoid(),
      ...usage,
      shareCount: 0,
      createdAt: new Date(),
    };

    this.greetingTemplateUsage.set(newUsage.id, newUsage);
    
    // Increment download count on the template
    await this.incrementTemplateDownload(usage.templateId);
    
    return newUsage;
  }

  async incrementUsageShare(id: string, platform: string): Promise<void> {
    const usage = this.greetingTemplateUsage.get(id);
    if (usage) {
      usage.shareCount++;
      this.greetingTemplateUsage.set(id, usage);
      
      // Also increment share count on the template
      await this.incrementTemplateShare(usage.templateId);
    }
  }

  // Employee Attendance Methods
  async getAttendance(id: string): Promise<Attendance | undefined> {
    return this.attendance.get(id);
  }

  async getAttendanceByEmployee(employeeId: string, vendorId: string): Promise<Attendance[]> {
    return Array.from(this.attendance.values())
      .filter(a => a.employeeId === employeeId && a.vendorId === vendorId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getAttendanceByVendor(vendorId: string, filters?: {
    startDate?: Date;
    endDate?: Date;
    employeeId?: string;
    status?: string;
  }): Promise<Attendance[]> {
    let results = Array.from(this.attendance.values()).filter(a => a.vendorId === vendorId);

    if (filters?.startDate) {
      results = results.filter(a => a.date >= filters.startDate!);
    }
    if (filters?.endDate) {
      results = results.filter(a => a.date <= filters.endDate!);
    }
    if (filters?.employeeId) {
      results = results.filter(a => a.employeeId === filters.employeeId);
    }
    if (filters?.status) {
      results = results.filter(a => a.status === filters.status);
    }

    return results.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async createAttendance(attendance: InsertAttendance): Promise<Attendance> {
    const newAttendance: Attendance = {
      id: nanoid(),
      ...attendance,
      createdAt: new Date(),
    };
    this.attendance.set(newAttendance.id, newAttendance);
    return newAttendance;
  }

  async updateAttendance(id: string, updates: Partial<Attendance>): Promise<Attendance | undefined> {
    const attendance = this.attendance.get(id);
    if (attendance) {
      const updated = { ...attendance, ...updates };
      this.attendance.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteAttendance(id: string): Promise<void> {
    this.attendance.delete(id);
  }

  // Customer Attendance Methods
  async getCustomerAttendance(id: string): Promise<CustomerAttendance | undefined> {
    return this.customerAttendance.get(id);
  }

  async getCustomerAttendanceByCustomer(customerId: string, vendorId: string): Promise<CustomerAttendance[]> {
    return Array.from(this.customerAttendance.values())
      .filter(a => a.customerId === customerId && a.vendorId === vendorId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getCustomerAttendanceByVendor(vendorId: string, filters?: {
    startDate?: Date;
    endDate?: Date;
    customerId?: string;
    status?: string;
  }): Promise<CustomerAttendance[]> {
    let results = Array.from(this.customerAttendance.values()).filter(a => a.vendorId === vendorId);

    if (filters?.startDate) {
      results = results.filter(a => a.date >= filters.startDate!);
    }
    if (filters?.endDate) {
      results = results.filter(a => a.date <= filters.endDate!);
    }
    if (filters?.customerId) {
      results = results.filter(a => a.customerId === filters.customerId);
    }
    if (filters?.status) {
      results = results.filter(a => a.status === filters.status);
    }

    return results.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async createCustomerAttendance(attendance: InsertCustomerAttendance): Promise<CustomerAttendance> {
    const newAttendance: CustomerAttendance = {
      id: nanoid(),
      ...attendance,
      createdAt: new Date(),
    };
    this.customerAttendance.set(newAttendance.id, newAttendance);
    return newAttendance;
  }

  async updateCustomerAttendance(id: string, updates: Partial<CustomerAttendance>): Promise<CustomerAttendance | undefined> {
    const attendance = this.customerAttendance.get(id);
    if (attendance) {
      const updated = { ...attendance, ...updates };
      this.customerAttendance.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteCustomerAttendance(id: string): Promise<void> {
    this.customerAttendance.delete(id);
  }

  // Leave Management Methods
  async getLeave(id: string): Promise<Leave | undefined> {
    return this.leaves.get(id);
  }

  async getLeavesByEmployee(employeeId: string, vendorId: string): Promise<Leave[]> {
    return Array.from(this.leaves.values())
      .filter(l => l.employeeId === employeeId && l.vendorId === vendorId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getLeavesByVendor(vendorId: string, filters?: {
    startDate?: Date;
    endDate?: Date;
    employeeId?: string;
    status?: string;
    leaveType?: string;
  }): Promise<Leave[]> {
    let results = Array.from(this.leaves.values()).filter(l => l.vendorId === vendorId);

    if (filters?.startDate) {
      results = results.filter(l => l.startDate >= filters.startDate!);
    }
    if (filters?.endDate) {
      results = results.filter(l => l.endDate <= filters.endDate!);
    }
    if (filters?.employeeId) {
      results = results.filter(l => l.employeeId === filters.employeeId);
    }
    if (filters?.status) {
      results = results.filter(l => l.status === filters.status);
    }
    if (filters?.leaveType) {
      results = results.filter(l => l.leaveType === filters.leaveType);
    }

    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createLeave(leave: InsertLeave): Promise<Leave> {
    const newLeave: Leave = {
      id: nanoid(),
      ...leave,
      // Preserve approval fields if status is "approved"
      approvedBy: leave.status === "approved" ? (leave as any).approvedBy || null : null,
      approvedAt: leave.status === "approved" ? ((leave as any).approvedAt ? new Date((leave as any).approvedAt) : new Date()) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.leaves.set(newLeave.id, newLeave);
    return newLeave;
  }

  async updateLeave(id: string, updates: Partial<Leave>): Promise<Leave | undefined> {
    const leave = this.leaves.get(id);
    if (leave) {
      const updated = { ...leave, ...updates, updatedAt: new Date() };
      this.leaves.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async approveLeave(id: string, approvedBy: string): Promise<Leave | undefined> {
    const leave = this.leaves.get(id);
    if (leave) {
      const updated = {
        ...leave,
        status: "approved",
        approvedBy,
        approvedAt: new Date(),
        updatedAt: new Date(),
      };
      this.leaves.set(id, updated);

      // Deduct from leave balance
      const balance = await this.getLeaveBalance(leave.employeeId, leave.vendorId, leave.leaveType, new Date().getFullYear());
      if (balance) {
        await this.updateLeaveBalance(balance.id, {
          usedDays: balance.usedDays + leave.numberOfDays,
          remainingDays: balance.remainingDays - leave.numberOfDays,
        });
      }

      return updated;
    }
    return undefined;
  }

  async rejectLeave(id: string, rejectedBy: string, reason?: string): Promise<Leave | undefined> {
    const leave = this.leaves.get(id);
    if (leave) {
      const updated = {
        ...leave,
        status: "rejected",
        rejectedBy,
        rejectionReason: reason || null,
        updatedAt: new Date(),
      };
      this.leaves.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteLeave(id: string): Promise<void> {
    this.leaves.delete(id);
  }

  // Leave Balance Methods
  async getLeaveBalance(employeeId: string, vendorId: string, leaveType: string, year: number): Promise<LeaveBalance | undefined> {
    return Array.from(this.leaveBalances.values()).find(
      b => b.employeeId === employeeId && b.vendorId === vendorId && b.leaveType === leaveType && b.year === year
    );
  }

  async getLeaveBalancesByEmployee(employeeId: string, vendorId: string): Promise<LeaveBalance[]> {
    return Array.from(this.leaveBalances.values())
      .filter(b => b.employeeId === employeeId && b.vendorId === vendorId)
      .sort((a, b) => b.year - a.year);
  }

  async createLeaveBalance(balance: InsertLeaveBalance): Promise<LeaveBalance> {
    const newBalance: LeaveBalance = {
      id: nanoid(),
      ...balance,
      updatedAt: new Date(),
    };
    this.leaveBalances.set(newBalance.id, newBalance);
    return newBalance;
  }

  async updateLeaveBalance(id: string, updates: Partial<LeaveBalance>): Promise<LeaveBalance | undefined> {
    const balance = this.leaveBalances.get(id);
    if (balance) {
      const updated = { ...balance, ...updates, updatedAt: new Date() };
      this.leaveBalances.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // POS Bills Methods
  async getBill(id: string): Promise<Bill | undefined> {
    return this.bills.get(id);
  }

  async getBillsByVendor(vendorId: string, filters?: { status?: string; paymentStatus?: string; customerId?: string }): Promise<Bill[]> {
    let bills = Array.from(this.bills.values()).filter(b => b.vendorId === vendorId);
    
    if (filters) {
      if (filters.status) bills = bills.filter(b => b.status === filters.status);
      if (filters.paymentStatus) bills = bills.filter(b => b.paymentStatus === filters.paymentStatus);
      if (filters.customerId) bills = bills.filter(b => b.customerId === filters.customerId);
    }
    
    return bills.sort((a, b) => b.billDate.getTime() - a.billDate.getTime());
  }

  async createBill(bill: InsertBill): Promise<Bill> {
    const id = nanoid();
    const now = new Date();
    
    const newBill: Bill = {
      ...bill,
      id,
      billDate: bill.billDate || now,
      createdAt: now,
      updatedAt: now,
    };
    
    this.bills.set(id, newBill);
    return newBill;
  }

  async updateBill(id: string, updates: Partial<Bill>): Promise<Bill | undefined> {
    const bill = this.bills.get(id);
    if (!bill) return undefined;
    
    const updated: Bill = {
      ...bill,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.bills.set(id, updated);
    return updated;
  }

  async completeBill(id: string): Promise<Bill | undefined> {
    const bill = this.bills.get(id);
    if (!bill) return undefined;
    
    const updated: Bill = {
      ...bill,
      status: "completed",
      updatedAt: new Date(),
    };
    
    this.bills.set(id, updated);
    return updated;
  }

  // POS Bill Items Methods
  async getBillItems(billId: string): Promise<BillItem[]> {
    return Array.from(this.billItems.values())
      .filter(item => item.billId === billId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async addBillItem(item: InsertBillItem): Promise<BillItem> {
    const id = nanoid();
    const now = new Date();
    
    const newItem: BillItem = {
      ...item,
      id,
      createdAt: now,
    };
    
    this.billItems.set(id, newItem);
    
    // Update bill totals
    await this.recalculateBillTotals(item.billId);
    
    return newItem;
  }

  async updateBillItem(id: string, updates: Partial<BillItem>): Promise<BillItem | undefined> {
    const item = this.billItems.get(id);
    if (!item) return undefined;
    
    const updated: BillItem = {
      ...item,
      ...updates,
    };
    
    this.billItems.set(id, updated);
    
    // Update bill totals
    await this.recalculateBillTotals(item.billId);
    
    return updated;
  }

  async removeBillItem(id: string): Promise<void> {
    const item = this.billItems.get(id);
    if (item) {
      this.billItems.delete(id);
      // Update bill totals
      await this.recalculateBillTotals(item.billId);
    }
  }

  // POS Bill Payments Methods
  async getBillPayments(billId: string): Promise<BillPayment[]> {
    return Array.from(this.billPayments.values())
      .filter(payment => payment.billId === billId)
      .sort((a, b) => a.paymentDate.getTime() - b.paymentDate.getTime());
  }

  async recordPayment(payment: InsertBillPayment): Promise<BillPayment> {
    const id = nanoid();
    const now = new Date();
    
    const newPayment: BillPayment = {
      ...payment,
      id,
      paymentDate: payment.paymentDate || now,
      createdAt: now,
    };
    
    this.billPayments.set(id, newPayment);
    
    // Update bill payment status
    const bill = this.bills.get(payment.billId);
    if (bill) {
      const totalPaid = parseFloat(bill.paidAmount || '0') + parseFloat(payment.amount);
      const totalAmount = parseFloat(bill.totalAmount);
      const dueAmount = totalAmount - totalPaid;
      
      let paymentStatus: string = 'unpaid';
      if (totalPaid >= totalAmount) {
        paymentStatus = 'paid';
      } else if (totalPaid > 0) {
        paymentStatus = 'partial';
      } else if (dueAmount === totalAmount) {
        paymentStatus = 'credit';
      }
      
      await this.updateBill(payment.billId, {
        paidAmount: totalPaid.toFixed(2),
        dueAmount: dueAmount.toFixed(2),
        paymentStatus,
      });
    }
    
    return newPayment;
  }

  // Additional Services
  async getAllAdditionalServices(activeOnly: boolean = false): Promise<AdditionalService[]> {
    const allServices = Array.from(this.additionalServices.values());
    if (activeOnly) {
      return allServices.filter(s => s.isActive);
    }
    return allServices;
  }

  async getAdditionalService(id: string): Promise<AdditionalService | undefined> {
    return this.additionalServices.get(id);
  }

  async createAdditionalService(service: InsertAdditionalService): Promise<AdditionalService> {
    const id = randomUUID();
    const now = new Date();
    const newService: AdditionalService = {
      ...service,
      id,
      features: service.features || [],
      benefits: service.benefits || [],
      images: service.images || [],
      isActive: service.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.additionalServices.set(id, newService);
    return newService;
  }

  async updateAdditionalService(id: string, updates: Partial<InsertAdditionalService>): Promise<AdditionalService | undefined> {
    const service = this.additionalServices.get(id);
    if (!service) return undefined;
    const updated = { ...service, ...updates, updatedAt: new Date() };
    this.additionalServices.set(id, updated);
    return updated;
  }

  async deleteAdditionalService(id: string): Promise<boolean> {
    return this.additionalServices.delete(id);
  }

  // Additional Service Inquiries
  async getAllAdditionalServiceInquiries(): Promise<AdditionalServiceInquiry[]> {
    return Array.from(this.additionalServiceInquiries.values());
  }

  async getAdditionalServiceInquiry(id: string): Promise<AdditionalServiceInquiry | undefined> {
    return this.additionalServiceInquiries.get(id);
  }

  async createAdditionalServiceInquiry(inquiry: InsertAdditionalServiceInquiry): Promise<AdditionalServiceInquiry> {
    const id = randomUUID();
    const now = new Date();
    const newInquiry: AdditionalServiceInquiry = {
      ...inquiry,
      id,
      status: inquiry.status || "pending",
      createdAt: now,
      updatedAt: now,
    };
    this.additionalServiceInquiries.set(id, newInquiry);
    return newInquiry;
  }

  async updateAdditionalServiceInquiry(id: string, updates: Partial<InsertAdditionalServiceInquiry>): Promise<AdditionalServiceInquiry | undefined> {
    const inquiry = this.additionalServiceInquiries.get(id);
    if (!inquiry) return undefined;
    const updated = { ...inquiry, ...updates, updatedAt: new Date() };
    this.additionalServiceInquiries.set(id, updated);
    return updated;
  }

  // Helper method to recalculate bill totals
  private async recalculateBillTotals(billId: string): Promise<void> {
    const items = await this.getBillItems(billId);
    const bill = this.bills.get(billId);
    if (!bill) return;
    
    const subtotal = items.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0);
    const discountAmount = parseFloat(bill.discountAmount || '0');
    const taxAmount = parseFloat(bill.taxAmount || '0');
    const serviceCharges = parseFloat(bill.serviceCharges || '0');
    const totalAmount = subtotal - discountAmount + taxAmount + serviceCharges;
    const paidAmount = parseFloat(bill.paidAmount || '0');
    const dueAmount = totalAmount - paidAmount;
    
    await this.updateBill(billId, {
      subtotal: subtotal.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      dueAmount: dueAmount.toFixed(2),
    });
  }
}

import { supabaseStorage } from "./supabaseStorage";

class HybridStorage implements IStorage {
  private memStorage = new MemStorage();
  private supabaseStorage = supabaseStorage;

  async getUser(id: string): Promise<User | undefined> {
    return this.supabaseStorage.getUser(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.supabaseStorage.getUserByEmail(email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.supabaseStorage.getUserByUsername(username);
  }

  async createUser(user: InsertUser): Promise<User> {
    return this.supabaseStorage.createUser(user);
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    return this.supabaseStorage.updateUser(id, updates);
  }

  async getUsersByRole(role: string): Promise<User[]> {
    console.log('[DATABASE] Fetching users by role from PostgreSQL:', role);
    return this.supabaseStorage.getUsersByRole!(role);
  }

  async getVendor(id: string): Promise<Vendor | undefined> {
    return this.supabaseStorage.getVendor(id);
  }

  async getVendorByUserId(userId: string): Promise<Vendor | undefined> {
    return this.supabaseStorage.getVendorByUserId(userId);
  }

  async getAllVendors(): Promise<Vendor[]> {
    return this.supabaseStorage.getAllVendors();
  }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    return this.supabaseStorage.createVendor(vendor);
  }

  async updateVendor(id: string, updates: Partial<InsertVendor>): Promise<Vendor | undefined> {
    return this.supabaseStorage.updateVendor(id, updates);
  }

  // Category methods - NOW USING DATABASE! 💾
  getCategory(id: string): Promise<Category | undefined> {
    return this.supabaseStorage.getCategory!(id);
  }

  getAllCategories(): Promise<Category[]> {
    console.log('[DATABASE] Fetching categories from PostgreSQL');
    return this.supabaseStorage.getAllCategories!();
  }

  createCategory(category: InsertCategory): Promise<Category> {
    console.log('[DATABASE] Creating category in PostgreSQL');
    return this.supabaseStorage.createCategory!(category);
  }

  updateCategory(id: string, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    console.log('[DATABASE] Updating category in PostgreSQL:', id);
    return this.supabaseStorage.updateCategory!(id, updates) as Promise<Category | undefined>;
  }

  deleteCategory(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting category from PostgreSQL:', id);
    return this.supabaseStorage.deleteCategory!(id);
  }

  // Subcategory methods - NOW USING DATABASE! 💾
  getSubcategory(id: string): Promise<Subcategory | undefined> {
    return this.supabaseStorage.getSubcategory!(id);
  }

  getSubcategoriesByCategory(categoryId: string): Promise<Subcategory[]> {
    return this.supabaseStorage.getSubcategoriesByCategory!(categoryId);
  }

  getAllSubcategories(): Promise<Subcategory[]> {
    return this.supabaseStorage.getAllSubcategories!();
  }

  createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory> {
    console.log('[DATABASE] Creating subcategory in PostgreSQL');
    return this.supabaseStorage.createSubcategory!(subcategory);
  }

  updateSubcategory(id: string, updates: Partial<InsertSubcategory>): Promise<Subcategory | undefined> {
    return this.supabaseStorage.updateSubcategory!(id, updates) as Promise<Subcategory | undefined>;
  }

  deleteSubcategory(id: string): Promise<boolean> {
    return this.supabaseStorage.deleteSubcategory!(id);
  }

  // Brand methods - NOW USING DATABASE! 💾
  getBrand(id: string): Promise<Brand | undefined> {
    return this.supabaseStorage.getBrand!(id);
  }

  getAllBrands(): Promise<Brand[]> {
    console.log('[DATABASE] Fetching brands from PostgreSQL');
    return this.supabaseStorage.getAllBrands!();
  }

  getBrandsByCategory(categoryId: string): Promise<Brand[]> {
    console.log('[DATABASE] Fetching brands by category from PostgreSQL:', categoryId);
    return this.supabaseStorage.getBrandsByCategory!(categoryId);
  }

  createBrand(brand: InsertBrand): Promise<Brand> {
    console.log('[DATABASE] Creating brand in PostgreSQL');
    return this.supabaseStorage.createBrand!(brand);
  }

  updateBrand(id: string, updates: Partial<InsertBrand>): Promise<Brand | undefined> {
    console.log('[DATABASE] Updating brand in PostgreSQL:', id);
    return this.supabaseStorage.updateBrand!(id, updates) as Promise<Brand | undefined>;
  }

  deleteBrand(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting brand from PostgreSQL:', id);
    return this.supabaseStorage.deleteBrand!(id);
  }

  // Unit methods - NOW USING DATABASE! 💾
  getUnit(id: string): Promise<Unit | undefined> {
    return this.supabaseStorage.getUnit!(id);
  }

  getUnitsBySubcategory(subcategoryId: string): Promise<Unit[]> {
    // Keep using memStorage (can be migrated later)
    return this.memStorage.getUnitsBySubcategory(subcategoryId);
  }

  getAllUnits(): Promise<Unit[]> {
    return this.supabaseStorage.getAllUnits!();
  }

  createUnit(unit: InsertUnit): Promise<Unit> {
    console.log('[DATABASE] Creating unit in PostgreSQL');
    return this.supabaseStorage.createUnit!(unit);
  }

  updateUnit(id: string, updates: Partial<InsertUnit>): Promise<Unit | undefined> {
    return this.supabaseStorage.updateUnit!(id, updates) as Promise<Unit | undefined>;
  }

  deleteUnit(id: string): Promise<boolean> {
    return this.supabaseStorage.deleteUnit!(id);
  }

  // Master Service methods - NOW USING DATABASE! 💾
  getMasterService(id: string): Promise<MasterService | undefined> {
    return this.supabaseStorage.getMasterService!(id);
  }

  getMasterServicesByCategory(category?: string, subcategory?: string): Promise<MasterService[]> {
    console.log('[DATABASE] Fetching master services from PostgreSQL');
    return this.supabaseStorage.getMasterServicesByCategory!(category, subcategory);
  }

  getAllMasterServices(): Promise<MasterService[]> {
    return this.supabaseStorage.getAllMasterServices!();
  }

  getAllCatalogue(filters: Partial<any>): Promise<{ services: MasterService[]; total: number }> {
    console.log('[DATABASE] Fetching all catalogue with filters from PostgreSQL');
    return this.supabaseStorage.getAllCatalogue!(filters);
  }

  searchMasterServices(query: string): Promise<MasterService[]> {
    return this.supabaseStorage.searchMasterServices!(query);
  }

  createMasterService(service: InsertMasterService): Promise<MasterService> {
    console.log('[DATABASE] Creating master service in PostgreSQL');
    return this.supabaseStorage.createMasterService!(service);
  }

  updateMasterService(id: string, updates: Partial<InsertMasterService>): Promise<MasterService | undefined> {
    console.log('[DATABASE] Updating master service in PostgreSQL:', id);
    return this.supabaseStorage.updateMasterService!(id, updates) as Promise<MasterService | undefined>;
  }

  deleteMasterService(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting master service from PostgreSQL:', id);
    return this.supabaseStorage.deleteMasterService!(id);
  }

  // Vendor Catalogue methods - NOW USING DATABASE! 💾
  getVendorCatalogue(id: string): Promise<VendorCatalogue | undefined> {
    return this.supabaseStorage.getVendorCatalogue!(id);
  }

  getVendorCatalogueByVendorId(vendorId: string): Promise<VendorCatalogue[]> {
    console.log('[DATABASE] Fetching vendor catalogues from PostgreSQL:', vendorId);
    return this.supabaseStorage.getVendorCatalogueByVendorId!(vendorId);
  }

  getVendorCataloguesByVendor(vendorId: string): Promise<VendorCatalogue[]> {
    console.log('[DATABASE] Fetching vendor catalogues from PostgreSQL:', vendorId);
    return this.supabaseStorage.getVendorCataloguesByVendor!(vendorId);
  }

  createVendorCatalogue(service: InsertVendorCatalogue): Promise<VendorCatalogue> {
    console.log('[DATABASE] Creating vendor catalogue in PostgreSQL');
    return this.supabaseStorage.createVendorCatalogue!(service);
  }

  updateVendorCatalogue(id: string, updates: Partial<InsertVendorCatalogue>): Promise<VendorCatalogue | undefined> {
    console.log('[DATABASE] Updating vendor catalogue in PostgreSQL:', id);
    return this.supabaseStorage.updateVendorCatalogue!(id, updates) as Promise<VendorCatalogue | undefined>;
  }

  deleteVendorCatalogue(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting vendor catalogue from PostgreSQL:', id);
    return this.supabaseStorage.deleteVendorCatalogue!(id);
  }

  // Custom Service Request methods - NOW USING DATABASE! 💾
  getCustomServiceRequest(id: string): Promise<CustomServiceRequest | undefined> {
    return this.supabaseStorage.getCustomServiceRequest!(id);
  }

  getCustomServiceRequestsByVendor(vendorId: string, status?: string): Promise<CustomServiceRequest[]> {
    console.log('[DATABASE] Fetching custom service requests from PostgreSQL:', vendorId);
    return this.supabaseStorage.getCustomServiceRequestsByVendor!(vendorId, status);
  }

  getAllCustomServiceRequests(status?: string): Promise<CustomServiceRequest[]> {
    return this.supabaseStorage.getAllCustomServiceRequests!(status);
  }

  createCustomServiceRequest(request: InsertCustomServiceRequest): Promise<CustomServiceRequest> {
    console.log('[DATABASE] Creating custom service request in PostgreSQL');
    return this.supabaseStorage.createCustomServiceRequest!(request);
  }

  updateCustomServiceRequest(id: string, updates: Partial<InsertCustomServiceRequest>): Promise<CustomServiceRequest | undefined> {
    console.log('[DATABASE] Updating custom service request in PostgreSQL:', id);
    return this.supabaseStorage.updateCustomServiceRequest!(id, updates) as Promise<CustomServiceRequest | undefined>;
  }

  deleteCustomServiceRequest(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting custom service request from PostgreSQL:', id);
    return this.supabaseStorage.deleteCustomServiceRequest!(id);
  }

  // Booking methods - NOW USING DATABASE! 💾
  getBooking(id: string): Promise<Booking | undefined> {
    return this.supabaseStorage.getBooking!(id);
  }

  getBookingsByVendor(vendorId: string, status?: string): Promise<Booking[]> {
    console.log('[DATABASE] Fetching bookings from PostgreSQL:', vendorId);
    return this.supabaseStorage.getBookingsByVendor!(vendorId, status);
  }

  createBooking(booking: InsertBooking): Promise<Booking> {
    console.log('[DATABASE] Creating booking in PostgreSQL');
    return this.supabaseStorage.createBooking!(booking);
  }

  updateBooking(id: string, updates: Partial<InsertBooking>): Promise<Booking | undefined> {
    console.log('[DATABASE] Updating booking in PostgreSQL:', id);
    return this.supabaseStorage.updateBooking!(id, updates) as Promise<Booking | undefined>;
  }

  deleteBooking(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting booking from PostgreSQL:', id);
    return this.supabaseStorage.deleteBooking!(id);
  }

  // Appointment methods - NOW USING DATABASE! 💾
  getAppointment(id: string): Promise<Appointment | undefined> {
    return this.supabaseStorage.getAppointment!(id);
  }

  getAppointmentsByVendor(vendorId: string, status?: string): Promise<Appointment[]> {
    console.log('[DATABASE] Fetching appointments from PostgreSQL:', vendorId);
    return this.supabaseStorage.getAppointmentsByVendor!(vendorId, status);
  }

  createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    console.log('[DATABASE] Creating appointment in PostgreSQL');
    return this.supabaseStorage.createAppointment!(appointment);
  }

  updateAppointment(id: string, updates: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    console.log('[DATABASE] Updating appointment in PostgreSQL:', id);
    return this.supabaseStorage.updateAppointment!(id, updates) as Promise<Appointment | undefined>;
  }

  deleteAppointment(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting appointment from PostgreSQL:', id);
    return this.supabaseStorage.deleteAppointment!(id);
  }

  // Employee methods - NOW USING DATABASE! 💾
  getEmployee(id: string): Promise<Employee | undefined> {
    return this.supabaseStorage.getEmployee!(id);
  }

  getEmployeesByVendor(vendorId: string, status?: string): Promise<Employee[]> {
    console.log('[DATABASE] Fetching employees from PostgreSQL:', vendorId);
    return this.supabaseStorage.getEmployeesByVendor!(vendorId, status);
  }

  createEmployee(employee: InsertEmployee): Promise<Employee> {
    console.log('[DATABASE] Creating employee in PostgreSQL');
    return this.supabaseStorage.createEmployee!(employee);
  }

  updateEmployee(id: string, updates: Partial<InsertEmployee>): Promise<Employee | undefined> {
    console.log('[DATABASE] Updating employee in PostgreSQL:', id);
    return this.supabaseStorage.updateEmployee!(id, updates) as Promise<Employee | undefined>;
  }

  deleteEmployee(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting employee from PostgreSQL:', id);
    return this.supabaseStorage.deleteEmployee!(id);
  }

  // Task Management - NOW USING DATABASE! 💾
  getTask(id: string): Promise<Task | undefined> {
    console.log('[DATABASE] Fetching task from PostgreSQL:', id);
    return this.supabaseStorage.getTask!(id);
  }

  getTasksByVendor(vendorId: string, status?: string, assignedTo?: string): Promise<Task[]> {
    console.log('[DATABASE] Fetching tasks by vendor from PostgreSQL:', vendorId);
    const filters: any = {};
    if (status) filters.status = status;
    if (assignedTo) filters.assignedTo = assignedTo;
    return this.supabaseStorage.getTasksByVendor!(vendorId, filters);
  }

  getTasksByEmployee(employeeId: string): Promise<Task[]> {
    console.log('[DATABASE] Fetching tasks by employee from PostgreSQL:', employeeId);
    return this.supabaseStorage.getTasksByEmployee!(employeeId);
  }

  createTask(task: InsertTask): Promise<Task> {
    console.log('[DATABASE] Creating task in PostgreSQL');
    return this.supabaseStorage.createTask!(task);
  }

  updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    console.log('[DATABASE] Updating task in PostgreSQL:', id);
    return this.supabaseStorage.updateTask!(id, updates as Partial<Task>);
  }

  deleteTask(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting task from PostgreSQL:', id);
    return this.supabaseStorage.deleteTask!(id);
  }

  // Attendance methods - NOW USING DATABASE! 💾
  getAttendance(id: string): Promise<Attendance | undefined> {
    // Keep using memStorage (can be migrated later)
    return this.memStorage.getAttendance(id);
  }

  getAttendanceByEmployee(employeeId: string, startDate?: Date, endDate?: Date): Promise<Attendance[]> {
    console.log('[DATABASE] Fetching attendance from PostgreSQL:', employeeId);
    return this.supabaseStorage.getAttendanceByEmployee!(employeeId, startDate, endDate);
  }

  getAttendanceByVendor(vendorId: string, filters?: {
    startDate?: Date;
    endDate?: Date;
    employeeId?: string;
    status?: string;
  }): Promise<Attendance[]> {
    console.log('[DATABASE] Fetching attendance by vendor from PostgreSQL:', vendorId);
    return this.supabaseStorage.getAttendanceByVendor!(vendorId, filters);
  }

  createAttendance(attendance: InsertAttendance): Promise<Attendance> {
    console.log('[DATABASE] Creating attendance in PostgreSQL');
    return this.supabaseStorage.createAttendance!(attendance);
  }

  updateAttendance(id: string, updates: Partial<InsertAttendance>): Promise<Attendance | undefined> {
    console.log('[DATABASE] Updating attendance in PostgreSQL:', id);
    return this.supabaseStorage.updateAttendance!(id, updates) as Promise<Attendance | undefined>;
  }

  deleteAttendance(id: string): Promise<void> {
    console.log('[DATABASE] Deleting attendance from PostgreSQL:', id);
    return this.supabaseStorage.deleteAttendance!(id);
  }

  // Customer Attendance methods - NOW USING DATABASE! 💾
  getCustomerAttendance(id: string): Promise<CustomerAttendance | undefined> {
    console.log('[DATABASE] Fetching customer attendance from PostgreSQL:', id);
    return this.supabaseStorage.getCustomerAttendance!(id);
  }

  getCustomerAttendanceByCustomer(customerId: string, vendorId: string): Promise<CustomerAttendance[]> {
    console.log('[DATABASE] Fetching customer attendance by customer from PostgreSQL:', customerId);
    return this.supabaseStorage.getCustomerAttendanceByCustomer!(customerId, vendorId);
  }

  getCustomerAttendanceByVendor(vendorId: string, filters?: {
    startDate?: Date;
    endDate?: Date;
    customerId?: string;
    status?: string;
  }): Promise<CustomerAttendance[]> {
    console.log('[DATABASE] Fetching customer attendance by vendor from PostgreSQL:', vendorId);
    return this.supabaseStorage.getCustomerAttendanceByVendor!(vendorId, filters);
  }

  createCustomerAttendance(attendance: InsertCustomerAttendance): Promise<CustomerAttendance> {
    console.log('[DATABASE] Creating customer attendance in PostgreSQL');
    return this.supabaseStorage.createCustomerAttendance!(attendance);
  }

  updateCustomerAttendance(id: string, updates: Partial<CustomerAttendance>): Promise<CustomerAttendance | undefined> {
    console.log('[DATABASE] Updating customer attendance in PostgreSQL:', id);
    return this.supabaseStorage.updateCustomerAttendance!(id, updates);
  }

  deleteCustomerAttendance(id: string): Promise<void> {
    console.log('[DATABASE] Deleting customer attendance from PostgreSQL:', id);
    return this.supabaseStorage.deleteCustomerAttendance!(id);
  }

  // Leave Management - NOW USING DATABASE! 💾
  getLeave(id: string): Promise<Leave | undefined> {
    console.log('[DATABASE] Fetching leave from PostgreSQL:', id);
    return this.supabaseStorage.getLeave!(id);
  }

  getLeavesByEmployee(employeeId: string): Promise<Leave[]> {
    console.log('[DATABASE] Fetching leaves by employee from PostgreSQL:', employeeId);
    return this.supabaseStorage.getLeavesByEmployee!(employeeId);
  }

  getLeavesByVendor(vendorId: string): Promise<Leave[]> {
    console.log('[DATABASE] Fetching leaves by vendor from PostgreSQL:', vendorId);
    return this.supabaseStorage.getLeavesByVendor!(vendorId);
  }

  createLeave(leave: InsertLeave): Promise<Leave> {
    console.log('[DATABASE] Creating leave in PostgreSQL');
    return this.supabaseStorage.createLeave!(leave);
  }

  updateLeave(id: string, updates: Partial<InsertLeave>): Promise<Leave | undefined> {
    console.log('[DATABASE] Updating leave in PostgreSQL:', id);
    return this.supabaseStorage.updateLeave!(id, updates as Partial<Leave>);
  }

  deleteLeave(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting leave from PostgreSQL:', id);
    return this.supabaseStorage.deleteLeave!(id).then(() => true);
  }

  getLeaveBalance(employeeId: string, year: number): Promise<LeaveBalance | undefined> {
    return this.memStorage.getLeaveBalance(employeeId, year);
  }

  createLeaveBalance(balance: InsertLeaveBalance): Promise<LeaveBalance> {
    return this.memStorage.createLeaveBalance(balance);
  }

  updateLeaveBalance(employeeId: string, year: number, updates: Partial<InsertLeaveBalance>): Promise<LeaveBalance | undefined> {
    return this.memStorage.updateLeaveBalance(employeeId, year, updates);
  }

  getPayroll(id: string): Promise<Payroll | undefined> {
    return this.memStorage.getPayroll(id);
  }

  getPayrollByEmployee(employeeId: string): Promise<Payroll[]> {
    return this.memStorage.getPayrollByEmployee(employeeId);
  }

  getPayrollByVendor(vendorId: string, month?: number, year?: number): Promise<Payroll[]> {
    return this.memStorage.getPayrollByVendor(vendorId, month, year);
  }

  createPayroll(payroll: InsertPayroll): Promise<Payroll> {
    return this.memStorage.createPayroll(payroll);
  }

  updatePayroll(id: string, updates: Partial<InsertPayroll>): Promise<Payroll | undefined> {
    return this.memStorage.updatePayroll(id, updates);
  }

  deletePayroll(id: string): Promise<boolean> {
    return this.memStorage.deletePayroll(id);
  }

  getHoliday(id: string): Promise<Holiday | undefined> {
    return this.memStorage.getHoliday(id);
  }

  getHolidaysByVendor(vendorId: string, year?: number): Promise<Holiday[]> {
    return this.memStorage.getHolidaysByVendor(vendorId, year);
  }

  createHoliday(holiday: InsertHoliday): Promise<Holiday> {
    return this.memStorage.createHoliday(holiday);
  }

  updateHoliday(id: string, updates: Partial<InsertHoliday>): Promise<Holiday | undefined> {
    return this.memStorage.updateHoliday(id, updates);
  }

  deleteHoliday(id: string): Promise<boolean> {
    return this.memStorage.deleteHoliday(id);
  }

  // Coupon methods - NOW USING DATABASE! 💾
  getCoupon(id: string): Promise<Coupon | undefined> {
    console.log('[DATABASE] Fetching coupon from PostgreSQL:', id);
    return this.supabaseStorage.getCoupon!(id);
  }

  getCouponByCode(code: string, vendorId?: string): Promise<Coupon | undefined> {
    console.log('[DATABASE] Fetching coupon by code from PostgreSQL:', code);
    return this.supabaseStorage.getCouponByCode!(code, vendorId!);
  }

  getCouponsByVendor(vendorId: string, status?: string): Promise<Coupon[]> {
    console.log('[DATABASE] Fetching coupons for vendor from PostgreSQL:', vendorId);
    return this.supabaseStorage.getCouponsByVendor!(vendorId, status);
  }

  createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    console.log('[DATABASE] Creating coupon in PostgreSQL');
    return this.supabaseStorage.createCoupon!(coupon);
  }

  updateCoupon(id: string, updates: Partial<InsertCoupon>): Promise<Coupon | undefined> {
    console.log('[DATABASE] Updating coupon in PostgreSQL:', id);
    return this.supabaseStorage.updateCoupon!(id, updates) as any;
  }

  deleteCoupon(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting coupon from PostgreSQL:', id);
    return this.supabaseStorage.deleteCoupon!(id);
  }

  getTransaction(id: string): Promise<Transaction | undefined> {
    return this.memStorage.getTransaction(id);
  }

  getTransactionsByVendor(vendorId: string, type?: string): Promise<Transaction[]> {
    return this.memStorage.getTransactionsByVendor(vendorId, type);
  }

  createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    return this.memStorage.createTransaction(transaction);
  }

  updateTransaction(id: string, updates: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    return this.memStorage.updateTransaction(id, updates);
  }

  // Notification methods - NOW USING DATABASE! 💾
  getNotification(id: string): Promise<Notification | undefined> {
    console.log('[DATABASE] Fetching notification from PostgreSQL:', id);
    return this.supabaseStorage.getNotification(id);
  }

  getNotificationsByVendor(vendorId: string, isRead?: boolean): Promise<Notification[]> {
    console.log('[DATABASE] Fetching notifications for vendor from PostgreSQL:', vendorId);
    return this.supabaseStorage.getNotificationsByVendor(vendorId, isRead);
  }

  createNotification(notification: InsertNotification): Promise<Notification> {
    console.log('[DATABASE] Creating notification in PostgreSQL');
    return this.supabaseStorage.createNotification(notification);
  }

  markNotificationAsRead(id: string): Promise<Notification | undefined> {
    console.log('[DATABASE] Marking notification as read in PostgreSQL:', id);
    return this.supabaseStorage.markNotificationAsRead(id) as any;
  }

  updateNotification(id: string, updates: Partial<Notification>): Promise<Notification | undefined> {
    console.log('[DATABASE] Updating notification in PostgreSQL:', id);
    return this.supabaseStorage.updateNotification!(id, updates) as any;
  }

  markAllVendorNotificationsAsRead(vendorId: string): Promise<void> {
    console.log('[DATABASE] Marking all vendor notifications as read in PostgreSQL:', vendorId);
    return this.supabaseStorage.markAllVendorNotificationsAsRead!(vendorId);
  }

  deleteNotification(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting notification from PostgreSQL:', id);
    return this.supabaseStorage.deleteNotification(id);
  }

  getMasterProduct(id: string): Promise<MasterProduct | undefined> {
    console.log('[DATABASE] Fetching master product from PostgreSQL:', id);
    return this.supabaseStorage.getMasterProduct!(id);
  }

  getMasterProductsByCategory(category: string, subcategory?: string): Promise<MasterProduct[]> {
    console.log('[DATABASE] Fetching master products by category from PostgreSQL:', category, subcategory);
    return this.supabaseStorage.getMasterProductsByCategory!(category, subcategory);
  }

  getAllMasterProducts(): Promise<MasterProduct[]> {
    console.log('[DATABASE] Fetching all master products from PostgreSQL');
    return this.supabaseStorage.getAllMasterProducts!();
  }

  searchMasterProducts(query: string): Promise<MasterProduct[]> {
    console.log('[DATABASE] Searching master products in PostgreSQL:', query);
    return this.supabaseStorage.searchMasterProducts!(query);
  }

  createMasterProduct(product: InsertMasterProduct): Promise<MasterProduct> {
    console.log('[DATABASE] Creating master product in PostgreSQL');
    return this.supabaseStorage.createMasterProduct!(product);
  }

  updateMasterProduct(id: string, updates: Partial<InsertMasterProduct>): Promise<MasterProduct | undefined> {
    console.log('[DATABASE] Updating master product in PostgreSQL:', id);
    return this.supabaseStorage.updateMasterProduct!(id, updates);
  }

  deleteMasterProduct(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting master product from PostgreSQL:', id);
    return this.supabaseStorage.deleteMasterProduct!(id);
  }

  getVendorProduct(id: string): Promise<VendorProduct | undefined> {
    console.log('[DATABASE] Fetching vendor product from PostgreSQL:', id);
    return this.supabaseStorage.getVendorProduct!(id);
  }

  getVendorProductsByVendor(vendorId: string): Promise<VendorProduct[]> {
    console.log('[DATABASE] Fetching vendor products from PostgreSQL:', vendorId);
    return this.supabaseStorage.getVendorProductsByVendor!(vendorId);
  }

  getAllProducts(filters: Partial<any>): Promise<{ products: VendorProduct[]; total: number }> {
    console.log('[DATABASE] Fetching all products with filters from PostgreSQL');
    return this.supabaseStorage.getAllProducts!(filters);
  }

  createVendorProduct(product: InsertVendorProduct): Promise<VendorProduct> {
    console.log('[DATABASE] Creating vendor product in PostgreSQL');
    return this.supabaseStorage.createVendorProduct!(product);
  }

  updateVendorProduct(id: string, updates: Partial<InsertVendorProduct>): Promise<VendorProduct | undefined> {
    console.log('[DATABASE] Updating vendor product in PostgreSQL:', id);
    return this.supabaseStorage.updateVendorProduct!(id, updates) as Promise<VendorProduct | undefined>;
  }

  deleteVendorProduct(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting vendor product from PostgreSQL:', id);
    return this.supabaseStorage.deleteVendorProduct!(id);
  }

  adoptMasterProduct(vendorId: string, masterProductId: string, customizations?: Partial<InsertVendorProduct>): Promise<VendorProduct> {
    return this.memStorage.adoptMasterProduct(vendorId, masterProductId, customizations);
  }

  // Order methods - NOW USING DATABASE! 💾
  getOrder(id: string): Promise<Order | undefined> {
    return this.supabaseStorage.getOrder!(id);
  }

  getOrdersByVendor(vendorId: string, filters?: { status?: string }): Promise<Order[]> {
    console.log('[DATABASE] Fetching orders from PostgreSQL:', vendorId);
    return this.supabaseStorage.getOrdersByVendor!(vendorId, filters);
  }

  getOrdersByVendorAndCustomer(vendorId: string, customerId: string): Promise<Order[]> {
    console.log('[DATABASE] Fetching orders by vendor and customer from PostgreSQL:', vendorId, customerId);
    return this.supabaseStorage.getOrdersByVendorAndCustomer!(vendorId, customerId);
  }

  createOrder(order: InsertOrder): Promise<Order> {
    console.log('[DATABASE] Creating order in PostgreSQL');
    return this.supabaseStorage.createOrder!(order);
  }

  updateOrder(id: string, updates: Partial<InsertOrder>): Promise<Order | undefined> {
    console.log('[DATABASE] Updating order in PostgreSQL:', id);
    return this.supabaseStorage.updateOrder!(id, updates) as Promise<Order | undefined>;
  }

  deleteOrder(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting order from PostgreSQL:', id);
    return this.supabaseStorage.deleteOrder!(id);
  }

  // Order Item methods - NOW USING DATABASE! 💾
  getOrderItem(id: string): Promise<OrderItem | undefined> {
    console.log('[DATABASE] Fetching order item from PostgreSQL:', id);
    return this.supabaseStorage.getOrderItem(id);
  }

  getOrderItems(orderId: string): Promise<OrderItem[]> {
    console.log('[DATABASE] Fetching order items from PostgreSQL:', orderId);
    return this.supabaseStorage.getOrderItemsByOrder(orderId);
  }

  getOrderItemsByOrder(orderId: string): Promise<OrderItem[]> {
    console.log('[DATABASE] Fetching order items from PostgreSQL:', orderId);
    return this.supabaseStorage.getOrderItemsByOrder(orderId);
  }

  createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    console.log('[DATABASE] Creating order item in PostgreSQL');
    return this.supabaseStorage.createOrderItem(item);
  }

  updateOrderItem(id: string, updates: Partial<InsertOrderItem>): Promise<OrderItem | undefined> {
    console.log('[DATABASE] Updating order item in PostgreSQL:', id);
    return this.supabaseStorage.updateOrderItem(id, updates) as any;
  }

  deleteOrderItem(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting order item from PostgreSQL:', id);
    return this.supabaseStorage.deleteOrderItem(id);
  }

  // Customer methods - NOW USING DATABASE! 💾
  getCustomer(id: string): Promise<Customer | undefined> {
    return this.supabaseStorage.getCustomer!(id);
  }

  getCustomersByVendor(vendorId: string, status?: string): Promise<Customer[]> {
    console.log('[DATABASE] Fetching customers from PostgreSQL:', vendorId);
    return this.supabaseStorage.getCustomersByVendor!(vendorId, status);
  }

  getCustomerByPhone(vendorId: string, phone: string): Promise<Customer | undefined> {
    console.log('[DATABASE] Finding customer by phone from PostgreSQL:', phone);
    return this.supabaseStorage.getCustomerByPhone!(vendorId, phone);
  }

  getCustomerByEmailAndVendor(vendorId: string, email: string): Promise<Customer | undefined> {
    console.log('[DATABASE] Finding customer by email and vendor from PostgreSQL:', email, vendorId);
    return this.supabaseStorage.getCustomerByEmailAndVendor!(vendorId, email);
  }

  getAllCustomers(filters: Partial<AdminCustomersFilter>): Promise<{ customers: Customer[]; total: number }> {
    console.log('[DATABASE] Fetching all customers with filters from PostgreSQL');
    return this.supabaseStorage.getAllCustomers!(filters);
  }

  getAllCustomersWithFilters(filters: AdminCustomersFilter): Promise<{ customers: Customer[]; total: number }> {
    // Keep using memStorage for admin filters (can be migrated later)
    return this.memStorage.getAllCustomersWithFilters(filters);
  }

  getAllOrders(filters: Partial<AdminOrdersFilter>): Promise<{ orders: Order[]; total: number }> {
    console.log('[DATABASE] Fetching all orders with filters from PostgreSQL');
    return this.supabaseStorage.getAllOrders!(filters);
  }

  searchCustomers(vendorId: string, query: string): Promise<Customer[]> {
    console.log('[DATABASE] Searching customers in PostgreSQL:', query);
    return this.supabaseStorage.searchCustomers!(vendorId, query);
  }

  createCustomer(customer: InsertCustomer): Promise<Customer> {
    console.log('[DATABASE] Creating customer in PostgreSQL:', customer.name);
    return this.supabaseStorage.createCustomer!(customer);
  }

  updateCustomer(id: string, updates: Partial<InsertCustomer>): Promise<Customer | undefined> {
    console.log('[DATABASE] Updating customer in PostgreSQL:', id);
    return this.supabaseStorage.updateCustomer!(id, updates) as Promise<Customer | undefined>;
  }

  deleteCustomer(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting customer from PostgreSQL:', id);
    return this.supabaseStorage.deleteCustomer!(id);
  }

  getCustomerVisit(id: string): Promise<CustomerVisit | undefined> {
    return this.memStorage.getCustomerVisit(id);
  }

  getCustomerVisitsByCustomer(customerId: string): Promise<CustomerVisit[]> {
    return this.memStorage.getCustomerVisitsByCustomer(customerId);
  }

  getCustomerVisitsByVendor(vendorId: string): Promise<CustomerVisit[]> {
    return this.memStorage.getCustomerVisitsByVendor(vendorId);
  }

  createCustomerVisit(visit: InsertCustomerVisit): Promise<CustomerVisit> {
    return this.memStorage.createCustomerVisit(visit);
  }

  updateCustomerVisit(id: string, updates: Partial<InsertCustomerVisit>): Promise<CustomerVisit | undefined> {
    return this.memStorage.updateCustomerVisit(id, updates);
  }

  deleteCustomerVisit(id: string): Promise<boolean> {
    return this.memStorage.deleteCustomerVisit(id);
  }

  // Coupon Usage methods - NOW USING DATABASE! 💾
  getCouponUsage(id: string): Promise<CouponUsage | undefined> {
    console.log('[DATABASE] Fetching coupon usage from PostgreSQL:', id);
    return this.supabaseStorage.getCouponUsage!(id);
  }

  getCouponUsagesByCoupon(couponId: string): Promise<CouponUsage[]> {
    console.log('[DATABASE] Fetching coupon usages by coupon from PostgreSQL:', couponId);
    return this.supabaseStorage.getCouponUsagesByCoupon!(couponId);
  }

  getCouponUsagesByCustomer(customerId: string): Promise<CouponUsage[]> {
    console.log('[DATABASE] Fetching coupon usages by customer from PostgreSQL:', customerId);
    return this.supabaseStorage.getCouponUsagesByCustomer!(customerId);
  }

  createCouponUsage(usage: InsertCouponUsage): Promise<CouponUsage> {
    console.log('[DATABASE] Creating coupon usage in PostgreSQL');
    return this.supabaseStorage.createCouponUsage!(usage);
  }

  getCustomerTask(id: string): Promise<CustomerTask | undefined> {
    return this.memStorage.getCustomerTask(id);
  }

  getCustomerTasksByCustomer(customerId: string, status?: string): Promise<CustomerTask[]> {
    return this.memStorage.getCustomerTasksByCustomer(customerId, status);
  }

  getCustomerTasksByVendor(vendorId: string, status?: string): Promise<CustomerTask[]> {
    return this.memStorage.getCustomerTasksByVendor(vendorId, status);
  }

  createCustomerTask(task: InsertCustomerTask): Promise<CustomerTask> {
    return this.memStorage.createCustomerTask(task);
  }

  updateCustomerTask(id: string, updates: Partial<InsertCustomerTask>): Promise<CustomerTask | undefined> {
    return this.memStorage.updateCustomerTask(id, updates);
  }

  deleteCustomerTask(id: string): Promise<boolean> {
    return this.memStorage.deleteCustomerTask(id);
  }

  // Supplier methods - NOW USING DATABASE! 💾
  getSupplier(id: string): Promise<Supplier | undefined> {
    return this.supabaseStorage.getSupplier!(id);
  }

  getSuppliersByVendor(vendorId: string, filters?: { status?: string; category?: string }): Promise<Supplier[]> {
    console.log('[DATABASE] Fetching suppliers from PostgreSQL:', vendorId);
    return this.supabaseStorage.getSuppliersByVendor!(vendorId, filters);
  }

  searchSuppliers(vendorId: string, query: string): Promise<Supplier[]> {
    console.log('[DATABASE] Searching suppliers in PostgreSQL:', query);
    return this.supabaseStorage.searchSuppliers!(vendorId, query);
  }

  createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    console.log('[DATABASE] Creating supplier in PostgreSQL:', supplier.name);
    return this.supabaseStorage.createSupplier!(supplier);
  }

  updateSupplier(id: string, updates: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    console.log('[DATABASE] Updating supplier in PostgreSQL:', id);
    return this.supabaseStorage.updateSupplier!(id, updates) as Promise<Supplier | undefined>;
  }

  deleteSupplier(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting supplier from PostgreSQL:', id);
    return this.supabaseStorage.deleteSupplier!(id);
  }

  getSupplierPayment(id: string): Promise<SupplierPayment | undefined> {
    return this.memStorage.getSupplierPayment(id);
  }

  getSupplierPaymentsBySupplier(supplierId: string): Promise<SupplierPayment[]> {
    return this.memStorage.getSupplierPaymentsBySupplier(supplierId);
  }

  getSupplierPaymentsByVendor(vendorId: string): Promise<SupplierPayment[]> {
    return this.memStorage.getSupplierPaymentsByVendor(vendorId);
  }

  createSupplierPayment(payment: InsertSupplierPayment): Promise<SupplierPayment> {
    return this.memStorage.createSupplierPayment(payment);
  }

  updateSupplierPayment(id: string, updates: Partial<InsertSupplierPayment>): Promise<SupplierPayment | undefined> {
    return this.memStorage.updateSupplierPayment(id, updates);
  }

  deleteSupplierPayment(id: string): Promise<boolean> {
    return this.memStorage.deleteSupplierPayment(id);
  }

  // Expense methods - NOW USING DATABASE! 💾
  getExpense(id: string): Promise<Expense | undefined> {
    return this.supabaseStorage.getExpense!(id);
  }

  getExpensesByVendor(vendorId: string, filters?: { 
    category?: string; 
    paymentType?: string; 
    dateFrom?: Date; 
    dateTo?: Date;
  }): Promise<Expense[]> {
    console.log('[DATABASE] Fetching expenses from PostgreSQL:', vendorId);
    return this.supabaseStorage.getExpensesByVendor!(vendorId, filters);
  }

  createExpense(expense: InsertExpense): Promise<Expense> {
    console.log('[DATABASE] Creating expense in PostgreSQL:', expense.title);
    return this.supabaseStorage.createExpense!(expense);
  }

  updateExpense(id: string, updates: Partial<InsertExpense>): Promise<Expense | undefined> {
    console.log('[DATABASE] Updating expense in PostgreSQL:', id);
    return this.supabaseStorage.updateExpense!(id, updates) as Promise<Expense | undefined>;
  }

  deleteExpense(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting expense from PostgreSQL:', id);
    return this.supabaseStorage.deleteExpense!(id);
  }

  // Lead methods - NOW USING DATABASE! 💾
  getLead(id: string): Promise<Lead | undefined> {
    return this.supabaseStorage.getLead!(id);
  }

  getLeadsByVendor(vendorId: string, filters?: { status?: string; source?: string }): Promise<Lead[]> {
    console.log('[DATABASE] Fetching leads from PostgreSQL:', vendorId);
    return this.supabaseStorage.getLeadsByVendor!(vendorId, filters);
  }

  getAllLeads(filters: Partial<AdminLeadsFilter>): Promise<{ leads: Lead[]; total: number }> {
    console.log('[DATABASE] Fetching all leads with filters from PostgreSQL');
    return this.supabaseStorage.getAllLeads!(filters);
  }

  getAllLeadsWithFilters(filters: AdminLeadsFilter): Promise<{ leads: Lead[]; total: number }> {
    // Keep using memStorage for admin filters (can be migrated later)
    return this.memStorage.getAllLeadsWithFilters(filters);
  }

  searchLeads(vendorId: string, query: string): Promise<Lead[]> {
    // Keep using memStorage for search (can be migrated later)
    return this.memStorage.searchLeads(vendorId, query);
  }

  createLead(lead: InsertLead): Promise<Lead> {
    console.log('[DATABASE] Creating lead in PostgreSQL');
    return this.supabaseStorage.createLead!(lead);
  }

  updateLead(id: string, updates: Partial<InsertLead>): Promise<Lead | undefined> {
    console.log('[DATABASE] Updating lead in PostgreSQL:', id);
    return this.supabaseStorage.updateLead!(id, updates) as Promise<Lead | undefined>;
  }

  deleteLead(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting lead from PostgreSQL:', id);
    return this.supabaseStorage.deleteLead!(id);
  }

  // Demo Request methods (using memStorage for now)
  getDemoRequest(id: string): Promise<DemoRequest | undefined> {
    return this.memStorage.getDemoRequest(id);
  }

  getAllDemoRequests(filters?: { status?: string }): Promise<DemoRequest[]> {
    return this.memStorage.getAllDemoRequests(filters);
  }

  createDemoRequest(demoRequest: InsertDemoRequest): Promise<DemoRequest> {
    console.log('[STORAGE] Creating demo request');
    return this.memStorage.createDemoRequest(demoRequest);
  }

  updateDemoRequest(id: string, updates: Partial<InsertDemoRequest>): Promise<DemoRequest | undefined> {
    return this.memStorage.updateDemoRequest(id, updates);
  }

  deleteDemoRequest(id: string): Promise<boolean> {
    return this.memStorage.deleteDemoRequest(id);
  }

  getLeadCommunication(id: string): Promise<LeadCommunication | undefined> {
    return this.memStorage.getLeadCommunication(id);
  }

  getLeadCommunicationsByLead(leadId: string): Promise<LeadCommunication[]> {
    return this.memStorage.getLeadCommunicationsByLead(leadId);
  }

  createLeadCommunication(communication: InsertLeadCommunication): Promise<LeadCommunication> {
    return this.memStorage.createLeadCommunication(communication);
  }

  updateLeadCommunication(id: string, updates: Partial<InsertLeadCommunication>): Promise<LeadCommunication | undefined> {
    return this.memStorage.updateLeadCommunication(id, updates);
  }

  deleteLeadCommunication(id: string): Promise<boolean> {
    return this.memStorage.deleteLeadCommunication(id);
  }

  getLeadTask(id: string): Promise<LeadTask | undefined> {
    return this.memStorage.getLeadTask(id);
  }

  getLeadTasksByLead(leadId: string, status?: string): Promise<LeadTask[]> {
    return this.memStorage.getLeadTasksByLead(leadId, status);
  }

  getLeadTasksByVendor(vendorId: string, status?: string): Promise<LeadTask[]> {
    return this.memStorage.getLeadTasksByVendor(vendorId, status);
  }

  createLeadTask(task: InsertLeadTask): Promise<LeadTask> {
    return this.memStorage.createLeadTask(task);
  }

  updateLeadTask(id: string, updates: Partial<InsertLeadTask>): Promise<LeadTask | undefined> {
    return this.memStorage.updateLeadTask(id, updates);
  }

  deleteLeadTask(id: string): Promise<boolean> {
    return this.memStorage.deleteLeadTask(id);
  }

  // Quotation methods - NOW USING DATABASE! 💾
  getQuotation(id: string): Promise<Quotation | undefined> {
    return this.supabaseStorage.getQuotation!(id);
  }

  getQuotationsByVendor(vendorId: string, filters?: { status?: string; customerId?: string }): Promise<Quotation[]> {
    console.log('[DATABASE] Fetching quotations from PostgreSQL:', vendorId, filters);
    return this.supabaseStorage.getQuotationsByVendor!(vendorId, filters);
  }

  createQuotation(quotation: InsertQuotation): Promise<Quotation> {
    console.log('[DATABASE] Creating quotation in PostgreSQL');
    return this.supabaseStorage.createQuotation!(quotation);
  }

  updateQuotation(id: string, updates: Partial<InsertQuotation>): Promise<Quotation | undefined> {
    console.log('[DATABASE] Updating quotation in PostgreSQL:', id);
    return this.supabaseStorage.updateQuotation!(id, updates) as Promise<Quotation | undefined>;
  }

  deleteQuotation(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting quotation from PostgreSQL:', id);
    return this.supabaseStorage.deleteQuotation!(id);
  }

  generateQuotationNumber(vendorId: string): Promise<string> {
    console.log('[DATABASE] Generating quotation number from PostgreSQL:', vendorId);
    return this.supabaseStorage.generateQuotationNumber!(vendorId);
  }

  // Quotation Item methods - NOW USING DATABASE! 💾
  getQuotationItem(id: string): Promise<QuotationItem | undefined> {
    console.log('[DATABASE] Fetching quotation item from PostgreSQL:', id);
    return this.supabaseStorage.getQuotationItem(id);
  }

  getQuotationItemsByQuotation(quotationId: string): Promise<QuotationItem[]> {
    console.log('[DATABASE] Fetching quotation items from PostgreSQL:', quotationId);
    return this.supabaseStorage.getQuotationItemsByQuotation(quotationId);
  }

  createQuotationItem(item: InsertQuotationItem): Promise<QuotationItem> {
    console.log('[DATABASE] Creating quotation item in PostgreSQL');
    return this.supabaseStorage.createQuotationItem(item);
  }

  updateQuotationItem(id: string, updates: Partial<InsertQuotationItem>): Promise<QuotationItem | undefined> {
    console.log('[DATABASE] Updating quotation item in PostgreSQL:', id);
    return this.supabaseStorage.updateQuotationItem(id, updates) as any;
  }

  deleteQuotationItem(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting quotation item from PostgreSQL:', id);
    return this.supabaseStorage.deleteQuotationItem(id);
  }

  getInventoryLocation(id: string): Promise<InventoryLocation | undefined> {
    return this.memStorage.getInventoryLocation(id);
  }

  getInventoryLocationsByVendor(vendorId: string): Promise<InventoryLocation[]> {
    return this.memStorage.getInventoryLocationsByVendor(vendorId);
  }

  createInventoryLocation(location: InsertInventoryLocation): Promise<InventoryLocation> {
    return this.memStorage.createInventoryLocation(location);
  }

  updateInventoryLocation(id: string, updates: Partial<InsertInventoryLocation>): Promise<InventoryLocation | undefined> {
    return this.memStorage.updateInventoryLocation(id, updates);
  }

  deleteInventoryLocation(id: string): Promise<boolean> {
    return this.memStorage.deleteInventoryLocation(id);
  }

  getStockBatch(id: string): Promise<StockBatch | undefined> {
    return this.memStorage.getStockBatch(id);
  }

  getStockBatchesByProduct(vendorProductId: string): Promise<StockBatch[]> {
    return this.memStorage.getStockBatchesByProduct(vendorProductId);
  }

  createStockBatch(batch: InsertStockBatch): Promise<StockBatch> {
    return this.memStorage.createStockBatch(batch);
  }

  updateStockBatch(id: string, updates: Partial<InsertStockBatch>): Promise<StockBatch | undefined> {
    return this.memStorage.updateStockBatch(id, updates);
  }

  getStockMovement(id: string): Promise<StockMovement | undefined> {
    return this.memStorage.getStockMovement(id);
  }

  getStockMovementsByProduct(vendorProductId: string): Promise<StockMovement[]> {
    return this.memStorage.getStockMovementsByProduct(vendorProductId);
  }

  getStockMovementsByVendor(vendorId: string): Promise<StockMovement[]> {
    return this.memStorage.getStockMovementsByVendor(vendorId);
  }

  createStockMovement(movement: InsertStockMovement): Promise<StockMovement> {
    return this.memStorage.createStockMovement(movement);
  }

  getStockConfig(vendorProductId: string): Promise<StockConfig | undefined> {
    return this.memStorage.getStockConfig(vendorProductId);
  }

  createStockConfig(config: InsertStockConfig): Promise<StockConfig> {
    return this.memStorage.createStockConfig(config);
  }

  updateStockConfig(vendorProductId: string, updates: Partial<InsertStockConfig>): Promise<StockConfig | undefined> {
    return this.memStorage.updateStockConfig(vendorProductId, updates);
  }

  getStockAlert(id: string): Promise<StockAlert | undefined> {
    return this.memStorage.getStockAlert(id);
  }

  getStockAlertsByVendor(vendorId: string): Promise<StockAlert[]> {
    return this.memStorage.getStockAlertsByVendor(vendorId);
  }

  createStockAlert(alert: InsertStockAlert): Promise<StockAlert> {
    return this.memStorage.createStockAlert(alert);
  }

  markStockAlertAsResolved(id: string): Promise<StockAlert | undefined> {
    return this.memStorage.markStockAlertAsResolved(id);
  }

  deleteStockAlert(id: string): Promise<boolean> {
    return this.memStorage.deleteStockAlert(id);
  }

  getStockTurnoverRate(vendorProductId: string, days: number): Promise<number> {
    return this.memStorage.getStockTurnoverRate(vendorProductId, days);
  }

  getFastMovingProducts(vendorId: string, days: number): Promise<VendorProduct[]> {
    return this.memStorage.getFastMovingProducts(vendorId, days);
  }

  getSlowMovingProducts(vendorId: string, days: number): Promise<VendorProduct[]> {
    return this.memStorage.getSlowMovingProducts(vendorId, days);
  }

  getStockValue(vendorId: string): Promise<number> {
    return this.memStorage.getStockValue(vendorId);
  }

  async getComprehensiveStockAnalytics(vendorId: string): Promise<{
    totalStockValue: number;
    lowStockItems: number;
    highStockItems: number;
    outOfStockItems: number;
    bestSellingItems: number;
    leastSellingItems: number;
  }> {
    console.log('[STOCK ANALYTICS] Fetching comprehensive stock analytics for vendor:', vendorId);
    
    // Fetch products from database (not memory!)
    const products = await this.getVendorProductsByVendor(vendorId);
    console.log('[STOCK ANALYTICS] Found products:', products.length);
    
    // Fetch stock configs from database
    const configs = await this.getStockConfigsByVendor(vendorId);
    const configMap = new Map(configs.map(c => [c.vendorProductId, c]));
    
    let totalStockValue = 0;
    let lowStockItems = 0;
    let highStockItems = 0;
    let outOfStockItems = 0;
    let bestSellingCount = 0;
    let leastSellingCount = 0;
    
    const productTurnoverRates: { product: typeof products[0]; turnoverRate: number }[] = [];
    
    for (const product of products) {
      totalStockValue += product.stock * product.price;
      
      if (product.stock === 0) {
        outOfStockItems++;
      } else {
        const config = configMap.get(product.id);
        const minLevel = config?.minStockLevel || 10;
        const maxLevel = config?.maxStockLevel || 100;
        
        if (product.stock <= minLevel) {
          lowStockItems++;
        }
        if (product.stock >= maxLevel) {
          highStockItems++;
        }
      }
      
      const turnoverRate = await this.getStockTurnoverRate(product.id, 30);
      productTurnoverRates.push({ product, turnoverRate });
    }
    
    productTurnoverRates.sort((a, b) => b.turnoverRate - a.turnoverRate);
    
    const topThreshold = productTurnoverRates.length > 0 
      ? productTurnoverRates[Math.floor(productTurnoverRates.length * 0.2)]?.turnoverRate || 0 
      : 0;
    const bottomThreshold = productTurnoverRates.length > 0 
      ? productTurnoverRates[Math.floor(productTurnoverRates.length * 0.8)]?.turnoverRate || 0 
      : 0;
    
    for (const item of productTurnoverRates) {
      if (item.turnoverRate >= topThreshold && item.turnoverRate > 0) {
        bestSellingCount++;
      }
      if (item.turnoverRate <= bottomThreshold && item.product.stock > 0) {
        leastSellingCount++;
      }
    }
    
    console.log('[STOCK ANALYTICS] Analytics calculated:', {
      totalStockValue,
      lowStockItems,
      highStockItems,
      outOfStockItems,
      bestSellingItems: bestSellingCount,
      leastSellingItems: leastSellingCount,
    });
    
    return {
      totalStockValue,
      lowStockItems,
      highStockItems,
      outOfStockItems,
      bestSellingItems: bestSellingCount,
      leastSellingItems: leastSellingCount,
    };
  }

  getLedgerTransaction(id: string): Promise<LedgerTransaction | undefined> {
    console.log('[DATABASE] Fetching ledger transaction from PostgreSQL:', id);
    return this.supabaseStorage.getLedgerTransaction!(id);
  }

  getLedgerTransactionsByCustomer(customerId: string): Promise<LedgerTransaction[]> {
    console.log('[DATABASE] Fetching ledger transactions for customer from PostgreSQL:', customerId);
    return this.supabaseStorage.getLedgerTransactionsByCustomer!(customerId);
  }

  getLedgerTransactionsByVendor(vendorId: string, filters?: {
    customerId?: string;
    type?: string;
    category?: string;
    paymentMethod?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<LedgerTransaction[]> {
    console.log('[DATABASE] Fetching ledger transactions for vendor from PostgreSQL:', vendorId, 'with filters:', filters);
    return this.supabaseStorage.getLedgerTransactionsByVendor!(vendorId, filters);
  }

  createLedgerTransaction(transaction: InsertLedgerTransaction): Promise<LedgerTransaction> {
    console.log('[DATABASE] Creating ledger transaction in PostgreSQL');
    return this.supabaseStorage.createLedgerTransaction!(transaction);
  }

  updateLedgerTransaction(id: string, updates: Partial<InsertLedgerTransaction>): Promise<LedgerTransaction | undefined> {
    console.log('[DATABASE] Updating ledger transaction in PostgreSQL:', id);
    return this.supabaseStorage.updateLedgerTransaction!(id, updates);
  }

  deleteLedgerTransaction(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting ledger transaction from PostgreSQL:', id);
    return this.supabaseStorage.deleteLedgerTransaction!(id);
  }

  getLedgerSummary(vendorId: string, filters?: { 
    customerId?: string; 
    type?: string;
    category?: string;
    paymentMethod?: string;
    startDate?: Date; 
    endDate?: Date;
  }): Promise<{
    totalIn: number;
    totalOut: number;
    balance: number;
    transactionCount: number;
  }> {
    console.log('[DATABASE] Fetching ledger summary from PostgreSQL:', vendorId, 'with filters:', filters);
    return this.supabaseStorage.getLedgerSummary!(vendorId, filters);
  }

  getCustomerLedgerBalance(customerId: string): Promise<number> {
    console.log('[DATABASE] Fetching customer ledger balance from PostgreSQL:', customerId);
    return this.supabaseStorage.getCustomerLedgerBalance!(customerId);
  }

  getRecurringLedgerTransactions(vendorId: string): Promise<LedgerTransaction[]> {
    console.log('[DATABASE] Fetching recurring ledger transactions from PostgreSQL:', vendorId);
    return this.supabaseStorage.getRecurringLedgerTransactions!(vendorId);
  }

  // Poster Categories
  getPosterCategories(): Promise<any[]> {
    return this.memStorage.getPosterCategories();
  }

  createPosterCategory(category: any): Promise<any> {
    return this.memStorage.createPosterCategory(category);
  }

  updatePosterCategory(id: string, updates: any): Promise<any> {
    return this.memStorage.updatePosterCategory(id, updates);
  }

  deletePosterCategory(id: string): Promise<boolean> {
    return this.memStorage.deletePosterCategory(id);
  }

  getGreetingTemplate(id: string): Promise<GreetingTemplate | undefined> {
    return this.supabaseStorage.getGreetingTemplate!(id);
  }

  getAllGreetingTemplates(filters?: {
    status?: string;
    occasions?: string[];
    offerTypes?: string[];
    industries?: string[];
    isTrending?: boolean;
  }): Promise<GreetingTemplate[]> {
    return this.supabaseStorage.getAllGreetingTemplates!(filters);
  }

  searchGreetingTemplates(query: string, filters?: {
    occasions?: string[];
    offerTypes?: string[];
    industries?: string[];
  }): Promise<GreetingTemplate[]> {
    return this.supabaseStorage.searchGreetingTemplates!(query, filters);
  }

  getGreetingTemplatesByVendor(vendorId: string, category?: string): Promise<GreetingTemplate[]> {
    return this.memStorage.getGreetingTemplatesByVendor(vendorId, category);
  }

  createGreetingTemplate(template: InsertGreetingTemplate): Promise<GreetingTemplate> {
    return this.supabaseStorage.createGreetingTemplate!(template);
  }

  updateGreetingTemplate(id: string, updates: Partial<InsertGreetingTemplate>): Promise<GreetingTemplate | undefined> {
    return this.supabaseStorage.updateGreetingTemplate!(id, updates);
  }

  deleteGreetingTemplate(id: string): Promise<boolean> {
    return this.supabaseStorage.deleteGreetingTemplate!(id);
  }

  incrementTemplateDownload(id: string): Promise<void> {
    return this.supabaseStorage.incrementTemplateDownload!(id);
  }

  incrementTemplateShare(id: string): Promise<void> {
    return this.supabaseStorage.incrementTemplateShare!(id);
  }

  getGreetingTemplateUsage(id: string): Promise<GreetingTemplateUsage | undefined> {
    return this.supabaseStorage.getGreetingTemplateUsage!(id);
  }

  getGreetingTemplateUsagesByTemplate(templateId: string): Promise<GreetingTemplateUsage[]> {
    return this.supabaseStorage.getGreetingTemplateUsagesByTemplate!(templateId);
  }

  getGreetingTemplateUsagesByVendor(vendorId: string): Promise<GreetingTemplateUsage[]> {
    return this.supabaseStorage.getGreetingTemplateUsagesByVendor!(vendorId);
  }

  createGreetingTemplateUsage(usage: InsertGreetingTemplateUsage): Promise<GreetingTemplateUsage> {
    return this.supabaseStorage.createGreetingTemplateUsage!(usage);
  }

  // POS Bill methods - NOW USING DATABASE! 💾
  getBill(id: string): Promise<Bill | undefined> {
    console.log('[DATABASE] Fetching bill from PostgreSQL:', id);
    return this.supabaseStorage.getBill(id);
  }

  getBillsByVendor(vendorId: string, status?: string): Promise<Bill[]> {
    console.log('[DATABASE] Fetching bills for vendor from PostgreSQL:', vendorId);
    return this.supabaseStorage.getBillsByVendor(vendorId, status);
  }

  getBillsByCustomer(customerId: string): Promise<Bill[]> {
    console.log('[DATABASE] Fetching bills for customer from PostgreSQL:', customerId);
    return this.supabaseStorage.getBillsByCustomer(customerId);
  }

  createBill(bill: InsertBill): Promise<Bill> {
    console.log('[DATABASE] Creating bill in PostgreSQL');
    return this.supabaseStorage.createBill(bill);
  }

  updateBill(id: string, updates: Partial<InsertBill>): Promise<Bill | undefined> {
    console.log('[DATABASE] Updating bill in PostgreSQL:', id);
    return this.supabaseStorage.updateBill(id, updates) as any;
  }

  deleteBill(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting bill from PostgreSQL:', id);
    return this.supabaseStorage.deleteBill(id);
  }

  // Bill Item methods - NOW USING DATABASE! 💾
  getBillItem(id: string): Promise<BillItem | undefined> {
    console.log('[DATABASE] Fetching bill item from PostgreSQL:', id);
    return this.supabaseStorage.getBillItem(id);
  }

  getBillItems(billId: string): Promise<BillItem[]> {
    console.log('[DATABASE] Fetching bill items from PostgreSQL:', billId);
    return this.supabaseStorage.getBillItems(billId);
  }

  addBillItem(item: InsertBillItem): Promise<BillItem> {
    console.log('[DATABASE] Adding bill item to PostgreSQL');
    return this.supabaseStorage.addBillItem(item);
  }

  createBillItem(item: InsertBillItem): Promise<BillItem> {
    console.log('[DATABASE] Creating bill item in PostgreSQL');
    return this.supabaseStorage.createBillItem(item);
  }

  updateBillItem(id: string, updates: Partial<InsertBillItem>): Promise<BillItem | undefined> {
    console.log('[DATABASE] Updating bill item in PostgreSQL:', id);
    return this.supabaseStorage.updateBillItem(id, updates);
  }

  deleteBillItem(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting bill item from PostgreSQL:', id);
    return this.supabaseStorage.deleteBillItem(id) as any;
  }

  removeBillItem(id: string): Promise<void> {
    console.log('[DATABASE] Removing bill item from PostgreSQL:', id);
    return this.supabaseStorage.removeBillItem(id);
  }

  // Bill Payment methods - NOW USING DATABASE! 💾
  getBillPayment(id: string): Promise<BillPayment | undefined> {
    console.log('[DATABASE] Fetching bill payment from PostgreSQL:', id);
    return this.supabaseStorage.getBillPayment(id);
  }

  getBillPayments(billId: string): Promise<BillPayment[]> {
    console.log('[DATABASE] Fetching bill payments from PostgreSQL:', billId);
    return this.supabaseStorage.getBillPayments(billId);
  }

  recordPayment(payment: InsertBillPayment): Promise<BillPayment> {
    console.log('[DATABASE] Recording payment in PostgreSQL');
    return this.supabaseStorage.recordPayment(payment);
  }

  // Additional Services - NOW USING DATABASE! 💾
  getAllAdditionalServices(activeOnly: boolean = false): Promise<AdditionalService[]> {
    console.log('[DATABASE] Fetching additional services from PostgreSQL');
    return this.supabaseStorage.getAllAdditionalServices!(activeOnly);
  }

  getAdditionalService(id: string): Promise<AdditionalService | undefined> {
    console.log('[DATABASE] Fetching additional service from PostgreSQL:', id);
    return this.supabaseStorage.getAdditionalService!(id);
  }

  createAdditionalService(service: InsertAdditionalService): Promise<AdditionalService> {
    console.log('[DATABASE] Creating additional service in PostgreSQL');
    return this.supabaseStorage.createAdditionalService!(service);
  }

  updateAdditionalService(id: string, updates: Partial<InsertAdditionalService>): Promise<AdditionalService | undefined> {
    console.log('[DATABASE] Updating additional service in PostgreSQL:', id);
    return this.supabaseStorage.updateAdditionalService!(id, updates);
  }

  deleteAdditionalService(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting additional service from PostgreSQL:', id);
    return this.supabaseStorage.deleteAdditionalService!(id);
  }

  // Additional Service Inquiries - NOW USING DATABASE! 💾
  getAllAdditionalServiceInquiries(): Promise<AdditionalServiceInquiry[]> {
    console.log('[DATABASE] Fetching additional service inquiries from PostgreSQL');
    return this.supabaseStorage.getAllAdditionalServiceInquiries!();
  }

  getAdditionalServiceInquiry(id: string): Promise<AdditionalServiceInquiry | undefined> {
    console.log('[DATABASE] Fetching additional service inquiry from PostgreSQL:', id);
    return this.supabaseStorage.getAdditionalServiceInquiry!(id);
  }

  createAdditionalServiceInquiry(inquiry: InsertAdditionalServiceInquiry): Promise<AdditionalServiceInquiry> {
    console.log('[DATABASE] Creating additional service inquiry in PostgreSQL');
    return this.supabaseStorage.createAdditionalServiceInquiry!(inquiry);
  }

  updateAdditionalServiceInquiry(id: string, updates: Partial<InsertAdditionalServiceInquiry>): Promise<AdditionalServiceInquiry | undefined> {
    console.log('[DATABASE] Updating additional service inquiry in PostgreSQL:', id);
    return this.supabaseStorage.updateAdditionalServiceInquiry!(id, updates);
  }

  createBillPayment(payment: InsertBillPayment): Promise<BillPayment> {
    console.log('[DATABASE] Creating bill payment in PostgreSQL');
    return this.supabaseStorage.createBillPayment(payment);
  }

  updateBillPayment(id: string, updates: Partial<InsertBillPayment>): Promise<BillPayment | undefined> {
    console.log('[DATABASE] Updating bill payment in PostgreSQL:', id);
    return this.supabaseStorage.updateBillPayment(id, updates) as any;
  }

  deleteBillPayment(id: string): Promise<boolean> {
    console.log('[DATABASE] Deleting bill payment from PostgreSQL:', id);
    return this.supabaseStorage.deleteBillPayment(id);
  }

  getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined> {
    return this.supabaseStorage.getSubscriptionPlan(id);
  }

  getAllSubscriptionPlans(activeOnly?: boolean): Promise<SubscriptionPlan[]> {
    return this.supabaseStorage.getAllSubscriptionPlans(activeOnly);
  }

  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    return this.supabaseStorage.createSubscriptionPlan!(plan);
  }

  updateSubscriptionPlan(id: string, updates: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan | undefined> {
    return this.supabaseStorage.updateSubscriptionPlan!(id, updates);
  }

  deleteSubscriptionPlan(id: string): Promise<boolean> {
    return this.supabaseStorage.deleteSubscriptionPlan!(id);
  }

  getVendorSubscription(id: string): Promise<VendorSubscription | undefined> {
    return this.supabaseStorage.getVendorSubscription!(id);
  }

  getVendorSubscriptionByVendor(vendorId: string): Promise<VendorSubscription | undefined> {
    return this.supabaseStorage.getVendorSubscriptionByVendor!(vendorId);
  }

  getAllVendorSubscriptions(status?: string): Promise<VendorSubscription[]> {
    console.log('[DATABASE] Fetching vendor subscriptions from PostgreSQL');
    return this.supabaseStorage.getAllVendorSubscriptions!(status);
  }

  createVendorSubscription(subscription: InsertVendorSubscription): Promise<VendorSubscription> {
    return this.supabaseStorage.createVendorSubscription!(subscription);
  }

  updateVendorSubscription(id: string, updates: Partial<InsertVendorSubscription>): Promise<VendorSubscription | undefined> {
    return this.supabaseStorage.updateVendorSubscription!(id, updates);
  }

  cancelVendorSubscription(id: string): Promise<VendorSubscription | undefined> {
    return this.supabaseStorage.cancelVendorSubscription!(id);
  }

  getBillingHistory(id: string): Promise<BillingHistory | undefined> {
    return this.memStorage.getBillingHistory(id);
  }

  getBillingHistoryByVendor(vendorId: string): Promise<BillingHistory[]> {
    return this.memStorage.getBillingHistoryByVendor(vendorId);
  }

  createBillingHistory(billing: InsertBillingHistory): Promise<BillingHistory> {
    return this.memStorage.createBillingHistory(billing);
  }

  updateBillingHistory(id: string, updates: Partial<InsertBillingHistory>): Promise<BillingHistory | undefined> {
    return this.memStorage.updateBillingHistory(id, updates);
  }

  getUsageLog(id: string): Promise<UsageLog | undefined> {
    return this.memStorage.getUsageLog(id);
  }

  getUsageLogsByVendor(vendorId: string, month?: number, year?: number): Promise<UsageLog[]> {
    return this.memStorage.getUsageLogsByVendor(vendorId, month, year);
  }

  createUsageLog(log: InsertUsageLog): Promise<UsageLog> {
    return this.memStorage.createUsageLog(log);
  }

  updateUsageLog(id: string, updates: Partial<InsertUsageLog>): Promise<UsageLog | undefined> {
    return this.memStorage.updateUsageLog(id, updates);
  }

  // Mini-Website methods - NOW USING DATABASE! 💾
  getMiniWebsiteByVendor(vendorId: string): Promise<MiniWebsite | undefined> {
    return this.supabaseStorage.getMiniWebsiteByVendor!(vendorId);
  }

  getMiniWebsiteBySubdomain(subdomain: string): Promise<MiniWebsite | undefined> {
    return this.supabaseStorage.getMiniWebsiteBySubdomain!(subdomain);
  }

  getMiniWebsite(id: string): Promise<MiniWebsite | undefined> {
    return this.supabaseStorage.getMiniWebsite!(id);
  }

  createMiniWebsite(data: InsertMiniWebsite): Promise<MiniWebsite> {
    console.log('[DATABASE] Creating mini-website in PostgreSQL:', data.subdomain);
    return this.supabaseStorage.createMiniWebsite!(data);
  }

  updateMiniWebsite(id: string, data: Partial<InsertMiniWebsite>): Promise<MiniWebsite | null> {
    console.log('[DATABASE] Updating mini-website in PostgreSQL:', id);
    return this.supabaseStorage.updateMiniWebsite!(id, data);
  }

  publishMiniWebsite(id: string): Promise<MiniWebsite | null> {
    console.log('[DATABASE] Publishing mini-website in PostgreSQL:', id);
    return this.supabaseStorage.publishMiniWebsite!(id);
  }

  createReview(data: InsertMiniWebsiteReview): Promise<MiniWebsiteReview> {
    console.log('[DATABASE] Creating review in PostgreSQL');
    return this.supabaseStorage.createReview!(data);
  }

  getReviewsByMiniWebsite(miniWebsiteId: string, onlyApproved?: boolean): Promise<MiniWebsiteReview[]> {
    // Note: onlyApproved filtering can be added later if needed
    return this.supabaseStorage.getReviewsByMiniWebsite!(miniWebsiteId);
  }

  approveReview(id: string): Promise<MiniWebsiteReview | null> {
    console.log('[DATABASE] Approving review in PostgreSQL:', id);
    return this.supabaseStorage.approveReview!(id);
  }

  createMiniWebsiteLead(data: InsertMiniWebsiteLead): Promise<MiniWebsiteLead> {
    console.log('[DATABASE] Creating lead in PostgreSQL');
    return this.supabaseStorage.createMiniWebsiteLead!(data);
  }

  getMiniWebsiteLeadsByVendor(vendorId: string): Promise<MiniWebsiteLead[]> {
    return this.supabaseStorage.getMiniWebsiteLeadsByVendor!(vendorId);
  }

  getVendorProductsByMasterProduct(masterProductId: string): Promise<VendorProduct[]> {
    console.log('[DATABASE] Fetching vendor products by master product from PostgreSQL:', masterProductId);
    return this.supabaseStorage.getVendorProductsByMasterProduct!(masterProductId);
  }

  // Stock Movement methods - NOW USING DATABASE! 💾
  recordStockIn(vendorProductId: string, quantity: number, data: Partial<InsertStockMovement>, userId?: string): Promise<{ movement: StockMovement; newStock: number }> {
    console.log('[DATABASE] Recording stock in to PostgreSQL:', vendorProductId, quantity);
    return this.supabaseStorage.recordStockIn!(vendorProductId, quantity, data, userId);
  }

  recordStockOut(vendorProductId: string, quantity: number, data: Partial<InsertStockMovement>, userId?: string): Promise<{ movement: StockMovement; newStock: number }> {
    console.log('[DATABASE] Recording stock out to PostgreSQL:', vendorProductId, quantity);
    return this.supabaseStorage.recordStockOut!(vendorProductId, quantity, data, userId);
  }

  getStockMovementsByProduct(vendorProductId: string): Promise<StockMovement[]> {
    return this.memStorage.getStockMovementsByProduct(vendorProductId);
  }

  createStockMovement(movement: InsertStockMovement): Promise<StockMovement> {
    return this.memStorage.createStockMovement(movement);
  }

  getStockConfig(vendorProductId: string): Promise<StockConfig | undefined> {
    return this.memStorage.getStockConfig(vendorProductId);
  }

  async getStockConfigsByVendor(vendorId: string): Promise<StockConfig[]> {
    // Fetch products from database first to get their IDs
    const vendorProducts = await this.getVendorProductsByVendor(vendorId);
    const productIds = vendorProducts.map(p => p.id);
    
    // Then get configs for those products from memory
    const allConfigs = Array.from(this.memStorage['stockConfigs'].values());
    return allConfigs.filter(config => productIds.includes(config.vendorProductId));
  }

  createStockConfig(config: InsertStockConfig): Promise<StockConfig> {
    return this.memStorage.createStockConfig(config);
  }

  updateStockConfig(id: string, updates: Partial<InsertStockConfig>): Promise<StockConfig | undefined> {
    return this.memStorage.updateStockConfig(id, updates);
  }

  deleteStockConfig(id: string): Promise<boolean> {
    return this.memStorage.deleteStockConfig(id);
  }

  // ========== PROMO BANNERS ==========
  
  private promoBanners: Map<string, any> = new Map();

  async getPromoBanners(status?: string): Promise<any[]> {
    const banners = Array.from(this.promoBanners.values());
    if (status) {
      return banners.filter(b => b.status === status).sort((a, b) => a.displayOrder - b.displayOrder);
    }
    return banners.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getPromoBanner(id: string): Promise<any | undefined> {
    return this.promoBanners.get(id);
  }

  async createPromoBanner(data: any): Promise<any> {
    const id = `banner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const banner = {
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.promoBanners.set(id, banner);
    return banner;
  }

  async updatePromoBanner(id: string, updates: any): Promise<any> {
    const existing = this.promoBanners.get(id);
    if (!existing) throw new Error("Banner not found");
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.promoBanners.set(id, updated);
    return updated;
  }

  async deletePromoBanner(id: string): Promise<boolean> {
    return this.promoBanners.delete(id);
  }

  // Referral Program methods
  private referrals: Map<string, any> = new Map();
  private referralStats: Map<string, any> = new Map();

  async getReferralStats(vendorId: string): Promise<any | null> {
    return this.referralStats.get(vendorId) || null;
  }

  async getReferrals(vendorId: string): Promise<any[]> {
    const allReferrals = Array.from(this.referrals.values());
    return allReferrals.filter(r => r.referrerId === vendorId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createReferral(data: any): Promise<any> {
    const id = crypto.randomUUID();
    const referral = {
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.referrals.set(id, referral);
    
    // Update referral stats
    let stats = this.referralStats.get(data.referrerId);
    if (!stats) {
      stats = {
        vendorId: data.referrerId,
        referralCode: data.referralCode,
        totalReferrals: 0,
        successfulReferrals: 0,
        pendingReferrals: 0,
        totalEarnings: "0",
        pendingEarnings: "0",
      };
    }
    stats.totalReferrals += 1;
    stats.pendingReferrals += 1;
    stats.pendingEarnings = String(Number(stats.pendingEarnings) + 200);
    this.referralStats.set(data.referrerId, stats);
    
    return referral;
  }

  async updateReferralStatus(id: string, status: string): Promise<any> {
    const referral = this.referrals.get(id);
    if (!referral) {
      throw new Error("Referral not found");
    }
    
    const previousStatus = referral.status;
    referral.status = status;
    referral.updatedAt = new Date();
    
    if (status === "credited" && previousStatus !== "credited") {
      referral.creditedAt = new Date();
      
      // Update stats
      const stats = this.referralStats.get(referral.referrerId);
      if (stats) {
        stats.successfulReferrals += 1;
        stats.pendingReferrals = Math.max(0, stats.pendingReferrals - 1);
        stats.totalEarnings = String(Number(stats.totalEarnings) + 200);
        stats.pendingEarnings = String(Math.max(0, Number(stats.pendingEarnings) - 200));
        this.referralStats.set(referral.referrerId, stats);
      }
    }
    
    this.referrals.set(id, referral);
    return referral;
  }

  // Withdrawal methods
  private withdrawals: Map<string, any> = new Map();

  async getWithdrawals(vendorId: string): Promise<any[]> {
    const allWithdrawals = Array.from(this.withdrawals.values());
    return allWithdrawals.filter(w => w.vendorId === vendorId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createWithdrawal(data: any): Promise<any> {
    const id = crypto.randomUUID();
    const withdrawal = {
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.withdrawals.set(id, withdrawal);
    
    // Deduct from available balance
    const stats = this.referralStats.get(data.vendorId);
    if (stats) {
      stats.totalEarnings = String(Math.max(0, Number(stats.totalEarnings) - Number(data.amount)));
      this.referralStats.set(data.vendorId, stats);
    }
    
    return withdrawal;
  }

  async updateWithdrawalStatus(id: string, status: string, transactionId?: string, failureReason?: string): Promise<any> {
    const withdrawal = this.withdrawals.get(id);
    if (!withdrawal) {
      throw new Error("Withdrawal not found");
    }
    
    withdrawal.status = status;
    withdrawal.updatedAt = new Date();
    
    if (status === "completed") {
      withdrawal.processedAt = new Date();
      withdrawal.transactionId = transactionId;
    } else if (status === "failed" || status === "rejected") {
      withdrawal.failureReason = failureReason;
      
      // Refund the amount back to balance
      const stats = this.referralStats.get(withdrawal.vendorId);
      if (stats) {
        stats.totalEarnings = String(Number(stats.totalEarnings) + Number(withdrawal.amount));
        this.referralStats.set(withdrawal.vendorId, stats);
      }
    }
    
    this.withdrawals.set(id, withdrawal);
    return withdrawal;
  }
}

export const storage = new HybridStorage();
