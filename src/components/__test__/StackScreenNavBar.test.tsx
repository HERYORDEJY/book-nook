import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import StackScreenNavBar from "~/components/StackScreenNavBar";
import CustomText from "~/components/CustomText";

const mockGoBack = jest.fn();
jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ goBack: mockGoBack }),
}));

describe("StackScreenNavBar", () => {
    beforeEach(() => mockGoBack.mockClear());

    it("renders the title and right element", async () => {
        await render(
            <StackScreenNavBar
                title={"Details"}
                rightElement={<CustomText>RightSlot</CustomText>}
            />,
        );
        expect(screen.getByText(/Details/)).toBeOnTheScreen();
        expect(screen.getByText("RightSlot")).toBeOnTheScreen();
    });

    it("calls navigation.goBack when the back button is pressed", async () => {
        await render(<StackScreenNavBar title={"Details"} />);
        await fireEvent.press(screen.getByTestId("stack-navbar-back-button"));
        expect(mockGoBack).toHaveBeenCalledTimes(1);
    });
});
