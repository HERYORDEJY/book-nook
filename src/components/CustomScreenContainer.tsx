import React, { PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import { Edge, Edges, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, StatusBarProps } from "expo-status-bar";

type Props = PropsWithChildren & {
    edges?: Edges;
    statusBarProps?: StatusBarProps;
};

export default function CustomScreenContainer({
    edges = [],
    ...props
}: Props): React.JSX.Element {
    const resolvedEdges = [...new Set(["left", "right", ...(edges as Edge[])])];
    return (
        <SafeAreaView style={styles.container} edges={resolvedEdges as Edges}>
            <StatusBar {...(props.statusBarProps ?? {})} />
            {props.children}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },
});
