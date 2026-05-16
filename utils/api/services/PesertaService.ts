import APIService, { toQueryString } from "./APIService";
import { PaginatedResult, PesertaListItem } from "@/schema/user";

interface PesertaDetail extends Omit<PesertaListItem, "peserta"> {
    updatedAt: string,
    peserta: (PesertaListItem["peserta"] & {
        recentAttendances?: unknown[],
    }) | null,
}

class PesertaService extends APIService<PaginatedResult<PesertaListItem>> {
    list(query?: Record<string, string>) {
        return this.fetchAPI<PaginatedResult<PesertaListItem>>(`${this.endpoint}${toQueryString(query)}`, "GET", true)
    }
    getDetail(userId: string) {
        return this.fetchAPI<PesertaDetail>(`${this.endpoint}/${userId}`, "GET", true)
    }
}

export default PesertaService
