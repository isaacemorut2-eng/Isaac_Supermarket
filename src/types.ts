export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  inStock: number;
  maxStock: number;
  sku: string;
  barcode: string;
  aisle: string;
  unit: string;
  tags: string[];
  isOrganic?: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  isFlashDeal?: boolean;
  dealEndsInMinutes?: number;
  description: string;
  specifications: Record<string, string>;
  origin?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minSpend: number;
  description: string;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  change: number;
  remainingStock: number;
  reason: 'purchase' | 'restock' | 'adjustment' | 'damage';
  timestamp: string;
  location?: string;
}

export type PaymentMethodType = 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay' | 'cash_on_delivery' | 'bank_transfer';

export interface PaymentFormData {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  saveCard: boolean;
  email: string;
  phone: string;
  fullName: string;
  address: string;
  apartment?: string;
  city: string;
  zipCode: string;
  country: string;
  deliverySlot: string;
  deliveryNotes?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  appliedCoupon?: string;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'paid' | 'pending' | 'cod_confirmed';
  deliveryAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    deliverySlot: string;
  };
  trackingNumber: string;
  createdAt: string;
  estimatedDelivery: string;
  status: 'Processing' | 'Picking at Warehouse' | 'Out for Delivery' | 'Delivered';
}
