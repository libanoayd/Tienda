import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
  description?: string;
  category_id?: number;
  variants?: string[]; // Array de opciones (ej: ["Lavanda", "Vainilla"])
  selectedVariant?: string; // La opción elegida por el usuario
}

export interface CartItem extends Product {
  quantity: number;
  cartItemId: string; // Identificador único (id + variante)
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (product: Product, variant?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
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
      addToCart: (product, variant) => {
        set((state) => {
          if (product.stock <= 0) return state;

          const cartItemId = variant ? `${product.id}-${variant}` : `${product.id}`;
          
          const existingItem = state.items.find((item) => item.cartItemId === cartItemId);
          if (existingItem) {
            if (existingItem.quantity >= product.stock) {
              return { ...state, isOpen: true };
            }
            return {
              items: state.items.map((item) =>
                item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
              ),
              isOpen: true,
            };
          }
          return { 
            items: [...state.items, { ...product, quantity: 1, cartItemId, selectedVariant: variant }], 
            isOpen: true 
          };
        });
      },
      removeFromCart: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        }));
      },
      updateQuantity: (cartItemId, quantity) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.cartItemId === cartItemId) {
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
      name: "tienda-libano-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

