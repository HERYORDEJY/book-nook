import { BookDataType, ReviewDataType } from "~/types/book";

let seq = 0;

export function makeBook(overrides: Partial<BookDataType> = {}): BookDataType {
    seq += 1;
    return {
        id: `book-${seq}`,
        title: `Book ${seq}`,
        author: "Author Name",
        price: 1000,
        coverUrl: { thumbnail: "thumb.png", full: "full.png" },
        description: "A book description.",
        rating: 4,
        reviews: [],
        stock: 10,
        ...overrides,
    };
}

export function makeReview(
    overrides: Partial<ReviewDataType> = {},
): ReviewDataType {
    seq += 1;
    return {
        id: `review-${seq}`,
        author: "Reviewer",
        rating: 5,
        comment: "Great read.",
        date: "2026-01-01",
        ...overrides,
    };
}
