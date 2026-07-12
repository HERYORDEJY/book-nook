import React, { useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { splitNumber } from "~/utils/number-helpers";
import StarIcon from "~/components/svgs/StarIcon";

interface Props {
    rating: number;
    mode?: "display" | "write";
    onStarPress?: (ratingValue: number) => void;
    starSize?: number;
}

export default function StarRating({
    mode = "display",
    starSize = 12,
    onStarPress,
    ...props
}: Props): React.JSX.Element {
    const { decimal, whole } = splitNumber(props.rating);

    const handleSelectStar = useCallback(
        (ratingValue: number) => {
            if (mode === "display") {
                return;
            }
            onStarPress?.(ratingValue);
        },
        [mode, onStarPress],
    );

    return (
        <View style={styles.container}>
            {Array.from(
                { length: mode === "write" ? 5 : whole },
                (_, index) => index + 1,
            ).map((rating) => {
                return (
                    <Pressable
                        key={`${rating}`}
                        testID={"star"}
                        disabled={mode === "display"}
                        onPress={() => handleSelectStar(rating)}
                    >
                        <StarIcon
                            variant={"full"}
                            width={starSize}
                            height={starSize}
                        />
                    </Pressable>
                );
            })}
            {mode === "display" && decimal > 0 ? (
                <StarIcon variant={"half"} width={starSize} height={starSize} />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
});
