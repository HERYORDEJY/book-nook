import React from "react";
import { render, screen } from "@testing-library/react-native";
import ShimmerSkeleton from "~/components/ShimmerSkeleton";

describe("ShimmerSkeleton", () => {
    it("renders with the given dimensions", async () => {
        await render(<ShimmerSkeleton width={120} height={20} />);
        expect(screen.toJSON()).toBeTruthy();
    });
});
