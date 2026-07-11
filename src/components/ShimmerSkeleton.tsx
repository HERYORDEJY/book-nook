import React, { useEffect, useState } from "react";
import {
    DimensionValue,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
    width?: DimensionValue;
    height?: DimensionValue;
    borderRadius?: number;
    style?: StyleProp<ViewStyle>;
}

export default function ShimmerSkeleton({
    width = "100%",
    height = 16,
    borderRadius = 6,
    style,
}: Props): React.JSX.Element {
    const [boxWidth, setBoxWidth] = useState(0);
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withRepeat(
            withTiming(1, { duration: 1200, easing: Easing.linear }),
            -1,
            false,
        );
    }, [progress]);

    const sweepStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: interpolate(
                    progress.value,
                    [0, 1],
                    [-boxWidth, boxWidth],
                ),
            },
        ],
    }));

    return (
        <View
            onLayout={(event) => setBoxWidth(event.nativeEvent.layout.width)}
            style={[{ width, height, borderRadius }, styles.base, style]}
        >
            <Animated.View style={[StyleSheet.absoluteFill, sweepStyle]}>
                <LinearGradient
                    colors={[
                        "transparent",
                        "rgba(255,255,255,0.65)",
                        "transparent",
                    ]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    base: {
        backgroundColor: "#E1E9EE",
        overflow: "hidden",
    },
});
