import {PaginatedDataType} from "~/services/mock/api/types";
import {ApiServiceError} from "~/services/mock/api/error";

export class BaseApiService {

    protected readonly  minLatencyMs: number
    protected readonly   maxLatencyMs: number
    protected readonly   failureRate: number

    constructor(   ) {
       this.minLatencyMs = 400
       this.maxLatencyMs = 900
       this.failureRate = 0
    }

    protected async simulateNetwork(signal?: AbortSignal): Promise<void> {
        const { minLatencyMs, maxLatencyMs, failureRate } = this;
        const latency = minLatencyMs + Math.random() * (maxLatencyMs - minLatencyMs);

        await this.delay(latency, signal);

        if (Math.random() < failureRate) {
            throw new ApiServiceError("Network request failed. Check your connection.", {
                code: "NETWORK",
            });
        }
    }

     protected paginate<T>(items: T[], page = 1, limit = 10): PaginatedDataType<T> {
        const safePage = Math.max(1, Math.floor(page));
        const safeLimit = Math.max(1, Math.floor(limit));
        const total = items.length;
        const totalPages = Math.max(1, Math.ceil(total / safeLimit));
        const start = (safePage - 1) * safeLimit;

        return {
            data: items.slice(start, start + safeLimit),
            page: safePage,
            limit: safeLimit,
            total,
            totalPages,
            hasNextPage: safePage < totalPages,
        };
    }

     private delay(ms: number, signal?: AbortSignal): Promise<void> {
        return new Promise((resolve, reject) => {
            if (signal?.aborted) {
                return reject(new ApiServiceError("Request cancelled", { code: "CANCELLED" }));
            }

            const timer = setTimeout(() => {
                signal?.removeEventListener("abort", onAbort);
                resolve();
            }, ms);

            const onAbort = () => {
                clearTimeout(timer);
                reject(new ApiServiceError("Request cancelled", { code: "CANCELLED" }));
            };

            signal?.addEventListener("abort", onAbort, { once: true });
        });
    }
}