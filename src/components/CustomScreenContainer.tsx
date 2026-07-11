import React, { PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import { Edge, Edges, SafeAreaView } from "react-native-safe-area-context";

type Props = PropsWithChildren & {
    edges?: Edges;
};

export default function CustomScreenContainer({
    edges = [],
    ...props
}: Props): React.JSX.Element {
    const resolvedEdges = [...new Set(["left", "right", ...(edges as Edge[])])];
    return (
        <SafeAreaView style={styles.container} edges={resolvedEdges as Edges}>
            {props.children}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
