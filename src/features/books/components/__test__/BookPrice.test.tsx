import React from "react";
import { render, screen } from "@testing-library/react-native";
import BookPrice from "~/features/books/components/BookPrice";

describe("BookPrice", () => {
    it("renders the amount formatted as currency", async () => {
        await render(<BookPrice amount={2500} />);
        expect(screen.getByText("₦2,500.00")).toBeOnTheScreen();
    });

    it("forwards testID and shows the formatted amount", async () => {
        await render(<BookPrice amount={999} testID={"book-price"} />);
        expect(screen.getByTestId("book-price")).toHaveTextContent("₦999.00");
    });

    it("renders the ₦0.00 fallback for an invalid amount", async () => {
        await render(<BookPrice amount={NaN} testID={"book-price"} />);
        expect(screen.getByTestId("book-price")).toHaveTextContent("₦0.00");
    });
});
