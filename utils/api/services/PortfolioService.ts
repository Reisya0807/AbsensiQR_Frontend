import { PortfolioCreate, PortfolioData, PortfolioUpdate } from "@/schema/portfolio";
import APIService from "./APIService";

class PortfolioService extends APIService<PortfolioData, PortfolioCreate, PortfolioUpdate>{}

export default PortfolioService