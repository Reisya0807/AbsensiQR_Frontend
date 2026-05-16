import { PortfolioCreate, PortfolioData, PortfolioUpdate } from "@/schema/portfolio";
import APIService from "./APIService";

class PortfolioService extends APIService<PortfolioData[], PortfolioCreate, PortfolioUpdate> {
    listMine() {
        return this.fetchAPI<PortfolioData[]>(this.endpoint, "GET", true)
    }
    createOne(payload: PortfolioCreate) {
        return this.fetchAPI<PortfolioData>(this.endpoint, "POST", true, payload)
    }
    updateOne(id: string, payload: PortfolioUpdate) {
        return this.fetchAPI<PortfolioData>(`${this.endpoint}/${id}`, "PUT", true, payload)
    }
    deleteOne(id: string) {
        return this.fetchAPI<undefined>(`${this.endpoint}/${id}`, "DELETE", true)
    }
}

export default PortfolioService
