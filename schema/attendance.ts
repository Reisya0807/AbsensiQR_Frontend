import { ISODateString } from "./customType"
import { Peserta } from "./user"

type AttendanceStatus = 0 | 1
type ScanMethod = "QR_SCAN" | "MANUAL"

interface AttendanceData {
    id: string,
    status: AttendanceStatus,
    timestamp: ISODateString,
    method: ScanMethod,
    pesertaId: string,
    qrTokenId: string | null,
    peserta: Pick<Peserta, "id" | "npm" | "nama"> & { email?: string | null },
    createdAt?: ISODateString,
    updatedAt?: ISODateString,
}

export type { AttendanceData, AttendanceStatus, ScanMethod }
