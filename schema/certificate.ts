import { Url } from "next/dist/shared/lib/router/router"
import { ISODateString } from "./customType"
import { UUID } from "crypto"
import { EventData } from "./event"
import { Peserta } from "./user"
// data endpoint Certificate (CRUD)
enum CertificateType {
  PESERTA = "PESERTA",
  KEJUARAAN = "KEJUARAAN",
  PEMATERI = "PEMATERI",
}
interface CertificateUpdate{
    certificateNumber?: string|null,
    certificateType?: CertificateType|null,
    softFile?: Url|null,
    issuedAt?: ISODateString|null,
    eventId?: UUID|null,
}
interface CertificateCreate extends CertificateUpdate{
    certificateNumber: string,
    certificateType: CertificateType,
    softFile: Url,
    issuedAt: ISODateString
    eventId: UUID,
    pesertaId: UUID
}
interface CertificateData extends CertificateCreate{
    event:EventData
    peserta?:Peserta|null //hanya ada ketika user sekretaris
}
export type {CertificateCreate, CertificateUpdate, CertificateData}