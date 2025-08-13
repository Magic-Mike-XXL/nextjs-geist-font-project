export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'vendor' | 'customer';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor extends User {
  storeName: string;
  storeDescription: string;
  storeSlug: string;
  isApproved: boolean;
  commissionRate: number;
  totalSales: number;
  rating: number;
  reviewCount: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  tags: string[];
  vendorId: string;
  vendor: Vendor;
  stock: number;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  customer: User;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'stripe' | 'paypal' | 'mobile_money';
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  vendorId: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface Review {
  id: string;
  productId: string;
  customerId: string;
  customer: User;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  product: Product;
  addedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'message' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
