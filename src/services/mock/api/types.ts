import { CartItemType } from "~/features/cart/store/cartStore";

export interface PaginatedDataType<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
}

export type ApiErrorCodeType =
    | "NETWORK"
    | "TIMEOUT"
    | "CANCELLED"
    | "NOT_FOUND"
    | "VALIDATION"
    | "HTTP_ERROR"
    | "UNKNOWN";

export interface GetBooksParamsType {
    page?: number;
    limit?: number;
    search?: string;
    signal?: AbortSignal;
}

export interface CheckoutPayloadType {
    customer: {
        name: string;
        email: string;
    };
    items: CartItemType[];
}

export interface CheckoutResponseType {
    orderId: string;
    totalAmount: number;
    createdAt: string;
}
