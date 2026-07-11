import React from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "~/styles";
import ShimmerSkeleton from "~/components/ShimmerSkeleton";

export default function BooksListItemSkeleton(): React.JSX.Element {
    return (
        <View style={styles.container}>
            <ShimmerSkeleton
                style={styles.coverImageWrapper}
                borderRadius={0}
            />

            <View style={styles.body}>
                <ShimmerSkeleton width={"80%"} height={14} />

                <View style={[Styles.row, { justifyContent: "space-between" }]}>
                    <ShimmerSkeleton width={"40%"} height={10} />
                    <ShimmerSkeleton width={"20%"} height={10} />
                </View>

                <ShimmerSkeleton width={"50%"} height={12} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f9f9f9",
        borderRadius: 5,
        overflow: "hidden",
    },
    coverImageWrapper: {
        width: "100%",
        height: 160,
    },
    body: {
        paddingHorizontal: 4,
        paddingBottom: 6,
        paddingTop: 6,
        rowGap: 6,
    },
});
