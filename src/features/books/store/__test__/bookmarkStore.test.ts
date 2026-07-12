import { useBookmarkStore } from "~/features/books/store/bookmarkStore";
import { makeBook } from "~/test-utils/factories";

const store = () => useBookmarkStore.getState();

describe("bookmarkStore", () => {
    beforeEach(() => useBookmarkStore.setState({ bookmarks: {} }));

    it("adds a bookmark on first toggle", () => {
        const book = makeBook({ id: "a" });
        store().toggleBookmark(book);
        expect(store().bookmarks["a"]).toBeDefined();
    });

    it("removes the bookmark on the second toggle", () => {
        const book = makeBook({ id: "a" });
        store().toggleBookmark(book);
        store().toggleBookmark(book);
        expect(store().bookmarks["a"]).toBeUndefined();
    });

    it("keys bookmarks by id so there are no duplicates", () => {
        const book = makeBook({ id: "a" });
        store().toggleBookmark(book);
        store().toggleBookmark(makeBook({ id: "b" }));
        expect(Object.keys(store().bookmarks)).toHaveLength(2);

        // toggling an existing id removes it rather than duplicating
        store().toggleBookmark(book);
        expect(Object.keys(store().bookmarks)).toHaveLength(1);
    });
});
