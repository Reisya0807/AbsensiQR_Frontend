import { CertificateCreate, CertificateData, CertificateUpdate } from "@/schema/certificate";
import APIService from "./APIService";
import { UUID } from "crypto";

class CertificateService extends APIService<CertificateData,CertificateCreate, CertificateUpdate>{
    getMy(){
        return this.fetchAPI(`${this.endpoint}/my`,'GET',true)
    }
    getByPeserta(id:UUID){
        return this.fetchAPI(`${this.endpoint}/${id}`,'GET',true)
    }
}

export default CertificateService