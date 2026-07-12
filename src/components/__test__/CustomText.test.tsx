import React from "react";
import { render, screen } from "@testing-library/react-native";
import CustomText from "~/components/CustomText";

describe("CustomText", () => {
    it("renders its children", async () => {
        await render(<CustomText>Hello</CustomText>);
        expect(screen.getByText("Hello")).toBeOnTheScreen();
    });

    it("applies fontSize and color", async () => {
        await render(
            <CustomText fontSize={20} color={"#123456"}>
                Styled
            </CustomText>,
        );
        expect(screen.getByText("Styled")).toHaveStyle({
            fontSize: 20,
            color: "#123456",
        });
    });

    it("maps fontFamily to the Google Sans font name", async () => {
        await render(<CustomText fontFamily={"medium"}>Bold-ish</CustomText>);
        expect(screen.getByText("Bold-ish")).toHaveStyle({
            fontFamily: "GoogleSansMedium",
        });
    });
});
