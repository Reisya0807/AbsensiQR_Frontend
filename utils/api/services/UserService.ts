import { User } from "@/schema/user";
import APIService from "./APIService";
import { ChangePassword, ResetPassword } from "@/schema/request";

class UserService extends APIService<User|undefined>{
    getProfile(){
        return this.fetchAPI(`${this.endpoint}/profile`, 'GET', true) //ada user
    }
    changePassword(payload:ChangePassword){
        return this.fetchAPI(`${this.endpoint}/change-password`, 'PUT', true, payload)
    }
    resetPassword(payload:ResetPassword){
        return this.fetchAPI(`${this.endpoint}/change-password`, 'POST', true, payload)
    }
}

export default UserService;