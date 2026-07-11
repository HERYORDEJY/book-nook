import React, { useCallback } from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import CustomScreenContainer from "~/components/CustomScreenContainer";
import CustomText from "~/components/CustomText";
import { lightThemeColor } from "~/styles/color";
import CartItem from "~/features/cart/components/CartItem";
import { CartItemType } from "~/features/cart/store/cartStore";
import {
    useCartItems,
    useCartTotalPrice,
} from "~/features/cart/store/selectors";

export default function Cart(): React.JSX.Element {
    const items = useCartItems();
    const totalPrice = useCartTotalPrice();

    const keyExtractor = useCallback((item: CartItemType) => item.book.id, []);

    const renderItem: ListRenderItem<CartItemType> = useCallback(
        ({ item }) => <CartItem item={item} />,
        [],
    );

    if (items.length === 0) {
        return (
            <CustomScreenContainer>
                <View style={styles.empty}>
                    <CustomText color={lightThemeColor.textSecondary}>
                        Your cart is empty
                    </CustomText>
                </View>
            </CustomScreenContainer>
        );
    }

    return (
        <CustomScreenContainer>
            <FlatList
                data={items}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.footer}>
                <CustomText fontFamily={"medium"}>Total</CustomText>
                <CustomText fontFamily={"bold"} fontSize={18}>
                    ₦{totalPrice}
                </CustomText>
            </View>
        </CustomScreenContainer>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 16,
    },
    empty: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
    },
});
