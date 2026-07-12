import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    AccessibilityInfo,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import CustomScreenContainer from "~/components/CustomScreenContainer";
import CustomText from "~/components/CustomText";
import StarRating from "~/components/StarRating";
import { Styles } from "~/styles";
import { RootStackParamList } from "~/navigation/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import StackScreenNavBar from "~/components/StackScreenNavBar";
import { lightThemeColor } from "~/styles/color";
import CustomButton from "~/components/CustomButton";
import BookmarkIcon from "~/components/svgs/BookmarkIcon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BookDetailsReviews from "~/features/books/components/BookDetailsReviews";
import { BookDataType } from "~/types/book";
import { bookApiService } from "~/services/mock/api/book";
import { ApiServiceError } from "~/services/mock/api/error";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CartTabIcon from "~/components/svgs/tab-navigation/CartTabIcon";
import CartBadge from "~/features/cart/components/CartBadge";
import { useCartStore } from "~/features/cart/store/cartStore";
import { useBookmarkStore } from "~/features/books/store/bookmarkStore";
import BookPrice from "~/features/books/components/BookPrice";

const DURATION = 400;
const FLY_DURATION = 600;

export default function BookDetails(): React.JSX.Element {
    const route = useRoute<RouteProp<RootStackParamList, "BookDetails">>();
    const book = useMemo<BookDataType>(
        () => JSON.parse(route.params.book),
        [route.params.book],
    );
    const safeAreaInsets = useSafeAreaInsets();
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const addItem = useCartStore((state) => state.addItem);
    const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
    const bookmarked = useBookmarkStore((state) =>
        Boolean(state.bookmarks[book.id]),
    );

    const [details, setDetails] = useState<BookDataType | null>(null);
    const [loadingDetails, setLoadingDetails] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [flying, setFlying] = useState<boolean>(false);

    const coverRef = useRef<View>(null);
    const cartRef = useRef<View>(null);
    const progress = useSharedValue(0);
    const start = useSharedValue({ x: 0, y: 0, width: 0, height: 0 });
    const end = useSharedValue({ x: 0, y: 0 });

    const loadDetails = useCallback(
        (signal?: AbortSignal) => {
            setLoadingDetails(true);
            setError(null);
            bookApiService
                .getBook(book.id, signal)
                .then((response) => {
                    if (signal?.aborted) return;
                    setDetails(response);
                })
                .catch((err) => {
                    if (signal?.aborted) return;
                    if (
                        err instanceof ApiServiceError &&
                        err.code === "CANCELLED"
                    )
                        return;
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to load book details.",
                    );
                })
                .finally(() => {
                    if (!signal?.aborted) setLoadingDetails(false);
                });
        },
        [book.id],
    );

    useEffect(() => {
        const controller = new AbortController();
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadDetails(controller.signal);
        return () => controller.abort();
    }, [loadDetails]);

    const handleRetry = useCallback(() => loadDetails(), [loadDetails]);

    const renderBookReviews = useCallback(() => {
        return (
            <Animated.View entering={FadeInDown.duration(DURATION).delay(280)}>
                {error ? (
                    <View style={styles.reviewsError}>
                        <CustomText color={"#CC3333"} fontSize={12}>
                            {error}
                        </CustomText>
                        <CustomButton
                            variant={"outlined"}
                            containerStyle={styles.retryButton}
                            onPress={handleRetry}
                        >
                            Retry
                        </CustomButton>
                    </View>
                ) : (
                    <BookDetailsReviews
                        reviews={details?.reviews}
                        loading={loadingDetails}
                    />
                )}
            </Animated.View>
        );
    }, [details, loadingDetails, error, handleRetry]);

    const finishFly = useCallback(() => {
        setFlying(false);
        addItem(book);
    }, [addItem, book]);

    const handleAddToCart = useCallback(async () => {
        const reduceMotion = await AccessibilityInfo.isReduceMotionEnabled();
        if (reduceMotion || !coverRef.current || !cartRef.current) {
            addItem(book);
            return;
        }
        coverRef.current.measureInWindow((cx, cy, cw, ch) => {
            cartRef.current?.measureInWindow((tx, ty, tw, th) => {
                start.value = { x: cx, y: cy, width: cw, height: ch };
                end.value = { x: tx + tw / 2, y: ty + th / 2 };
                setFlying(true);
                progress.value = 0;
                progress.value = withTiming(
                    1,
                    { duration: FLY_DURATION },
                    (finished) => {
                        if (finished) runOnJS(finishFly)();
                    },
                );
            });
        });
    }, [addItem, book, start, end, progress, finishFly]);

    const goToCart = useCallback(() => {
        navigation.navigate("Tab", { screen: "Cart" });
    }, [navigation]);

    const flyStyle = useAnimatedStyle(() => {
        const s = start.value;
        const e = end.value;
        const centerX = s.x + s.width / 2;
        const centerY = s.y + s.height / 2;
        const x = centerX + (e.x - centerX) * progress.value;
        const y = centerY + (e.y - centerY) * progress.value;
        return {
            width: s.width,
            height: s.height,
            opacity: 1 - progress.value * 0.3,
            transform: [
                { translateX: x - s.width / 2 },
                { translateY: y - s.height / 2 },
                { scale: 1 - 0.85 * progress.value },
            ],
        };
    });

    const handleBookMark = useCallback(() => {
        toggleBookmark(book);
    }, [toggleBookmark, book]);

    const content = details ?? book;

    return (
        <CustomScreenContainer>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    ref={coverRef}
                    entering={FadeIn.duration(DURATION)}
                    style={styles.coverImageWrapper}
                    sharedTransitionTag={"bookCover"}
                >
                    <Image
                        source={{ uri: book.coverUrl.full }}
                        style={styles.coverImage}
                        contentFit={"cover"}
                    />
                </Animated.View>

                <Animated.View style={[styles.body]}>
                    <Animated.View style={[styles.titleWrapper]}>
                        <Animated.View
                            entering={FadeInDown.duration(DURATION).delay(80)}
                            style={[
                                Styles.row,
                                { justifyContent: "space-between" },
                            ]}
                        >
                            <CustomText
                                fontFamily={"medium"}
                                fontSize={22}
                                style={{ flex: 1 }}
                            >
                                {content.title}
                            </CustomText>

                            <BookPrice amount={content.price} fontSize={18} />
                        </Animated.View>

                        <Animated.View
                            entering={FadeInDown.duration(DURATION).delay(140)}
                            style={[Styles.row, styles.metaRow]}
                        >
                            <CustomText
                                color={lightThemeColor.textSecondary}
                                fontSize={12}
                                fontFamily={"medium"}
                            >
                                {content.author}
                            </CustomText>
                            <View style={[styles.ratingWrapper]}>
                                <StarRating
                                    rating={content.rating}
                                    starSize={12}
                                />
                                <CustomText
                                    fontSize={10}
                                    fontFamily={"medium"}
                                    color={lightThemeColor.textSecondary}
                                >
                                    ({content.rating})
                                </CustomText>
                            </View>
                        </Animated.View>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.duration(DURATION).delay(260)}
                    >
                        <CustomText style={styles.description}>
                            {content.description}
                        </CustomText>
                    </Animated.View>

                    {renderBookReviews()}
                </Animated.View>
            </ScrollView>

            <View style={[styles.footer]}>
                <CustomButton
                    variant={"filled"}
                    containerStyle={[
                        styles.addToCartButton,
                        {
                            height: 48 + safeAreaInsets.bottom, // 48 - default button height
                        },
                    ]}
                    onPress={handleAddToCart}
                >
                    Add to cart
                </CustomButton>
                <CustomButton
                    variant={"outlined"}
                    containerStyle={[
                        styles.bookmarkButton,
                        { height: 48 + safeAreaInsets.bottom }, // 48 - default button height
                    ]}
                    onPress={handleBookMark}
                >
                    <BookmarkIcon
                        width={24}
                        height={24}
                        color={
                            bookmarked
                                ? lightThemeColor.buttonBackground
                                : "#CCCCCC"
                        }
                    />
                </CustomButton>
            </View>

            <StackScreenNavBar
                containerStyle={styles.stackScreenNavBar}
                backButtonStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                }}
                backButtonIconProps={{ color: "#FFFFFF" }}
                rightElement={
                    <Pressable
                        ref={cartRef}
                        onPress={goToCart}
                        style={[styles.cartButton]}
                    >
                        <CartTabIcon width={22} height={22} color={"#FFFFFF"} />
                        <CartBadge />
                    </Pressable>
                }
            />

            {flying ? (
                <Animated.View
                    style={[styles.flyingCover, flyStyle]}
                    pointerEvents={"none"}
                >
                    <Image
                        source={{ uri: book.coverUrl.thumbnail }}
                        style={styles.coverImage}
                        contentFit={"cover"}
                    />
                </Animated.View>
            ) : null}
        </CustomScreenContainer>
    );
}

