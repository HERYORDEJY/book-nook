import React from "react";
import { Alert } from "react-native";
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";
import Checkout from "~/features/checkout/screens/Checkout";
import { useCartStore } from "~/features/cart/store/cartStore";
import { bookApiService } from "~/services/mock/api/book";
import { makeBook } from "~/test-utils/factories";

const mockGoBack = jest.fn();
jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ goBack: mockGoBack }),
}));

function seedCart() {
    const book = makeBook({ id: "a", price: 1000, stock: 5 });
    useCartStore.setState({ items: { a: { book, quantity: 2 } } });
}

async function fillValidForm() {
    await fireEvent.changeText(
        screen.getByPlaceholderText("Jane Doe"),
        "Jane Doe",
    );
    await fireEvent.changeText(
        screen.getByPlaceholderText("jane@example.com"),
        "jane@example.com",
    );
    await fireEvent.changeText(
        screen.getByPlaceholderText("1234 5678 9012 3456"),
        "4242424242424242",
    );
    await fireEvent.changeText(screen.getByPlaceholderText("MM/YY"), "12/29");
    await fireEvent.changeText(screen.getByPlaceholderText("123"), "123");
}

describe("Checkout", () => {
    let checkoutSpy: jest.SpyInstance;
    let alertSpy: jest.SpyInstance;

    beforeEach(() => {
        useCartStore.setState({ items: {} });
        mockGoBack.mockClear();
        checkoutSpy = jest.spyOn(bookApiService, "checkout");
        alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    });

    afterEach(() => {
        checkoutSpy.mockRestore();
        alertSpy.mockRestore();
    });

    it("blocks submission and shows field errors when the form is empty", async () => {
        seedCart();
        await render(<Checkout />);

        await fireEvent.press(screen.getByText("Place order"));

        expect(await screen.findByText("Name is required")).toBeOnTheScreen();
        expect(screen.getByText("Enter a valid email")).toBeOnTheScreen();
        expect(screen.getByText("Enter a valid card number")).toBeOnTheScreen();
        expect(checkoutSpy).not.toHaveBeenCalled();
    });

    it("submits a valid order: calls checkout, clears the cart, and confirms", async () => {
        seedCart();
        checkoutSpy.mockResolvedValue({
            orderId: "BN-TEST",
            totalAmount: 2000,
            createdAt: "2026-01-01T00:00:00.000Z",
        });
        await render(<Checkout />);

        await fillValidForm();
        await fireEvent.press(screen.getByText("Place order"));

        await waitFor(() => expect(checkoutSpy).toHaveBeenCalledTimes(1));
        expect(checkoutSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                customer: { name: "Jane Doe", email: "jane@example.com" },
            }),
        );
        await waitFor(() => expect(useCartStore.getState().items).toEqual({}));
        expect(alertSpy).toHaveBeenCalledWith(
            "Order placed",
            expect.stringContaining("BN-TEST"),
            expect.any(Array),
        );

        // Tapping OK on the success alert navigates back.
        const buttons = alertSpy.mock.calls[0][2] as {
            onPress?: () => void;
        }[];
        buttons[0].onPress?.();
        expect(mockGoBack).toHaveBeenCalled();
    });

    it("keeps the cart and shows an error when checkout fails", async () => {
        seedCart();
        checkoutSpy.mockRejectedValue(new Error("Network request failed"));
        await render(<Checkout />);

        await fillValidForm();
        await fireEvent.press(screen.getByText("Place order"));

        await waitFor(() =>
            expect(alertSpy).toHaveBeenCalledWith(
                "Checkout failed",
                "Network request failed",
            ),
        );
        expect(useCartStore.getState().items.a).toBeDefined();
    });
});
