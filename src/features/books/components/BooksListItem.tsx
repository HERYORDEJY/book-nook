import React, { useCallback } from "react";
import {
    Pressable,
    PressableProps,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";
import { BookDataType } from "~/types/book";
import CustomText from "~/components/CustomText";
import { Image } from "expo-image";
import { Styles } from "~/styles";
import StarRating from "~/components/StarRating";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "~/navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated from "react-native-reanimated";

interface Props extends PressableProps {
    item: BookDataType;
    style?: StyleProp<ViewStyle>;
}

export default function BooksListItem({
    item,
    ...props
}: Props): React.JSX.Element {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handlePress = useCallback(() => {
        navigation.navigate("BookDetails", { book: item });
    }, [item, navigation]);

    return (
        <Pressable
            style={[styles.container, props.style]}
            onPress={handlePress}
        >
            <Animated.View
                style={[styles.coverImageWrapper]}
                sharedTransitionTag={"bookCover"}
            >
                <Image
                    source={{ uri: item.coverUrl.thumbnail }}
                    style={[styles.coverImage]}
                />
            </Animated.View>

            <View style={[styles.body]}>
                <CustomText fontFamily={"medium"} numberOfLines={1}>
                    {item.title}
                </CustomText>

                <View style={[Styles.row, { justifyContent: "space-between" }]}>
                    <CustomText fontSize={10} numberOfLines={1} color={"#555"}>
                        {item.author}
                    </CustomText>
                    <CustomText
                        fontSize={10}
                        numberOfLines={1}
                        fontFamily={"medium"}
                    >
                        ₦{item.price}
                    </CustomText>
                </View>

                <View>
                    <StarRating rating={item.rating} />
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f9f9f9",
        borderRadius: 5,
        overflow: "hidden",
    },
    coverImageWrapper: {
        // height: 100,
        width: "100%",
        overflow: "hidden",
        aspectRatio: 1 / 1.2,
    },
    coverImage: {
        flex: 1,
        height: undefined,
        width: undefined,
    },
    body: {
        paddingHorizontal: 4,
        paddingBottom: 6,
        paddingTop: 2,
        rowGap: 4,
    },
});
