import { BaseApiService } from "~/services/mock/api/index";
import BOOKS_DATA from "~/services/mock/books.json";
import {
    CheckoutPayloadType,
    CheckoutResponseType,
    GetBooksParamsType,
    PaginatedDataType,
} from "~/services/mock/api/types";
import { BookDataType } from "~/types/book";
import { ApiServiceError } from "~/services/mock/api/error";

class BookApiService extends BaseApiService {
    async getBooks(
        params: GetBooksParamsType = {},
    ): Promise<PaginatedDataType<BookDataType>> {
        const { page = 1, limit = 10, search, signal } = params;

        await this.simulateNetwork(signal);

        const query = search?.trim().toLowerCase();
        const filtered = query
            ? BOOKS_DATA.filter(
                  (book) =>
                      book.title.toLowerCase().includes(query) ||
                      book.author.toLowerCase().includes(query),
              )
            : BOOKS_DATA;

        return this.paginate(filtered, page, limit);
    }

    async getBook(id: string, signal?: AbortSignal): Promise<BookDataType> {
        await this.simulateNetwork(signal);

        const book = BOOKS_DATA.find((b) => b.id === id);
        if (!book) {
            throw new ApiServiceError(`Book "${id}" not found`, {
                code: "NOT_FOUND",
                status: 404,
            });
        }
        return book;
    }

    async checkout(
        payload: CheckoutPayloadType,
        signal?: AbortSignal,
    ): Promise<CheckoutResponseType> {
        await this.simulateNetwork(signal);

        const totalAmount = payload.items.reduce(
            (sum, item) => sum + item.book.price * item.quantity,
            0,
        );

        return {
            orderId: `BN-${Date.now().toString(36).toUpperCase()}`,
            totalAmount,
            createdAt: new Date().toISOString(),
        };
    }
}

export const bookApiService = new BookApiService();
