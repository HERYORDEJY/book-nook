import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import CustomScreenContainer from "~/components/CustomScreenContainer";
import CustomText from "~/components/CustomText";
import StarRating from "~/components/StarRating";
import { Styles } from "~/styles";
import { RootStackParamList } from "~/navigation/types";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import StackScreenNavBar from "~/components/StackScreenNavBar";
import { lightThemeColor } from "~/styles/color";
import CustomButton from "~/components/CustomButton";
import BookmarkIcon from "~/components/svgs/BookmarkIcon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BookDetailsReviews from "~/features/books/components/BookDetailsReviews";
import { BookDataType } from "~/types/book";
import { bookApiService } from "~/services/mock/api/book";

const DURATION = 400;

export default function BookDetails(): React.JSX.Element {
    const route = useRoute<RouteProp<RootStackParamList, "BookDetails">>();
    const book = useMemo<BookDataType>(
        () => JSON.parse(route.params.book),
        [route.params.book],
    );
    const safeAreaInsets = useSafeAreaInsets();

    const [details, setDetails] = useState<BookDataType | null>(null);
    const [loadingDetails, setLoadingDetails] = useState<boolean>(true);

    useEffect(() => {
        const signal = { cancelled: false };
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoadingDetails(true);
        bookApiService
            .getBook(book.id)
            .then((response) => {
                if (signal.cancelled) return;
                setDetails(response);
            })
            .catch(() => {})
            .finally(() => {
                if (!signal.cancelled) setLoadingDetails(false);
            });
        return () => {
            signal.cancelled = true;
        };
    }, [book.id]);

    const renderBookReviews = useCallback(() => {
        return (
            <Animated.View entering={FadeInDown.duration(DURATION).delay(280)}>
                <BookDetailsReviews
                    reviews={details?.reviews}
                    loading={loadingDetails}
                />
            </Animated.View>
        );
    }, [details, loadingDetails]);

    const handleAddToCart = useCallback(() => {
        //
    }, []);

    const handleBookMark = useCallback(() => {
        //
    }, []);

    return (
        <CustomScreenContainer>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
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
                                {book.title}
                            </CustomText>

                            <CustomText fontFamily={"medium"} fontSize={18}>
                                ₦{book.price}
                            </CustomText>
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
                                {book.author}
                            </CustomText>
                            <View style={[styles.ratingWrapper]}>
                                <StarRating
                                    rating={book.rating}
                                    starSize={12}
                                />
                                <CustomText
                                    fontSize={10}
                                    fontFamily={"medium"}
                                    color={lightThemeColor.textSecondary}
                                >
                                    ({book.rating})
                                </CustomText>
                            </View>
                        </Animated.View>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.duration(DURATION).delay(260)}
                    >
                        <CustomText style={styles.description}>
                            {book.description}
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
                        color={lightThemeColor.buttonBackground}
                    />
                </CustomButton>
            </View>

            <StackScreenNavBar
                containerStyle={styles.stackScreenNavBar}
                backButtonStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                }}
                backButtonIconProps={{ color: "#FFFFFF" }}
            />
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
});
