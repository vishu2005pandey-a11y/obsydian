import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // product id
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  qty: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size?: string, color?: string) => void;
  updateQuantity: (id: string, qty: number, size?: string, color?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.id === item.id && i.size === item.size && i.color === item.color
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].qty += item.qty;
            return { items: updatedItems };
          }
          return { items: [...state.items, item] };
        });
      },
      removeItem: (id, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && i.size === size && i.color === color)
          ),
        }));
      },
      updateQuantity: (id, qty, size, color) => {
        set((state) => {
          const updatedItems = state.items.map((i) => {
            if (i.id === id && i.size === size && i.color === color) {
              return { ...i, qty };
            }
            return i;
          });
          return { items: updatedItems };
        });
      },
      clearCart: () => set({ items: [] }),
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.qty, 0);
      },
    }),
    {
      name: "obsydian-cart",
    }
  )
);
