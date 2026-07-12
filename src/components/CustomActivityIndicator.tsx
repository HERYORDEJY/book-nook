import React from "react";
import {
    ActivityIndicator,
    Platform,
    StyleSheet,
    View,
    type ViewStyle,
} from "react-native";
import { BlurView } from "expo-blur";
import CustomText from "~/components/CustomText";
import { GoogleSansFont } from "~/styles/font";

type BackdropVariant = "blur" | "transparent";
type LayoutVariant = "overlay" | "inline";

interface ActivityLoaderProps {
    isLoading?: boolean;
    layout?: LayoutVariant;
    backdrop?: BackdropVariant;
    blurIntensity?: number;
    blurTint?: "light" | "dark" | "default";
    color?: string;
    size?: "small" | "large";
    label?: string;
    style?: ViewStyle;
    indicatorWrapperStyle?: ViewStyle;
}

export default function CustomActivityIndicator({
    isLoading = true,
    layout = "overlay",
    backdrop = "blur",
    blurIntensity = 40,
    blurTint = "light",
    color = "#6366F1",
    size = "large",
    label,
    style,
    ...props
}: ActivityLoaderProps) {
    if (!isLoading) return null;

    const isOverlay = layout === "overlay";
    const isBlur = backdrop === "blur";

    if (!isOverlay) {
        return (
            <View style={[styles.inlineContainer, style]}>
                <ActivityIndicator size={size} color={color} />
                {label ? (
                    <CustomText style={[styles.label, { color }]}>
                        {label}
                    </CustomText>
                ) : null}
            </View>
        );
    }

    const indicatorNode = (
        <View
            style={[styles.indicatorWrapper, props.indicatorWrapperStyle]}
            pointerEvents="none"
        >
            <ActivityIndicator size={size} color={color} />
            {label ? (
                <CustomText style={[styles.label, { color }]}>
                    {label}
                </CustomText>
            ) : null}
        </View>
    );

    if (isBlur) {
        return (
            <BlurView
                intensity={blurIntensity}
                tint={blurTint}
                style={[styles.overlayBase, style]}
                // On Android, expo-blur renders as a semi-opaque view
                // experimentalBlurMethod provides native blur where available
                experimentalBlurMethod={
                    Platform.OS === "android" ? "dimezisBlurView" : undefined
                }
            >
                {indicatorNode}
            </BlurView>
        );
    }

    // Transparent overlay
    return (
        <View style={[styles.overlayBase, styles.transparentOverlay, style]}>
            {indicatorNode}
        </View>
    );
}

const styles = StyleSheet.create({
    overlayBase: {
        ...StyleSheet.absoluteFill,
        zIndex: 999,
        justifyContent: "center",
        alignItems: "center",
        elevation: 10,
    },

    transparentOverlay: {
        backgroundColor: "transparent",
    },

    indicatorWrapper: {
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        backgroundColor: "rgba(255, 255, 255, 0.75)",
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 28,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 8,
    },

    inlineContainer: {
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 16,
    },

    label: {
        fontSize: 13,
        fontFamily: GoogleSansFont.medium,
        letterSpacing: 0.2,
        textAlign: "center",
    },
});
