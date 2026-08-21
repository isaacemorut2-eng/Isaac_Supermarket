import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, InventoryLog, Coupon, PaymentFormData, PaymentMethodType } from '../types';
import { INITIAL_PRODUCTS, VALID_COUPONS } from '../data/products';

interface LiveAlert {
  id: string;
  type: 'sale' | 'restock' | 'low_stock';
  message: string;
  time: string;
  productName: string;
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  compareList: string[];
  inventoryLogs: InventoryLog[];
  orders: Order[];
  appliedCoupon: Coupon | null;
  couponError: string | null;
  selectedCategory: string;
  activeTab: 'all' | 'featured' | 'popular' | 'new' | 'flash' | 'low_stock';
  searchQuery: string;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'rating' | 'stock_asc';
  priceRange: [number, number];
  onlyOrganic: boolean;
  isSimulatingLiveShoppers: boolean;
  activeQuickViewProduct: Product | null;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isInventoryModalOpen: boolean;
  isMobilePreviewActive: boolean;
  currentOrderSuccess: Order | null;
  liveAlerts: LiveAlert[];

  // Actions
  setSelectedCategory: (cat: string) => void;
  setActiveTab: (tab: 'all' | 'featured' | 'popular' | 'new' | 'flash' | 'low_stock') => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'featured' | 'price_asc' | 'price_desc' | 'rating' | 'stock_asc') => void;
  setPriceRange: (range: [number, number]) => void;
  setOnlyOrganic: (val: boolean) => void;
  toggleLiveShopperSimulation: () => void;
  
  // Modals & UI
  setActiveQuickViewProduct: (prod: Product | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsInventoryModalOpen: (open: boolean) => void;
  setIsMobilePreviewActive: (val: boolean | ((prev: boolean) => boolean)) => void;
  setCurrentOrderSuccess: (order: Order | null) => void;
  dismissAlert: (id: string) => void;

  // Cart & Wishlist
  addToCart: (product: Product, quantity?: number) => { success: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  toggleCompare: (productId: string) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Inventory Management
  restockProduct: (productId: string, amount: number) => void;
  adjustProductStock: (productId: string, newStock: number) => void;
  resetAllInventory: () => void;

  // Checkout
  processPayment: (paymentData: PaymentFormData, method: PaymentMethodType) => Promise<{ success: boolean; order?: Order; error?: string }>;
  
  // Computations
  cartSubtotal: number;
  cartDiscount: number;
  deliveryFee: number;
  cartTax: number;
  cartTotal: number;
  totalCartItemsCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('supermart_products_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('supermart_cart_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('supermart_wishlist_v1');
    return saved ? JSON.parse(saved) : ['prod-el-1', 'prod-gr-1'];
  });

  const [compareList, setCompareList] = useState<string[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'popular' | 'new' | 'flash' | 'low_stock'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating' | 'stock_asc'>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500]);
  const [onlyOrganic, setOnlyOrganic] = useState<boolean>(false);

  // UI state
  const [isSimulatingLiveShoppers, setIsSimulatingLiveShoppers] = useState<boolean>(true);
  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState<boolean>(false);
  const [isMobilePreviewActive, setIsMobilePreviewActive] = useState<boolean>(false);
  const [currentOrderSuccess, setCurrentOrderSuccess] = useState<Order | null>(null);
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);

  // Persist products and cart
  useEffect(() => {
    localStorage.setItem('supermart_products_v1', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('supermart_cart_v1', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('supermart_wishlist_v1', JSON.stringify(wishlist));
  }, [wishlist]);

  // Push an inventory audit log & trigger alert
  const logInventoryChange = (
    productId: string,
    productName: string,
    change: number,
    remainingStock: number,
    reason: 'purchase' | 'restock' | 'adjustment' | 'damage',
    location?: string
  ) => {
    const newLog: InventoryLog = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      productId,
      productName,
      change,
      remainingStock,
      reason,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      location: location || 'Main SuperMart Warehouse',
    };

    setInventoryLogs(prev => [newLog, ...prev.slice(0, 49)]);

    if (reason === 'purchase') {
      const alert: LiveAlert = {
        id: 'alert-' + Date.now(),
        type: 'sale',
        message: `Live Shopper purchased ${Math.abs(change)}x "${productName}" (${remainingStock} units left)`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        productName,
      };
      setLiveAlerts(prev => [alert, ...prev.slice(0, 4)]);
    } else if (reason === 'restock') {
      const alert: LiveAlert = {
        id: 'alert-' + Date.now(),
        type: 'restock',
        message: `Warehouse restocked +${change} units of "${productName}"`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        productName,
      };
      setLiveAlerts(prev => [alert, ...prev.slice(0, 4)]);
    }
  };

  const dismissAlert = (id: string) => {
    setLiveAlerts(prev => prev.filter(a => a.id !== id));
  };

  // Real-Time Shopper Simulator Engine
  useEffect(() => {
    if (!isSimulatingLiveShoppers) return;

    const interval = setInterval(() => {
      // Pick a random product with available stock
      setProducts(prevProducts => {
        const availableProds = prevProducts.filter(p => p.inStock > 2);
        if (availableProds.length === 0) return prevProducts;

        const randomIdx = Math.floor(Math.random() * availableProds.length);
        const target = availableProds[randomIdx];
        const purchaseQty = Math.random() > 0.7 ? 2 : 1;
        const newStock = Math.max(0, target.inStock - purchaseQty);

        logInventoryChange(
          target.id,
          target.name,
          -purchaseQty,
          newStock,
          'purchase',
          target.aisle
        );

        return prevProducts.map(p =>
          p.id === target.id ? { ...p, inStock: newStock } : p
        );
      });
    }, 14000); // Trigger every 14 seconds for realistic activity

    return () => clearInterval(interval);
  }, [isSimulatingLiveShoppers]);

  // Cart operations
  const addToCart = (product: Product, quantity = 1): { success: boolean; message?: string } => {
    const liveProd = products.find(p => p.id === product.id) || product;
    if (liveProd.inStock <= 0) {
      return { success: false, message: 'Sorry, this product is currently out of stock!' };
    }

    const existing = cart.find(item => item.product.id === product.id);
    const currentQty = existing ? existing.quantity : 0;
    const nextQty = currentQty + quantity;

    if (nextQty > liveProd.inStock) {
      return {
        success: false,
        message: `Only ${liveProd.inStock} unit${liveProd.inStock > 1 ? 's' : ''} available in warehouse!`,
      };
    }

    setCart(prev => {
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: nextQty } : item
        );
      }
      return [...prev, { product: liveProd, quantity }];
    });

    return { success: true, message: `Added ${product.name} to cart!` };
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const liveProd = products.find(p => p.id === productId);
    const max = liveProd ? liveProd.inStock : 99;
    const clamped = Math.min(quantity, max);

    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity: clamped } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const toggleCompare = (productId: string) => {
    setCompareList(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : prev.length >= 4
        ? [...prev.slice(1), productId]
        : [...prev, productId]
    );
  };

  const applyCoupon = (code: string): boolean => {
    const trimmed = code.trim().toUpperCase();
    const found = VALID_COUPONS.find(c => c.code === trimmed);
    if (!found) {
      setCouponError('Invalid coupon code. Try SAVE20 or SUPERMART10');
      return false;
    }
    if (cartSubtotal < found.minSpend) {
      setCouponError(`Minimum spend of $${found.minSpend.toFixed(2)} required for code ${found.code}`);
      return false;
    }
    setAppliedCoupon(found);
    setCouponError(null);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const restockProduct = (productId: string, amount: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const newStock = Math.min(p.maxStock, p.inStock + amount);
          logInventoryChange(p.id, p.name, amount, newStock, 'restock', p.aisle);
          return { ...p, inStock: newStock };
        }
        return p;
      })
    );
  };

  const adjustProductStock = (productId: string, newStock: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const change = newStock - p.inStock;
          logInventoryChange(p.id, p.name, change, newStock, 'adjustment', p.aisle);
          return { ...p, inStock: Math.max(0, newStock) };
        }
        return p;
      })
    );
  };

  const resetAllInventory = () => {
    setProducts(INITIAL_PRODUCTS);
    INITIAL_PRODUCTS.forEach(p => {
      logInventoryChange(p.id, p.name, p.inStock, p.inStock, 'restock', p.aisle);
    });
  };

  // Computations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartDiscount = appliedCoupon ? (cartSubtotal * appliedCoupon.discountPercent) / 100 : 0;
  const deliveryFee = cartSubtotal >= 35 || appliedCoupon?.code === 'FREESHIP' ? 0 : 4.99;
  const cartTax = (cartSubtotal - cartDiscount) * 0.0825; // 8.25% standard sales tax
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + deliveryFee + cartTax);
  const totalCartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Payment Processing Simulation
  const processPayment = async (
    paymentData: PaymentFormData,
    method: PaymentMethodType
  ): Promise<{ success: boolean; order?: Order; error?: string }> => {
    // 1. Verify stock availability for all items
    for (const item of cart) {
      const liveProd = products.find(p => p.id === item.product.id);
      if (!liveProd || liveProd.inStock < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for "${item.product.name}". Only ${liveProd ? liveProd.inStock : 0} units left.`,
        };
      }
    }

    // 2. Decrement stock for all purchased items
    setProducts(prev =>
      prev.map(p => {
        const itemInCart = cart.find(ci => ci.product.id === p.id);
        if (itemInCart) {
          const updatedStock = Math.max(0, p.inStock - itemInCart.quantity);
          logInventoryChange(
            p.id,
            p.name,
            -itemInCart.quantity,
            updatedStock,
            'purchase',
            p.aisle
          );
          return { ...p, inStock: updatedStock };
        }
        return p;
      })
    );

    // 3. Create confirmed Order
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const trackingNum = 'SM-TRK-' + Math.floor(10000000 + Math.random() * 90000000);
    
    const now = new Date();
    const estDeliveryDate = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

    const newOrder: Order = {
      id: orderId,
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscount,
      deliveryFee,
      tax: cartTax,
      total: cartTotal,
      appliedCoupon: appliedCoupon?.code,
      paymentMethod: method,
      paymentStatus: method === 'cash_on_delivery' ? 'cod_confirmed' : 'paid',
      deliveryAddress: {
        fullName: paymentData.fullName,
        email: paymentData.email,
        phone: paymentData.phone,
        address: paymentData.address + (paymentData.apartment ? `, ${paymentData.apartment}` : ''),
        city: paymentData.city,
        zipCode: paymentData.zipCode,
        deliverySlot: paymentData.deliverySlot || 'Standard Delivery (2-Hour Express)',
      },
      trackingNumber: trackingNum,
      createdAt: now.toLocaleString(),
      estimatedDelivery: estDeliveryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      status: 'Picking at Warehouse',
    };

    setOrders(prev => [newOrder, ...prev]);
    setCurrentOrderSuccess(newOrder);
    clearCart();
    setIsCheckoutOpen(false);

    return { success: true, order: newOrder };
  };

  const toggleLiveShopperSimulation = () => {
    setIsSimulatingLiveShoppers(prev => !prev);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        compareList,
        inventoryLogs,
        orders,
        appliedCoupon,
        couponError,
        selectedCategory,
        activeTab,
        searchQuery,
        sortBy,
        priceRange,
        onlyOrganic,
        isSimulatingLiveShoppers,
        activeQuickViewProduct,
        isCartOpen,
        isCheckoutOpen,
        isInventoryModalOpen,
        isMobilePreviewActive,
        currentOrderSuccess,
        liveAlerts,

        setSelectedCategory,
        setActiveTab,
        setSearchQuery,
        setSortBy,
        setPriceRange,
        setOnlyOrganic,
        toggleLiveShopperSimulation,

        setActiveQuickViewProduct,
        setIsCartOpen,
        setIsCheckoutOpen,
        setIsInventoryModalOpen,
        setIsMobilePreviewActive,
        setCurrentOrderSuccess,
        dismissAlert,

        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        toggleCompare,
        applyCoupon,
        removeCoupon,

        restockProduct,
        adjustProductStock,
        resetAllInventory,

        processPayment,

        cartSubtotal,
        cartDiscount,
        deliveryFee,
        cartTax,
        cartTotal,
        totalCartItemsCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
