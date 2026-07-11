import React from "react";
import { RootStackParamList } from "~/navigation/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "~/navigation/TabNavigator";
import BookDetails from "~/features/books/screens/BookDetails";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={"Tab"} component={TabNavigator} />
            <Stack.Screen name={"BookDetails"} component={BookDetails} />
        </Stack.Navigator>
    );
}
