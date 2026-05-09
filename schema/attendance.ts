import { UUID } from "crypto"
import { ISODateString } from "./customType"
import { Peserta } from "./user"

type hadir =1|0
type scanMethod = "QR_SCAN" | "MANUAL"
interface AttendanceData {
    id: UUID,
    status: hadir
    timestamp: ISODateString,
    method: scanMethod,
    pesertaID: UUID,
    qrTokenID: UUID | null,
    peserta : Peserta
}
export type {AttendanceData}