import { ResponseSchema } from "@/schema/response"
import Token from "../../auth/token"
import safeRequest from "../safeRequest"

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export function toQueryString(query?: Record<string, string | number | undefined>): string {
    if (!query) return ""
    const entries = Object.entries(query)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => [k, String(v)] as [string, string])
    if (entries.length === 0) return ""
    return "?" + new URLSearchParams(entries).toString()
}

class APIService<ResponseData = unknown, PayloadCreate extends object = object, PayloadUpdate extends object = object> {
    endpoint: string
    constructor(endpoint: string) {
        this.endpoint = endpoint
    }

    async fetchAPI<T = ResponseData>(
        api_url: string,
        method: HTTPMethod = "GET",
        auth: boolean = false,
        payload?: object
    ): Promise<ResponseSchema<T>> {
        return safeRequest<ResponseSchema<T>>(fetch(api_url, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...(auth && { "Authorization": `Bearer ${Token.getToken()}` })
            },
            ...(payload && { body: JSON.stringify(payload) })
        }))
    }

    async getAll(auth: boolean = true) {
        return this.fetchAPI<ResponseData>(`${this.endpoint}/`, "GET", auth)
    }
    async create(auth: boolean = true, payload?: PayloadCreate) {
        return this.fetchAPI<ResponseData>(`${this.endpoint}/`, "POST", auth, payload)
    }
    async get(id: string, auth: boolean = true) {
        return this.fetchAPI<ResponseData>(`${this.endpoint}/${id}`, "GET", auth)
    }
    async update(id: string, auth: boolean = true, payload?: PayloadUpdate) {
        return this.fetchAPI<ResponseData>(`${this.endpoint}/${id}`, "PUT", auth, payload)
    }
    async delete(id: string, auth: boolean = true) {
        return this.fetchAPI<ResponseData>(`${this.endpoint}/${id}`, "DELETE", auth)
    }
}

export default APIService
