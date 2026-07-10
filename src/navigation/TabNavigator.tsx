import React from "react";
import { TabParamList } from "~/navigation/types";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "~/features/books/screens/Home";
import Cart from "~/features/cart/screens/Cart";

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name={"Home"}
                component={Home}
                options={{ headerTitle: "Book Nook" }}
            />
            <Tab.Screen name={"Cart"} component={Cart} />
        </Tab.Navigator>
    );
}
