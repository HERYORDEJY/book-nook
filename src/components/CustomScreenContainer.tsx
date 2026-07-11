import React, { PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = PropsWithChildren;

export default function CustomScreenContainer(props: Props): React.JSX.Element {
    return (
        <SafeAreaView
            style={styles.container}
            edges={["left", "right", "bottom"]}
        >
            {props.children}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
