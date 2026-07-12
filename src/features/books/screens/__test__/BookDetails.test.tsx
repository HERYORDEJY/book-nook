import React from "react";
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";
import BookDetails from "~/features/books/screens/BookDetails";
import { bookApiService } from "~/services/mock/api/book";

const mockBook = {
    id: "a",
    title: "Dune",
    author: "Frank Herbert",
    price: 1500,
    coverUrl: { thumbnail: "thumb.png", full: "full.png" },
    description: "A desert epic.",
    rating: 4,
    reviews: [
        {
            id: "r1",
            author: "Ann",
            rating: 5,
            comment: "Loved this book",
            date: "2026-01-01",
        },
    ],
    stock: 5,
};

jest.mock("@react-navigation/native", () => ({
    useRoute: () => ({ params: { book: JSON.stringify(mockBook) } }),
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));

describe("BookDetails (lifecycle)", () => {
    let getBookSpy: jest.SpyInstance;

    beforeEach(() => {
        getBookSpy = jest.spyOn(bookApiService, "getBook");
    });

    afterEach(() => getBookSpy.mockRestore());

    it("always shows the passed book data and loads reviews on success", async () => {
        getBookSpy.mockResolvedValue(mockBook);
        await render(<BookDetails />);

        // Passed-in data is visible immediately.
        expect(screen.getByText("Dune")).toBeOnTheScreen();
        expect(screen.getByText("₦1,500.00")).toBeOnTheScreen();

        // Reviews arrive after the fetch resolves.
        expect(await screen.findByText("Loved this book")).toBeOnTheScreen();
    });

    it("shows an error with Retry on failure, keeps the passed data, and recovers", async () => {
        getBookSpy.mockRejectedValueOnce(new Error("Network request failed"));
        await render(<BookDetails />);

        // Passed data stays visible even though the fetch failed.
        expect(screen.getByText("Dune")).toBeOnTheScreen();
        expect(
            await screen.findByText("Network request failed"),
        ).toBeOnTheScreen();
        expect(screen.getByText("Retry")).toBeOnTheScreen();

        // Retry re-fetches and renders the reviews.
        getBookSpy.mockResolvedValueOnce(mockBook);
        await fireEvent.press(screen.getByText("Retry"));

        await waitFor(() =>
            expect(screen.getByText("Loved this book")).toBeOnTheScreen(),
        );
    });
});
