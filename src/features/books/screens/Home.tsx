import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Home(): React.JSX.Element {
    return (
        <View style={styles.container}>
            <Text>This is the HomeScreen screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        //
    },
});
