import React from "react";
import { render, screen } from "@testing-library/react-native";
import BookDetailsReviews from "~/features/books/components/BookDetailsReviews";
import { makeReview } from "~/test-utils/factories";

describe("BookDetailsReviews", () => {
    it("hides review content while loading (shows skeletons instead)", async () => {
        await render(
            <BookDetailsReviews
                loading
                reviews={[makeReview({ comment: "Hidden while loading" })]}
            />,
        );
        expect(screen.queryByText("Hidden while loading")).toBeNull();
    });

    it("renders review author and comment when loaded", async () => {
        await render(
            <BookDetailsReviews
                loading={false}
                reviews={[
                    makeReview({ author: "Ann", comment: "Loved this book" }),
                ]}
            />,
        );
        expect(screen.getByText("@Ann")).toBeOnTheScreen();
        expect(screen.getByText("Loved this book")).toBeOnTheScreen();
    });
});
