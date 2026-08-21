import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
  description?: string;
  category_id?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  toggleCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
  addToCart: (product) => {
    set((state) => {
      if (product.stock <= 0) return state; // No agregar si no hay stock

      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          return { ...state, isOpen: true }; // No agregar más del stock
        }
        return {
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
          isOpen: true,
        };
      }
      return { items: [...state.items, { ...product, quantity: 1 }], isOpen: true };
    });
  },
  removeFromCart: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },
  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, Math.min(quantity, item.stock));
          return { ...item, quantity: newQuantity };
        }
        return item;
      }),
    }));
  },
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  getCartTotal: () => {
    const items = get().items;
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  getCartCount: () => {
    const items = get().items;
    return items.reduce((count, item) => count + item.quantity, 0);
  },
  clearCart: () => set({ items: [] }),
    }),
    {
      name: 'tienda-libano-cart',
      partialize: (state) => ({ items: state.items }), // Solo guardar los items
    }
  )
);
