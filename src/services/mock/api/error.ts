import {ApiErrorCodeType} from "~/services/mock/api/types";

export class ApiServiceError extends Error {
    readonly code: ApiErrorCodeType;
    readonly status?: number;

    constructor(message: string, opts: { code?: ApiErrorCodeType; status?: number } = {}) {
        super(message);
        this.name = "ApiError";
        this.code = opts.code ?? "UNKNOWN";
        this.status = opts.status;
    }

    /** Errors the user can sensibly retry (drives the Retry button). */
    get isRetryable(): boolean {
        return this.code === "NETWORK" || this.code === "TIMEOUT" || this.code === "HTTP_ERROR";
    }
}