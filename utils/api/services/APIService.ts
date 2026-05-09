import { ResponseSchema } from "@/schema/response"
import Token from "../../auth/token"
import safeRequest from "../safeRequest"
import { UUID } from "crypto"

class APIService<ResponseData=unknown, PayloadCreate extends object=object, PayloadUpdate extends object=object>{
    endpoint:string
    constructor(endpoint:string){
        this.endpoint = endpoint
    }
    async fetchAPI(
        api_url:string, 
        method:string="GET", 
        auth:boolean=false, 
        payload?:object
    ){
        return safeRequest<ResponseSchema<ResponseData>>(fetch(api_url,{
            method,
            headers:{
                'Content-Type': 'application/json',
                ...(auth&& {'Authorization': `Bearer ${Token.getToken()}`})
            },
            ...(payload && {body: JSON.stringify(payload)})
        })) 
    }
    async getAll(auth:boolean){
        return this.fetchAPI(`${this.endpoint}/`,"GET", auth)
    }
    async create(auth:boolean, payload?:PayloadCreate){
        return this.fetchAPI(`${this.endpoint}/`, "POST",auth,payload)
    }
    async get(id:UUID, auth:boolean){
        return this.fetchAPI(`${this.endpoint}/${id}`,"GET",auth)
    }
    async update(id:UUID, auth:boolean, payload?:PayloadUpdate){
        return this.fetchAPI(`${this.endpoint}/${id}`, "PUT",auth, payload)
    }
    async delete(id:UUID, auth:boolean){
        return this.fetchAPI(`${this.endpoint}/${id}`, "DELETE",auth)
    }
}

export default APIService