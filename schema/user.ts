import { Timestamp } from "next/dist/server/lib/cache-handlers/types";
// data endpoint User (READ)
enum Role {
  SEKRETARIS = "SEKRETARIS",
  PESERTA = "PESERTA",
}
interface Sekretaris{
    id: string,
    npm: string,
    nama: string
}
interface Peserta{
    id: string,
    npm: string,
    nama: string,
}

interface User{
    id:string,
    username:string,
    role:Role,
    created_at: Timestamp,
    updated_at: Timestamp,
    peserta?: Peserta //ada jika role PESERTA
    sekretaris?: Sekretaris //ada jika role SEKRETARIS
}
// Data setelah hit ep login
interface LoginData{
    token:string,
    user:User
}

export type { Sekretaris, Peserta, User, Role, LoginData}