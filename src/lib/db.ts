import { User, Vendor, Product, Order, Review, Notification } from '@/types';

// Mock database using in-memory storage
// In a real app, this would connect to PostgreSQL/MongoDB
class MockDatabase {
  private users: User[] = [];
  private products: Product[] = [];
  private orders: Order[] = [];
  private reviews: Review[] = [];
  private notifications: Notification[] = [];
  private categories: string[] = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports',
    'Books',
    'Beauty',
    'Automotive',
    'Toys'
  ];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Create admin user
    const adminUser: User = {
      id: 'admin-1',
      email: 'admin@ecommerce.com',
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Create sample vendor
    const vendorUser: Vendor = {
      id: 'vendor-1',
      email: 'vendor@example.com',
      name: 'John Vendor',
      role: 'vendor',
      storeName: 'Tech Store',
      storeDescription: 'Your one-stop shop for electronics',
      storeSlug: 'tech-store',
      isApproved: true,
      commissionRate: 0.15,
      totalSales: 25000,
      rating: 4.5,
      reviewCount: 120,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Create sample customer
    const customerUser: User = {
      id: 'customer-1',
      email: 'customer@example.com',
      name: 'Jane Customer',
      role: 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users = [adminUser, vendorUser, customerUser];

    // Create sample products
    const sampleProducts: Product[] = [
      {
        id: 'product-1',
        name: 'Wireless Headphones',
        slug: 'wireless-headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 199.99,
        comparePrice: 249.99,
        images: ['https://placehold.co/400x400?text=Wireless+Headphones'],
        category: 'Electronics',
        tags: ['audio', 'wireless', 'headphones'],
        vendorId: 'vendor-1',
        vendor: vendorUser,
        stock: 50,
        isActive: true,
        rating: 4.3,
        reviewCount: 45,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'product-2',
        name: 'Smart Watch',
        slug: 'smart-watch',
        description: 'Feature-rich smartwatch with health monitoring',
        price: 299.99,
        images: ['https://placehold.co/400x400?text=Smart+Watch'],
        category: 'Electronics',
        tags: ['wearable', 'smart', 'health'],
        vendorId: 'vendor-1',
        vendor: vendorUser,
        stock: 30,
        isActive: true,
        rating: 4.6,
        reviewCount: 78,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    this.products = sampleProducts;
  }

  // User methods
  async findUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async findUserById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.push(user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return null;
    
    this.users[index] = {
      ...this.users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.users[index];
  }

  // Product methods
  async findProducts(filters?: {
    category?: string;
    vendorId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number }> {
    let filtered = [...this.products];

    if (filters?.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    if (filters?.vendorId) {
      filtered = filtered.filter(p => p.vendorId === filters.vendorId);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      );
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      products: filtered.slice(start, end),
      total: filtered.length,
    };
  }

  async findProductById(id: string): Promise<Product | null> {
    return this.products.find(product => product.id === id) || null;
  }

  async findProductBySlug(slug: string): Promise<Product | null> {
    return this.products.find(product => product.slug === slug) || null;
  }

  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const product: Product = {
      ...productData,
      id: `product-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.products.push(product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) return null;
    
    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.products[index];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) return false;
    
    this.products.splice(index, 1);
    return true;
  }

  // Order methods
  async findOrders(filters?: {
    customerId?: string;
    vendorId?: string;
    status?: string;
  }): Promise<Order[]> {
    let filtered = [...this.orders];

    if (filters?.customerId) {
      filtered = filtered.filter(o => o.customerId === filters.customerId);
    }
    if (filters?.vendorId) {
      filtered = filtered.filter(o => 
        o.items.some(item => item.vendorId === filters.vendorId)
      );
    }
    if (filters?.status) {
      filtered = filtered.filter(o => o.status === filters.status);
    }

    return filtered;
  }

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const order: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.orders.push(order);
    return order;
  }

  // Categories
  getCategories(): string[] {
    return [...this.categories];
  }

  // Notifications
  async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const notification: Notification = {
      ...notificationData,
      id: `notification-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.notifications.push(notification);
    return notification;
  }

  async findNotificationsByUserId(userId: string): Promise<Notification[]> {
    return this.notifications.filter(n => n.userId === userId);
  }
}

export const db = new MockDatabase();
