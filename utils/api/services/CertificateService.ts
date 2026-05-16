import { CertificateCreate, CertificateData, CertificateUpdate } from "@/schema/certificate";
import APIService, { toQueryString } from "./APIService";
import { PaginatedResult } from "@/schema/user";

class CertificateService extends APIService<CertificateData[], CertificateCreate, CertificateUpdate> {
    getMy() {
        return this.fetchAPI<CertificateData[]>(`${this.endpoint}/my`, "GET", true)
    }
    listAll(query?: Record<string, string>) {
        return this.fetchAPI<PaginatedResult<CertificateData>>(`${this.endpoint}${toQueryString(query)}`, "GET", true)
    }
    getByPeserta(pesertaId: string) {
        return this.fetchAPI<CertificateData[]>(`${this.endpoint}/peserta/${pesertaId}`, "GET", true)
    }
}

export default CertificateService
