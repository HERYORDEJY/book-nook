import React from "react";
import { render, screen } from "@testing-library/react-native";
import StarRating from "~/components/StarRating";

describe("StarRating", () => {
    it("renders one full star per whole point for an integer rating", async () => {
        await render(<StarRating rating={4} />);
        expect(screen.getAllByTestId("star")).toHaveLength(4);
    });

    it("renders the floored number of full stars for a fractional rating", async () => {
        await render(<StarRating rating={3.5} />);
        expect(screen.getAllByTestId("star")).toHaveLength(3);
    });
});
