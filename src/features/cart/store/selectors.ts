import { useShallow } from "zustand/react/shallow";
import { CartItemType, useCartStore } from "~/features/cart/store/cartStore";

export const useCartItems = (): CartItemType[] =>
    useCartStore(useShallow((state) => Object.values(state.items)));

export const useCartItemCount = (): number =>
    useCartStore((state) =>
        Object.values(state.items).reduce(
            (sum, item) => sum + item.quantity,
            0,
        ),
    );

export const useCartTotalPrice = (): number =>
    useCartStore((state) =>
        Number(
            Object.values(state.items)
                .reduce((sum, item) => sum + item.book.price * item.quantity, 0)
                .toFixed(2),
        ),
    );
