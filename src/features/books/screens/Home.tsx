import React from "react";
import { StyleSheet } from "react-native";
import BooksList from "~/features/books/components/BooksList";
import CustomScreenContainer from "~/components/CustomScreenContainer";

export default function Home(): React.JSX.Element {
    return (
        <CustomScreenContainer>
            <BooksList />
        </CustomScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
