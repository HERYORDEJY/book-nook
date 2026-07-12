import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import BooksListItem from "~/features/books/components/BooksListItem";
import { makeBook } from "~/test-utils/factories";

const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: mockNavigate }),
}));

describe("BooksListItem", () => {
    beforeEach(() => mockNavigate.mockClear());

    it("renders the book title, author and formatted price", async () => {
        const book = makeBook({
            title: "Dune",
            author: "Herbert",
            price: 1500,
        });
        await render(<BooksListItem item={book} />);

        expect(screen.getByText("Dune")).toBeOnTheScreen();
        expect(screen.getByText("Herbert")).toBeOnTheScreen();
        expect(screen.getByText("₦1,500.00")).toBeOnTheScreen();
    });

    it("navigates to BookDetails on press", async () => {
        const book = makeBook({ title: "Dune" });
        await render(<BooksListItem item={book} />);

        await fireEvent.press(screen.getByText("Dune"));

        expect(mockNavigate).toHaveBeenCalledWith("BookDetails", {
            book: JSON.stringify(book),
        });
    });
});
