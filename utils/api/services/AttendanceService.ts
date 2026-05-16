import { ManualAttandance, ScanAttandance } from "@/schema/request";
import APIService, { toQueryString } from "./APIService";
import { AttendanceData } from "@/schema/attendance";
import { PaginatedResult } from "@/schema/user";

class AttendanceService extends APIService<AttendanceData[]> {
    scan(payload: ScanAttandance) {
        return this.fetchAPI<AttendanceData>(`${this.endpoint}/scan`, "POST", true, payload)
    }
    manual(payload: ManualAttandance) {
        return this.fetchAPI<AttendanceData>(`${this.endpoint}/manual`, "POST", true, payload)
    }
    listMine() {
        return this.fetchAPI<AttendanceData[]>(this.endpoint, "GET", true)
    }
    listAll(query?: Record<string, string>) {
        return this.fetchAPI<PaginatedResult<AttendanceData>>(`${this.endpoint}${toQueryString(query)}`, "GET", true)
    }
}

export default AttendanceService
