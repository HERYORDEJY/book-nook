import React from "react";
import { render, screen } from "@testing-library/react-native";
import CustomScreenContainer from "~/components/CustomScreenContainer";
import CustomText from "~/components/CustomText";

describe("CustomScreenContainer", () => {
    it("renders its children", async () => {
        await render(
            <CustomScreenContainer>
                <CustomText>Inside container</CustomText>
            </CustomScreenContainer>,
        );
        expect(screen.getByText("Inside container")).toBeOnTheScreen();
    });
});
