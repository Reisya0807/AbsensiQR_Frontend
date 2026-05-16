// data endpoint User (READ)
import { ISODateString } from "./customType";

enum Role {
  SEKRETARIS = "SEKRETARIS",
  PESERTA = "PESERTA",
}
interface Sekretaris {
    id: string,
    npm: string,
    nama: string
}
interface Peserta {
    id: string,
    npm: string,
    nama: string,
    email?: string | null,
    firstLogin?: boolean,
}

interface User {
    id: string,
    username: string,
    role: Role,
    createdAt: ISODateString,
    updatedAt: ISODateString,
    peserta?: Peserta | null,      //ada jika role PESERTA
    sekretaris?: Sekretaris | null //ada jika role SEKRETARIS
}

// User shape returned by /auth/login (different from /users/profile)
interface LoginUser {
    id: string,
    username: string,
    role: Role,
    firstLogin: boolean,
    profile: Peserta | Sekretaris | null,
}

// Data setelah hit ep login
interface LoginData {
    token: string,
    user: LoginUser
}

// Peserta list item shape returned by /peserta
interface PesertaListItem {
    userId: string,
    username: string,
    role: Role,
    createdAt: ISODateString,
    peserta: (Peserta & { totalAbsensi?: number }) | null,
    totalAbsensi: number,
}

interface PaginatedResult<T> {
    data: T[],
    pagination: {
        page: number,
        limit: number,
        total: number,
        totalPages: number,
    }
}

export { Role }
export type { Sekretaris, Peserta, User, LoginUser, LoginData, PesertaListItem, PaginatedResult }
