import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { BookDataType } from "~/types/book";
import BooksListItem from "~/features/books/components/BooksListItem";
import { bookApiService } from "~/services/mock/api/book";
import { PaginatedDataType } from "~/services/mock/api/types";
import CustomTextInput from "~/components/CustomTextInput";
import SearchIcon from "~/components/svgs/SearchIcon";

const NUM_COLUMNS = 2;
const GAP = 16;

export default function BooksList(): React.JSX.Element {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [booksResponseData, setBooksResponseData] = useState<
        PaginatedDataType<BookDataType>
    >({ limit: 10, page: 1 } as PaginatedDataType<BookDataType>);

    const keyExtractor = useCallback((item: BookDataType) => item.id, []);

    const getBooks = useCallback(async () => {
        try {
            const response = await bookApiService.getBooks({
                limit: booksResponseData.limit,
                page: booksResponseData.page,
                search: searchQuery,
            });
            setBooksResponseData(response);
        } catch (err) {
            console.log(err);
        }
    }, []);

    const renderItem: ListRenderItem<BookDataType> = useCallback(
        ({ item, index }) => {
            const isLeftColumn = index % NUM_COLUMNS === 0;
            return (
                <View
                    style={[
                        styles.item,
                        {
                            paddingLeft: isLeftColumn ? 0 : GAP / 2,
                            paddingRight: isLeftColumn ? GAP / 2 : 0,
                        },
                    ]}
                >
                    <BooksListItem item={item} />
                </View>
            );
        },
        [],
    );

    const renderSearchBar = useCallback(() => {
        return (
            <View style={[styles.searchBarContainer]}>
                <CustomTextInput
                    placeholder={"Search book title..."}
                    renderLeftElement={
                        <SearchIcon width={20} height={20} color={"#999999"} />
                    }
                    onChangeText={setSearchQuery}
                />
            </View>
        );
    }, []);

    console.log("\n\n searchQuery :>> \t\t", searchQuery, "\n\n---");

    useEffect(() => {
        getBooks();
    }, [searchQuery]);

    return (
        <>
            {renderSearchBar()}

            <FlashList
                data={booksResponseData?.data}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                contentContainerStyle={styles.contentContainer}
                numColumns={2}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        //
    },
    contentContainer: {
        padding: 16,
        paddingTop: 0,
    },
    item: {
        marginBottom: GAP,
    },
    searchBarContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
    },
});
