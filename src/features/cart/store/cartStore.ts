import { create } from "zustand";
import { BookDataType } from "~/types/book";

export interface CartItemType {
    book: BookDataType;
    quantity: number;
}

export interface CartState {
    items: Record<string, CartItemType>;
    addItem: (book: BookDataType) => void;
    removeItem: (id: string) => void;
    setQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
    items: {},
    addItem: (book) =>
        set((state) => {
            const current = state.items[book.id]?.quantity ?? 0;
            const quantity = Math.min(current + 1, book.stock);
            return {
                items: { ...state.items, [book.id]: { book, quantity } },
            };
        }),
    removeItem: (id) =>
        set((state) => {
            const items = { ...state.items };
            delete items[id];
            return { items };
        }),
    setQuantity: (id, quantity) =>
        set((state) => {
            const item = state.items[id];
            if (!item) return state;
            const clamped = Math.max(1, Math.min(quantity, item.book.stock));
            return {
                items: { ...state.items, [id]: { ...item, quantity: clamped } },
            };
        }),
    clearCart: () => set({ items: {} }),
}));
