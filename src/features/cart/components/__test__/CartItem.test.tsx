import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import CartItem from "~/features/cart/components/CartItem";
import { useCartStore } from "~/features/cart/store/cartStore";
import { makeBook } from "~/test-utils/factories";

const MINUS = "−"; // U+2212, matches the glyph rendered by the stepper

describe("CartItem", () => {
    beforeEach(() => {
        useCartStore.setState({ items: {} });
    });

    it("renders the book title and formatted price", async () => {
        const book = makeBook({ id: "a", title: "Dune", price: 1500 });
        await render(<CartItem item={{ book, quantity: 1 }} />);

        expect(screen.getByText("Dune")).toBeOnTheScreen();
        expect(screen.getByText("₦1,500.00")).toBeOnTheScreen();
    });

    it("increments quantity in the store when + is pressed", async () => {
        const book = makeBook({ id: "a", stock: 5 });
        useCartStore.setState({ items: { a: { book, quantity: 2 } } });
        await render(<CartItem item={{ book, quantity: 2 }} />);

        fireEvent.press(screen.getByText("+"));

        expect(useCartStore.getState().items["a"].quantity).toBe(3);
    });

    it("decrements quantity in the store when − is pressed", async () => {
        const book = makeBook({ id: "a", stock: 5 });
        useCartStore.setState({ items: { a: { book, quantity: 2 } } });
        await render(<CartItem item={{ book, quantity: 2 }} />);

        fireEvent.press(screen.getByText(MINUS));

        expect(useCartStore.getState().items["a"].quantity).toBe(1);
    });

    it("disables − at quantity 1 so it cannot go below 1", async () => {
        const book = makeBook({ id: "a", stock: 5 });
        useCartStore.setState({ items: { a: { book, quantity: 1 } } });
        await render(<CartItem item={{ book, quantity: 1 }} />);

        fireEvent.press(screen.getByText(MINUS));

        expect(useCartStore.getState().items["a"].quantity).toBe(1);
    });

    it("removes the book from the store when Remove is pressed", async () => {
        const book = makeBook({ id: "a" });
        useCartStore.setState({ items: { a: { book, quantity: 1 } } });
        await render(<CartItem item={{ book, quantity: 1 }} />);

        fireEvent.press(screen.getByText("Remove"));

        expect(useCartStore.getState().items["a"]).toBeUndefined();
    });
});
