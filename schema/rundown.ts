import { ISODateString } from "./customType"

interface RundownUpdate {
    judul?: string,
    deskripsi?: string | null,
    waktuMulai?: ISODateString,
    waktuSelesai?: ISODateString,
    isHighlight?: boolean,
}

interface RundownCreate extends RundownUpdate {
    judul: string,
    waktuMulai: ISODateString,
    waktuSelesai: ISODateString,
}

interface RundownData {
    id: string,
    judul: string,
    deskripsi: string | null,
    waktuMulai: ISODateString,
    waktuSelesai: ISODateString,
    isHighlight: boolean,
    createdAt: ISODateString,
    updatedAt: ISODateString,
}

export type { RundownCreate, RundownUpdate, RundownData }
