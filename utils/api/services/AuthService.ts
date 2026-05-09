import { LoginData } from "@/schema/user";
import { getStatusMessage } from "../errors/error-message";
import APIService from "./APIService";

class AuthService extends APIService<LoginData>{
    async login(payload: Record<"username" | "password", string>){
        const {data, error} = await this.fetchAPI(`${this.endpoint}/login`, 'POST', false, payload);
        const detail = {
            data,
            error:false,
            message: 'Berhasil Login'
        }
        if(error){
            detail.error = true
            detail.message = getStatusMessage(error.status,
                {
                    404: "Username/Password salah",
                    400: "Kesalahan input"
                }
            )
        }
        return detail
    }
}

export default AuthService