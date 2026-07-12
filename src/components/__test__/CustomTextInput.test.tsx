import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import CustomTextInput from "~/components/CustomTextInput";

describe("CustomTextInput", () => {
    it("renders the label when provided", async () => {
        await render(<CustomTextInput label={"Email"} />);
        expect(screen.getByText("Email")).toBeOnTheScreen();
    });

    it("calls onChangeText with the typed value", async () => {
        const onChangeText = jest.fn();
        await render(
            <CustomTextInput
                placeholder={"you@example.com"}
                onChangeText={onChangeText}
            />,
        );

        await fireEvent.changeText(
            screen.getByPlaceholderText("you@example.com"),
            "hi@x.com",
        );

        expect(onChangeText).toHaveBeenCalledWith("hi@x.com");
    });
});
