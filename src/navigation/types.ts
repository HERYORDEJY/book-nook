export type TabParamList = {
    Home: undefined;
    Cart: undefined;
};

export type RootStackParamList = {
    Tab: TabParamList;
    BookDetails: { book: string };
    Checkout: undefined;
    TestScreen: undefined;
};

// declare global {
//     namespace ReactNavigation {
//         interface RootParamList extends RootStackParamList {}
//     }
// }