const styles = StyleSheet.create({
    content: {
        rowGap: 12,
        paddingBottom: 24,
    },
    coverImageWrapper: {
        width: "100%",
        aspectRatio: 1,
        // borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#f2f2f2",
    },
    coverImage: {
        flex: 1,
    },
    body: {
        padding: 16,
        paddingVertical: 10,
        rowGap: 12,
    },
    metaRow: {
        justifyContent: "space-between",
        alignItems: "center",
    },
    description: {
        lineHeight: 22,
    },
    stackScreenNavBar: {
        position: "absolute",
        top: 0,
        width: "100%",
    },
    cartButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        alignItems: "center",
        justifyContent: "center",
    },
    flyingCover: {
        position: "absolute",
        left: 0,
        top: 0,
        borderRadius: 8,
        overflow: "hidden",
    },
    titleWrapper: {
        rowGap: 5,
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        columnGap: 8,
    },
    bookmarkButton: {
        flex: 0.3,
        borderTopLeftRadius: 8,
        borderRadius: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0,
    },
    addToCartButton: {
        flex: 0.8,
        borderTopRightRadius: 8,
        borderRadius: 0,
    },
    ratingWrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    reviewsError: {
        rowGap: 12,
        paddingVertical: 8,
        alignItems: "flex-start",
    },
    retryButton: {
        width: "auto",
        paddingHorizontal: 32,
    },
});
