import React, { useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import CustomText from "~/components/CustomText";
import { Styles } from "~/styles";
import { lightThemeColor } from "~/styles/color";
import { CartItemType, useCartStore } from "~/features/cart/store/cartStore";

interface Props {
    item: CartItemType;
}

export default function CartItem({ item }: Props): React.JSX.Element {
    const setQuantity = useCartStore((state) => state.setQuantity);
    const removeItem = useCartStore((state) => state.removeItem);
    const { book, quantity } = item;

    const decrement = useCallback(
        () => setQuantity(book.id, quantity - 1),
        [setQuantity, book.id, quantity],
    );
    const increment = useCallback(
        () => setQuantity(book.id, quantity + 1),
        [setQuantity, book.id, quantity],
    );
    const remove = useCallback(
        () => removeItem(book.id),
        [removeItem, book.id],
    );

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: book.coverUrl.thumbnail }}
                style={styles.cover}
                contentFit={"cover"}
            />

            <View style={styles.body}>
                <CustomText fontFamily={"medium"} numberOfLines={1}>
                    {book.title}
                </CustomText>
                <CustomText fontSize={12} color={lightThemeColor.textSecondary}>
                    ₦{book.price}
                </CustomText>

                <View style={[Styles.row, styles.stepper]}>
                    <Pressable
                        style={styles.stepButton}
                        onPress={decrement}
                        disabled={quantity <= 1}
                    >
                        <CustomText fontFamily={"medium"}>−</CustomText>
                    </Pressable>
                    <CustomText fontFamily={"medium"}>{quantity}</CustomText>
                    <Pressable style={styles.stepButton} onPress={increment}>
                        <CustomText fontFamily={"medium"}>+</CustomText>
                    </Pressable>
                </View>
            </View>

            <Pressable onPress={remove} hitSlop={8}>
                <CustomText color={lightThemeColor.accent}>Remove</CustomText>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 12,
    },
    cover: {
        width: 56,
        height: 72,
        borderRadius: 4,
        backgroundColor: "#f2f2f2",
    },
    body: {
        flex: 1,
        rowGap: 6,
    },
    stepper: {
        gap: 16,
    },
    stepButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        alignItems: "center",
        justifyContent: "center",
    },
});
