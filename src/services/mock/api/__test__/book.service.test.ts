import { bookApiService } from "~/services/mock/api/book";
import { ApiServiceError } from "~/services/mock/api/error";

describe("bookApiService", () => {
    beforeEach(() => {
        // Deterministic: no simulated network failures unless a test opts in.
        bookApiService.setFailureRate(0);
    });

    describe("getBooks", () => {
        it("returns a well-formed paginated response", async () => {
            const res = await bookApiService.getBooks({ page: 1, limit: 5 });

            expect(res.page).toBe(1);
            expect(res.limit).toBe(5);
            expect(res.data).toHaveLength(5);
            expect(res.total).toBeGreaterThan(5);
            expect(res.totalPages).toBe(Math.ceil(res.total / 5));
            expect(res.hasNextPage).toBe(true);
        });

        it("returns a different page of results for a different page number", async () => {
            const page1 = await bookApiService.getBooks({ page: 1, limit: 5 });
            const page2 = await bookApiService.getBooks({ page: 2, limit: 5 });

            expect(page2.page).toBe(2);
            expect(page1.data[0].id).not.toBe(page2.data[0].id);
        });

        it("filters by search query (case-insensitive)", async () => {
            const query = "kingdom silence";
            const res = await bookApiService.getBooks({ search: query });

            expect(res.total).toBeGreaterThan(0);
            res.data.forEach((book) => {
                const haystack = `${book.title} ${book.author}`.toLowerCase();
                expect(haystack).toContain(query);
            });
        });

        it("returns an empty result set when nothing matches the search", async () => {
            const res = await bookApiService.getBooks({
                search: "zzz-no-such-title-xyz",
            });

            expect(res.total).toBe(0);
            expect(res.data).toHaveLength(0);
            expect(res.hasNextPage).toBe(false);
        });
    });

    describe("getBook", () => {
        it("returns the matching book for a valid id", async () => {
            const book = await bookApiService.getBook("bk-0001");

            expect(book.id).toBe("bk-0001");
            expect(book.title).toBe("Kingdom Silence");
        });

        it("throws a NOT_FOUND ApiServiceError for an unknown id", async () => {
            await expect(
                bookApiService.getBook("does-not-exist"),
            ).rejects.toBeInstanceOf(ApiServiceError);
            await expect(
                bookApiService.getBook("does-not-exist"),
            ).rejects.toMatchObject({ code: "NOT_FOUND" });
        });
    });

    describe("network failure simulation", () => {
        it("rejects getBooks with a NETWORK error when the network fails", async () => {
            bookApiService.setFailureRate(1);
            await expect(bookApiService.getBooks()).rejects.toMatchObject({
                code: "NETWORK",
            });
        });

        it("rejects getBook with a NETWORK error when the network fails", async () => {
            bookApiService.setFailureRate(1);
            await expect(
                bookApiService.getBook("bk-0001"),
            ).rejects.toMatchObject({ code: "NETWORK" });
        });
    });
});
