import { act, renderHook } from "@testing-library/react-native";
import { useCartStore } from "~/features/cart/store/cartStore";
import {
    useCartItemCount,
    useCartTotalPrice,
} from "~/features/cart/store/selectors";
import { makeBook } from "~/test-utils/factories";

const store = () => useCartStore.getState();

describe("cartStore", () => {
    beforeEach(() => {
        useCartStore.setState({ items: {} });
    });

    it("adds a new book with quantity 1", () => {
        store().addItem(makeBook({ id: "a", stock: 5 }));
        expect(store().items["a"].quantity).toBe(1);
    });

    it("increments quantity when the same book is added again (no duplicates)", () => {
        const book = makeBook({ id: "a", stock: 5 });
        store().addItem(book);
        store().addItem(book);
        expect(Object.keys(store().items)).toHaveLength(1);
        expect(store().items["a"].quantity).toBe(2);
    });

    it("never adds beyond available stock", () => {
        const book = makeBook({ id: "a", stock: 1 });
        store().addItem(book);
        store().addItem(book);
        expect(store().items["a"].quantity).toBe(1);
    });

    it("clamps setQuantity to a minimum of 1", () => {
        const book = makeBook({ id: "a", stock: 5 });
        store().addItem(book);
        store().setQuantity("a", 0);
        expect(store().items["a"].quantity).toBe(1);
    });

    it("clamps setQuantity to the available stock", () => {
        const book = makeBook({ id: "a", stock: 3 });
        store().addItem(book);
        store().setQuantity("a", 99);
        expect(store().items["a"].quantity).toBe(3);
    });

    it("ignores setQuantity for a book that is not in the cart", () => {
        store().setQuantity("missing", 4);
        expect(store().items["missing"]).toBeUndefined();
    });

    it("removes a book", () => {
        store().addItem(makeBook({ id: "a" }));
        store().removeItem("a");
        expect(store().items["a"]).toBeUndefined();
    });

    it("clears the whole cart", () => {
        store().addItem(makeBook({ id: "a" }));
        store().addItem(makeBook({ id: "b" }));
        store().clearCart();
        expect(Object.keys(store().items)).toHaveLength(0);
    });
});

describe("cart selectors", () => {
    beforeEach(() => {
        useCartStore.setState({ items: {} });
    });

    it("itemCount sums quantities across items", async () => {
        store().addItem(makeBook({ id: "a", stock: 5 }));
        store().addItem(makeBook({ id: "a", stock: 5 }));
        store().addItem(makeBook({ id: "b", stock: 5 }));

        const { result } = await renderHook(() => useCartItemCount());
        expect(result.current).toBe(3);
    });

    it("totalPrice reflects quantities and updates dynamically", async () => {
        store().addItem(makeBook({ id: "a", price: 1500, stock: 5 }));

        const { result } = await renderHook(() => useCartTotalPrice());
        expect(result.current).toBe(1500);

        await act(async () => {
            store().setQuantity("a", 3);
        });
        expect(result.current).toBe(4500);
    });
});
