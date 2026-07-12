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
import CustomActivityIndicator from "~/components/CustomActivityIndicator";

interface Props extends Omit<PressableProps, "children"> {
    children: string | React.ReactNode;
    variant?: "filled" | "outlined" | "text" | "icon";
    icon?: React.ReactNode;
    renderLeftIcon?: React.ReactNode;
    renderRightIcon?: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    loading?: boolean;
}

export default function CustomButton({
    variant = "filled",
    ...props
}: Props): React.JSX.Element {
    const isDisabled = props.disabled || props.loading;
    return (
        <Pressable
            {...props}
            style={({ pressed }) => [
                styles.container,
                variant === "icon" && { width: "auto" },
                variant === "outlined" && {
                    backgroundColor: "transparent",
                    borderColor: lightThemeColor.buttonBackground,
                    borderWidth: 1,
                },
                props.containerStyle,
                pressed && { opacity: 0.7 },
            ]}
            disabled={isDisabled}
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

            {props.loading ? (
                <CustomActivityIndicator
                    size={"small"}
                    indicatorWrapperStyle={{ backgroundColor: "transparent" }}
                />
            ) : null}
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
        overflow: "hidden",
    },
});
