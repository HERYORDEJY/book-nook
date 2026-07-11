import { BookDataType } from "~/types/book";

export type TabParamList = {
    Home: undefined;
    Cart: undefined;
};

export type RootStackParamList = {
    Tab: TabParamList;
    BookDetails: { book: BookDataType };
    Checkout: undefined;
    TestScreen: undefined;
};

// declare global {
//     namespace ReactNavigation {
//         interface RootParamList extends RootStackParamList {}
//     }
// }
