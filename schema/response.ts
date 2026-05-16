import { ISODateString } from "./customType"

// semua respon menggunakan templat seperti ini dan data menyesuaikan endpoint
interface ResponseSchema<T = unknown> {
    success: boolean,
    message: string,
    data?: T,
    errors?: unknown,
}

// token data response
interface TokenData {
    token: string,
    expiresAt: ISODateString,
    qrCodeImage: string, // base64 data URL (data:image/png;base64,...)
}
export type { ResponseSchema, TokenData }
