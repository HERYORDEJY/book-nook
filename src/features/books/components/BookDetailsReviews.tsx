import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { BookDataType } from "~/types/book";
import CustomText from "~/components/CustomText";
import StarRating from "~/components/StarRating";

interface Props {
    book: BookDataType;
}

const NUMBER_OF_REVIEWS = 3;

export default function BookDetailsReviews(props: Props): React.JSX.Element {
    const renderReviewListItem = useCallback(
        (review: BookDataType["reviews"][number], index: number) => {
            return (
                <View key={review.id} style={[styles.reviewListItem]}>
                    <View style={[styles.itemTitleWrapper]}>
                        <CustomText
                            fontSize={11}
                            numberOfLines={1}
                            color={"#555"}
                        >
                            @{review.author}
                        </CustomText>
                        <StarRating rating={review.rating} />
                    </View>
                    <CustomText
                        fontSize={10}
                        numberOfLines={1}
                        color={"#555"}
                        fontFamily={"medium"}
                    >
                        {review.comment}
                    </CustomText>
                </View>
            );
        },
        [],
    );

    return (
        <View style={styles.container}>
            <View>
                <CustomText fontSize={12}>
                    Reviews{" "}
                    {props.book.reviews?.length > NUMBER_OF_REVIEWS
                        ? `(+${props.book.reviews.length - NUMBER_OF_REVIEWS})`
                        : ""}
                </CustomText>
            </View>

            <View style={[styles.reviewList]}>
                {props.book.reviews
                    .slice(0, NUMBER_OF_REVIEWS)
                    .map((review, index) =>
                        renderReviewListItem(review, index),
                    )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 0.5,
        borderColor: "#CCCCCC",
        paddingTop: 10,
        rowGap: 8,
        paddingLeft: 12,
    },
    itemTitleWrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    reviewList: {
        rowGap: 8,
    },
    reviewListItem: {
        borderBottomWidth: 0.4,
        paddingBottom: 8,
        borderColor: "#CCCCCC",
    },
});
