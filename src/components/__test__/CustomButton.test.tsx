import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import CustomButton from "~/components/CustomButton";

describe("CustomButton", () => {
    it("renders its label and fires onPress", async () => {
        const onPress = jest.fn();
        await render(<CustomButton onPress={onPress}>Tap me</CustomButton>);

        await fireEvent.press(screen.getByText("Tap me"));

        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("does not fire onPress while loading", async () => {
        const onPress = jest.fn();
        await render(
            <CustomButton onPress={onPress} loading>
                Tap me
            </CustomButton>,
        );

        await fireEvent.press(screen.getByText("Tap me"));

        expect(onPress).not.toHaveBeenCalled();
    });

    it("does not fire onPress while disabled", async () => {
        const onPress = jest.fn();
        await render(
            <CustomButton onPress={onPress} disabled>
                Tap me
            </CustomButton>,
        );

        await fireEvent.press(screen.getByText("Tap me"));

        expect(onPress).not.toHaveBeenCalled();
    });
});
