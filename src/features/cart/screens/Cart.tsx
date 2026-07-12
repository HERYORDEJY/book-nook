import React, { useCallback } from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CustomScreenContainer from "~/components/CustomScreenContainer";
import CustomText from "~/components/CustomText";
import { lightThemeColor } from "~/styles/color";
import CartItem from "~/features/cart/components/CartItem";
import { CartItemType } from "~/features/cart/store/cartStore";
import {
    useCartItems,
    useCartTotalPrice,
} from "~/features/cart/store/selectors";
import { Styles } from "~/styles";
import CustomButton from "~/components/CustomButton";
import BookPrice from "~/features/books/components/BookPrice";
import { RootStackParamList } from "~/navigation/types";

export default function Cart(): React.JSX.Element {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const items = useCartItems();
    const totalPrice = useCartTotalPrice();

    const keyExtractor = useCallback((item: CartItemType) => item.book.id, []);

    const handleCheckout = useCallback(() => {
        navigation.navigate("Checkout");
    }, [navigation]);

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
                    <BookPrice
                        amount={totalPrice}
                        fontFamily={"bold"}
                        fontSize={18}
                    />
                </View>

                <CustomButton onPress={handleCheckout}>Checkout</CustomButton>
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
