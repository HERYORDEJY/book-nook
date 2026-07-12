import React from "react";
import { render, screen } from "@testing-library/react-native";
import CustomActivityIndicator from "~/components/CustomActivityIndicator";

describe("CustomActivityIndicator", () => {
    it("renders nothing when not loading", async () => {
        await render(<CustomActivityIndicator isLoading={false} />);
        expect(screen.toJSON()).toBeNull();
    });

    it("renders its label when loading", async () => {
        await render(
            <CustomActivityIndicator
                isLoading
                layout={"inline"}
                label={"Loading..."}
            />,
        );
        expect(screen.getByText("Loading...")).toBeOnTheScreen();
    });
});
