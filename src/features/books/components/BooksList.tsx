import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    RefreshControl,
    StyleSheet,
    View,
} from "react-native";
import { FlashList, FlashListRef, ListRenderItem } from "@shopify/flash-list";
import { BookDataType } from "~/types/book";
import BooksListItem from "~/features/books/components/BooksListItem";
import { bookApiService } from "~/services/mock/api/book";
import CustomTextInput from "~/components/CustomTextInput";
import CustomText from "~/components/CustomText";
import SearchIcon from "~/components/svgs/SearchIcon";
import CustomActivityIndicator from "~/components/CustomActivityIndicator";
import ScrollToTopArrowIcon from "~/components/svgs/ScrollToTopArrowIcon";
import BooksListLoading from "~/features/books/components/BooksListLoading";

const NUM_COLUMNS = 2;
const GAP = 16;
const LIMIT = 10;

export default function BooksList(): React.JSX.Element {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [books, setBooks] = useState<BookDataType[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasNextPage, setHasNextPage] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

    const listRef = useRef<FlashListRef<BookDataType>>(null);
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const keyExtractor = useCallback((item: BookDataType) => item.id, []);

    const handleSearchChange = useCallback((text: string) => {
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => setSearchQuery(text), 300);
    }, []);

    const fetchBooks = useCallback(
        async (pageToLoad: number, signal?: { cancelled: boolean }) => {
            try {
                const response = await bookApiService.getBooks({
                    limit: LIMIT,
                    page: pageToLoad,
                    search: searchQuery,
                });
                if (signal?.cancelled) return;
                setBooks((prev) =>
                    pageToLoad === 1
                        ? response.data
                        : [...prev, ...response.data],
                );
                setPage(response.page);
                setHasNextPage(response.hasNextPage);
                setError(null);
            } catch (err) {
                if (signal?.cancelled) return;
                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong.",
                );
            }
        },
        [searchQuery],
    );

    const loadFirstPage = useCallback(
        async (signal?: { cancelled: boolean }) => {
            setLoading(true);
            await fetchBooks(1, signal);
            if (!signal?.cancelled) setLoading(false);
        },
        [fetchBooks],
    );

    const loadMore = useCallback(async () => {
        if (loading || loadingMore || refreshing || !hasNextPage) return;
        setLoadingMore(true);
        await fetchBooks(page + 1);
        setLoadingMore(false);
    }, [loading, loadingMore, refreshing, hasNextPage, page, fetchBooks]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchBooks(1);
        setRefreshing(false);
    }, [fetchBooks]);

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
        if (error) {
            return null;
        }
        return (
            <View style={[styles.searchBarContainer]}>
                <CustomTextInput
                    placeholder={"Search book title..."}
                    renderLeftElement={
                        <SearchIcon width={20} height={20} color={"#999999"} />
                    }
                    onChangeText={handleSearchChange}
                />
            </View>
        );
    }, [error, handleSearchChange]);

    const renderEmpty = useCallback(() => {
        if (loading) return null;
        return (
            <View style={styles.centerContainer}>
                <CustomText color={"#999999"}>
                    No books{" "}
                    {Boolean(searchQuery?.trim())
                        ? "matches search query"
                        : "found"}
                </CustomText>
            </View>
        );
    }, [loading, searchQuery]);

    const onScroll = useCallback(
        (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            setShowScrollTop(event.nativeEvent.contentOffset.y > 400);
        },
        [],
    );

    const scrollToTop = useCallback(() => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, []);

    const renderFooter = useCallback(() => {
        if (!loadingMore) return null;
        return <CustomActivityIndicator isLoading layout={"inline"} />;
    }, [loadingMore]);

    useEffect(() => {
        const signal = { cancelled: false };
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void loadFirstPage(signal);
        return () => {
            signal.cancelled = true;
        };
    }, [loadFirstPage]);

    useEffect(() => {
        return () => {
            if (searchTimer.current) clearTimeout(searchTimer.current);
        };
    }, []);

    if (error && books.length === 0) {
        return (
            <>
                {renderSearchBar()}
                <View style={styles.centerContainer}>
                    <CustomText color={"#CC3333"} style={styles.errorText}>
                        {error}
                    </CustomText>
                    <Pressable style={styles.retryButton} onPress={onRefresh}>
                        <CustomText color={"#FFFFFF"}>Retry</CustomText>
                    </Pressable>
                </View>
            </>
        );
    }

    if (loading && books.length === 0) {
        return (
            <>
                {renderSearchBar()}
                <BooksListLoading />
            </>
        );
    }

    return (
        <>
            {renderSearchBar()}

            <FlashList
                ref={listRef}
                data={books}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                contentContainerStyle={styles.contentContainer}
                numColumns={NUM_COLUMNS}
                onScroll={onScroll}
                scrollEventThrottle={16}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />

            {showScrollTop ? (
                <Pressable style={styles.scrollTopButton} onPress={scrollToTop}>
                    <ScrollToTopArrowIcon
                        width={16}
                        height={16}
                        color={"#FFFFFF"}
                    />
                    <CustomText
                        color={"#FFFFFF"}
                        fontSize={10}
                        fontFamily={"medium"}
                    >
                        to top
                    </CustomText>
                </Pressable>
            ) : null}
        </>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        paddingHorizontal: 16,
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
    centerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        gap: 16,
    },
    errorText: {
        textAlign: "center",
    },
    retryButton: {
        backgroundColor: "#6366F1",
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 8,
    },
    scrollTopButton: {
        position: "absolute",
        gap: 4,
        right: 16,
        bottom: 24,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#6366F1",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
});
