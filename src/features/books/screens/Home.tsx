import React from "react";
import BooksList from "~/features/books/components/BooksList";
import CustomScreenContainer from "~/components/CustomScreenContainer";

export default function Home(): React.JSX.Element {
    return (
        <CustomScreenContainer>
            <BooksList />
        </CustomScreenContainer>
    );
}
