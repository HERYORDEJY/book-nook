import React from "react";
import { StyleSheet, View } from "react-native";
import BooksListItemSkeleton from "~/features/books/components/BooksListItemSkeleton";

const NUM_COLUMNS = 2;
const GAP = 16;
const SKELETON_COUNT = 6;

export default function BooksListLoading(): React.JSX.Element {
    return (
        <View style={styles.container}>
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => {
                const isLeftColumn = index % NUM_COLUMNS === 0;
                return (
                    <View
                        key={index}
                        style={[
                            styles.item,
                            {
                                paddingLeft: isLeftColumn ? 0 : GAP / 2,
                                paddingRight: isLeftColumn ? GAP / 2 : 0,
                            },
                        ]}
                    >
                        <BooksListItemSkeleton />
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 16,
    },
    item: {
        width: "50%",
        marginBottom: GAP,
    },
});
