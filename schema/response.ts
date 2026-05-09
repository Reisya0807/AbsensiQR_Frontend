import { ISODateString } from "./customType"

// semua respon menggunakan templat seperti ini dan data menyesuaikan endpoint
interface ResponseSchema<T=unknown> {
    success: boolean,
    message: string,
    data?: T
}

// token data response
interface TokenData{
    token: string,
    expiresAt : ISODateString,
    qrCodeImage : Base64URLString
}
export type { ResponseSchema, TokenData }