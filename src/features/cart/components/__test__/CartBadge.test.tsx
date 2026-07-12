import React from "react";
import { render, screen } from "@testing-library/react-native";
import CartBadge from "~/features/cart/components/CartBadge";
import { useCartStore } from "~/features/cart/store/cartStore";
import { makeBook } from "~/test-utils/factories";

describe("CartBadge", () => {
    beforeEach(() => useCartStore.setState({ items: {} }));

    it("renders nothing when the cart is empty", async () => {
        await render(<CartBadge />);
        expect(screen.toJSON()).toBeNull();
    });

    it("shows the total item count", async () => {
        const book = makeBook({ id: "a", stock: 5 });
        useCartStore.setState({ items: { a: { book, quantity: 3 } } });
        await render(<CartBadge />);
        expect(screen.getByText("3")).toBeOnTheScreen();
    });
});
