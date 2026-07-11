import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";
import { FontType, GoogleSansFont } from "~/styles/font";
import { lightThemeColor } from "~/styles/color";

interface Props extends TextProps {
    fontFamily?: FontType;
    fontSize?: number;
    color?: string;
}

export default function CustomText({
    fontFamily = "regular",
    fontSize = 14,
    color = lightThemeColor.textPrimary,
    ...props
}: Props): React.JSX.Element {
    const resolvedFontFamily = { ...GoogleSansFont }[fontFamily];

    return (
        <Text
            {...props}
            style={[
                styles.text,
                { fontFamily: resolvedFontFamily, fontSize, color },
                props.style,
            ]}
        />
    );
}

const styles = StyleSheet.create({
    text: {
        fontFamily: GoogleSansFont.regular,
    },
});
