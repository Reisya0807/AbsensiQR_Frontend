import { ResponseSchema } from "@/schema/response";
import { getStatusMessage } from "./errors/error-message";

export interface APIError {
    status: number;
    message: string;
    errors?: unknown;
}

function isAPIError(value: unknown): value is APIError {
    return (
        typeof value === "object" &&
        value !== null &&
        typeof (value as APIError).status === "number" &&
        typeof (value as APIError).message === "string"
    );
}

export function getErrorMessage(err: unknown, fallback: string): string {
    if (isAPIError(err)) return err.message;
    if (err instanceof Error) return err.message;
    return fallback;
}

async function safeRequest<T>(promise: Promise<Response>): Promise<T> {
    const response = await promise;

    let body: unknown = null;
    if (response.status !== 204 && response.headers.get("content-length") !== "0") {
        try {
            body = await response.json();
        } catch {
            // non-JSON body, leave as null
        }
    }

    if (!response.ok) {
        const data = (body ?? {}) as Partial<ResponseSchema>;
        const err: APIError = {
            status: response.status,
            message: data.message ?? getStatusMessage(response.status),
            errors: data.errors,
        };
        throw err;
    }

    if (body == null) {
        return { success: true, message: "" } as T;
    }
    return body as T;
}

export default safeRequest
