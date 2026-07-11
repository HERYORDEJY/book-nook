import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
} from "react-native-reanimated";
import CustomText from "~/components/CustomText";
import { lightThemeColor } from "~/styles/color";
import { useCartItemCount } from "~/features/cart/store/selectors";

export default function CartBadge(): React.JSX.Element | null {
    const count = useCartItemCount();
    const scale = useSharedValue(1);

    useEffect(() => {
        if (count > 0) {
            scale.value = withSequence(
                withSpring(1.4, { damping: 6 }),
                withSpring(1),
            );
        }
    }, [count, scale]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    if (count === 0) return null;

    return (
        <Animated.View style={[styles.badge, animatedStyle]}>
            <CustomText color={"#FFFFFF"} fontSize={10} fontFamily={"bold"}>
                {count}
            </CustomText>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    badge: {
        position: "absolute",
        top: -4,
        right: -4,
        minWidth: 18,
        height: 18,
        paddingHorizontal: 4,
        borderRadius: 9,
        backgroundColor: lightThemeColor.accent,
        alignItems: "center",
        justifyContent: "center",
    },
});
