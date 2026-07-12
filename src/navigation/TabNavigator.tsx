import React from "react";
import { TabParamList } from "~/navigation/types";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "~/features/books/screens/Home";
import Cart from "~/features/cart/screens/Cart";
import { GoogleSansFont } from "~/styles/font";
import HomeTabIcon from "~/components/svgs/tab-navigation/HomeTabIcon";
import CartTabIcon from "~/components/svgs/tab-navigation/CartTabIcon";
import { useCartItemCount } from "~/features/cart/store/selectors";
import { lightThemeColor } from "~/styles/color";

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
    const cartCount = useCartItemCount();
    return (
        <Tab.Navigator
            screenOptions={{
                headerTitleStyle: {
                    fontFamily: GoogleSansFont.bold,
                    color: "#1C274C",
                },
                tabBarActiveTintColor: "#1C274C",
                tabBarInactiveTintColor: "#CCCCCC",
            }}
        >
            <Tab.Screen
                name={"Home"}
                component={Home}
                options={{
                    headerTitle: "Book Nook",
                    tabBarIcon: ({ focused, color }) => (
                        <HomeTabIcon color={color} width={20} height={20} />
                    ),
                    title: "Nook",
                }}
            />
            <Tab.Screen
                name={"Cart"}
                component={Cart}
                options={{
                    headerTitle: "Cart",
                    tabBarIcon: ({ focused, color }) => (
                        <CartTabIcon color={color} width={20} height={20} />
                    ),
                    tabBarBadge: cartCount > 0 ? cartCount : undefined,
                    tabBarBadgeStyle: {
                        backgroundColor: lightThemeColor.accent,
                        color: "#FFFFFF",
                    },
                }}
            />
        </Tab.Navigator>
    );
}
