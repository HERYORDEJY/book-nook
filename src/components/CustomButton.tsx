import React from "react";
import {
    Pressable,
    PressableProps,
    StyleProp,
    StyleSheet,
    ViewStyle,
} from "react-native";
import CustomText from "~/components/CustomText";
import { lightThemeColor } from "~/styles/color";

interface Props extends Omit<PressableProps, "children"> {
    children: string | React.ReactNode;
    variant?: "filled" | "outlined" | "text" | "icon";
    icon?: React.ReactNode;
    renderLeftIcon?: React.ReactNode;
    renderRightIcon?: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
}

export default function CustomButton({
    variant = "filled",
    ...props
}: Props): React.JSX.Element {
    return (
        <Pressable
            style={[
                styles.container,
                variant === "icon" && { width: "auto" },
                variant === "outlined" && {
                    backgroundColor: "transparent",
                    borderColor: lightThemeColor.buttonBackground,
                    borderWidth: 1,
                },
                props.containerStyle,
            ]}
        >
            {props.renderLeftIcon}

            {typeof props.children === "string" ? (
                <CustomText
                    fontFamily={"medium"}
                    color={
                        variant === "outlined"
                            ? lightThemeColor.buttonBackground
                            : lightThemeColor.buttonTitle
                    }
                >
                    {props.children}
                </CustomText>
            ) : (
                <>{props.children}</>
            )}

            {props.renderRightIcon}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 46,
        width: "100%",
        gap: 12,
        backgroundColor: lightThemeColor.buttonBackground,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        borderRadius: 8,
    },
});
