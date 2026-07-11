import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { ReviewDataType } from "~/types/book";
import CustomText from "~/components/CustomText";
import StarRating from "~/components/StarRating";
import ShimmerSkeleton from "~/components/ShimmerSkeleton";

interface Props {
    reviews?: ReviewDataType[];
    loading?: boolean;
}

const NUMBER_OF_REVIEWS = 3;

export default function BookDetailsReviews(props: Props): React.JSX.Element {
    const renderReviewListItem = useCallback((review: ReviewDataType) => {
        return (
            <View key={review.id} style={[styles.reviewListItem]}>
                <View style={[styles.itemTitleWrapper]}>
                    <CustomText fontSize={11} numberOfLines={1} color={"#555"}>
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
    }, []);

    const renderReviewSkeleton = useCallback((index: number) => {
        return (
            <View key={index} style={[styles.reviewListItem]}>
                <View style={[styles.itemTitleWrapper]}>
                    <ShimmerSkeleton width={90} height={11} />
                    <ShimmerSkeleton width={60} height={11} />
                </View>
                <ShimmerSkeleton width={"90%"} height={10} />
            </View>
        );
    }, []);

    const reviews = props.reviews ?? [];

    return (
        <View style={styles.container}>
            <View>
                <CustomText fontSize={12}>
                    Reviews{" "}
                    {!props.loading && reviews.length > NUMBER_OF_REVIEWS
                        ? `(+${reviews.length - NUMBER_OF_REVIEWS})`
                        : ""}
                </CustomText>
            </View>

            <View style={[styles.reviewList]}>
                {props.loading
                    ? Array.from({ length: NUMBER_OF_REVIEWS }).map(
                          (_, index) => renderReviewSkeleton(index),
                      )
                    : reviews
                          .slice(0, NUMBER_OF_REVIEWS)
                          .map((review) => renderReviewListItem(review))}
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
        rowGap: 6,
    },
});
