import React from "react";
import BooksList from "~/features/books/components/BooksList";
import CustomScreenContainer from "~/components/CustomScreenContainer";
import { StyleSheet, View } from "react-native";
import CustomText from "~/components/CustomText";
import { lightThemeColor } from "~/styles/color";

export default function Home(): React.JSX.Element {
    return (
        <CustomScreenContainer>
            <View style={[styles.header]}>
                <CustomText fontSize={18} fontFamily={"medium"}>
                    Welcome!
                </CustomText>
                <CustomText color={lightThemeColor.textSecondary} fontSize={16}>
                    What books are you buying today?
                </CustomText>
            </View>
            <BooksList />
        </CustomScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
});
