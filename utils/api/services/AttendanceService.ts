import { ManualAttandance, ScanAttandance } from "@/schema/request";
import APIService from "./APIService";
import { AttendanceData } from "@/schema/attendance";

class AttendanceServices extends APIService<AttendanceData>{
    scan(payload:ScanAttandance){
        return this.fetchAPI(`${this.endpoint}/scan`, "POST", true, payload)
    }
    manual(payload:ManualAttandance){
        return this.fetchAPI(`${this.endpoint}/manual`,"POST", true, payload)
    }
}
export default AttendanceServices