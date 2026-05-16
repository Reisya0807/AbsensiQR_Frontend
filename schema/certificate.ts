import { ISODateString } from "./customType"
import { EventData } from "./event"
import { Peserta } from "./user"

// data endpoint Certificate (CRUD)
enum CertificateType {
    PESERTA = "PESERTA",
    KEJUARAAN = "KEJUARAAN",
    PEMATERI = "PEMATERI",
}

interface CertificateUpdate {
    certificateNumber?: string,
    certificateType?: CertificateType,
    softFile?: string,
    issuedAt?: ISODateString,
    eventId?: string,
}

interface CertificateCreate extends CertificateUpdate {
    certificateNumber: string,
    certificateType: CertificateType,
    softFile: string,
    issuedAt: ISODateString,
    eventId: string,
    pesertaId: string,
}

interface CertificateData {
    id: string,
    certificateNumber: string,
    certificateType: CertificateType,
    softFile: string,
    issuedAt: ISODateString,
    eventId: string,
    pesertaId: string,
    createdAt: ISODateString,
    updatedAt: ISODateString,
    event: EventData,
    peserta?: Pick<Peserta, "id" | "npm" | "nama"> & { email?: string | null }, //hanya ada ketika user sekretaris
}

export { CertificateType }
export type { CertificateCreate, CertificateUpdate, CertificateData }
