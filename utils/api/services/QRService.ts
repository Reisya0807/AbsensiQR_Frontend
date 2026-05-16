import { TokenData } from "@/schema/response";
import APIService from "./APIService";

class QRService extends APIService<TokenData> {
    generate() {
        return this.fetchAPI<TokenData>(this.endpoint, "POST", true)
    }
}

export default QRService
