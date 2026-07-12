import React, { useCallback, useState } from "react";
import {
    Alert,
    FlatList,
    ListRenderItem,
    StyleSheet,
    View,
} from "react-native";
import CustomScreenContainer from "~/components/CustomScreenContainer";
import CustomText from "~/components/CustomText";
import { lightThemeColor } from "~/styles/color";
import CartItem from "~/features/cart/components/CartItem";
import { CartItemType, useCartStore } from "~/features/cart/store/cartStore";
import {
    useCartItems,
    useCartTotalPrice,
} from "~/features/cart/store/selectors";
import { Styles } from "~/styles";
import CustomButton from "~/components/CustomButton";
import { bookApiService } from "~/services/mock/api/book";
import { formatAmountIntl } from "~/utils/amount-helpers";

export default function Cart(): React.JSX.Element {
    const items = useCartItems();
    const totalPrice = useCartTotalPrice();
    const clearCart = useCartStore((state) => state.clearCart);
    const [checkingOut, setCheckingOut] = useState(false);

    const keyExtractor = useCallback((item: CartItemType) => item.book.id, []);

    const handleCheckout = useCallback(async () => {
        setCheckingOut(true);
        try {
            const order = await bookApiService.checkout({
                customer: { name: "Guest", email: "guest@booknook.app" },
                items,
            });
            clearCart();
            Alert.alert("Order placed", `Order ${order.orderId} confirmed.`);
        } catch (error) {
            Alert.alert(
                "Checkout failed",
                error instanceof Error ? error.message : "Please try again.",
            );
        } finally {
            setCheckingOut(false);
        }
    }, [items, clearCart]);

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
                <View style={[Styles.row, { justifyContent: "space-between" }]}>
                    <CustomText fontFamily={"medium"}>Total</CustomText>
                    <CustomText fontFamily={"bold"} fontSize={18}>
                        {formatAmountIntl(totalPrice)}
                    </CustomText>
                </View>

                <CustomButton onPress={handleCheckout} loading={checkingOut}>
                    Checkout
                </CustomButton>
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
        paddingHorizontal: 16,
        rowGap: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
    },
});
