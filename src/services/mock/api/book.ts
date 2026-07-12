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

        this.assertValidCheckout(payload);

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

    private assertValidCheckout(payload: CheckoutPayloadType): void {
        const { customer, items } = payload;

        if (!customer?.name?.trim()) {
            throw new ApiServiceError("Customer name is required", {
                code: "VALIDATION",
            });
        }
        if (!/^\S+@\S+\.\S+$/.test(customer?.email ?? "")) {
            throw new ApiServiceError("A valid email is required", {
                code: "VALIDATION",
            });
        }
        if (!items?.length) {
            throw new ApiServiceError("Cart is empty", { code: "VALIDATION" });
        }
        if (
            items.some((i) => i.quantity < 1 || !Number.isInteger(i.quantity))
        ) {
            throw new ApiServiceError(
                "Item quantities must be positive whole numbers",
                {
                    code: "VALIDATION",
                },
            );
        }
    }
}

// Simulated network failure rate — occasionally surfaces the loading/error/retry
// states across the app (Home list, Book Details). Set to 0 to disable.
const SIMULATED_FAILURE_RATE = 0.4;

export const bookApiService = new BookApiService();
bookApiService.setFailureRate(SIMULATED_FAILURE_RATE);
