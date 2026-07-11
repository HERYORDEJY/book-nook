import { create } from "zustand";
import { BookDataType } from "~/types/book";

export interface BookmarkState {
    bookmarks: Record<string, BookDataType>;
    toggleBookmark: (book: BookDataType) => void;
}

export const useBookmarkStore = create<BookmarkState>((set) => ({
    bookmarks: {},
    toggleBookmark: (book) =>
        set((state) => {
            const bookmarks = { ...state.bookmarks };
            if (bookmarks[book.id]) delete bookmarks[book.id];
            else bookmarks[book.id] = book;
            return { bookmarks };
        }),
}));
