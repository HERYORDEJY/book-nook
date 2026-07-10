import { BookDataType } from "~/types/book";

export type TabParamList = {
    Home: undefined;
    Cart: undefined;
};

export type RootStackParamList = {
    Tab: TabParamList;
    BookDetails: { book: BookDataType };
    Checkout: undefined;
};
