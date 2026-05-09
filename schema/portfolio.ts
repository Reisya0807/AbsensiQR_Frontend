import { Url } from "url";
import { ISODateString } from "./customType";
import { UUID } from "crypto";

interface PortfolioUpdate{
    title?:string|null,
    description?: string|null,
    link?: Url | null
}

interface PortfolioCreate extends PortfolioUpdate {
    title:string,
    description: string,
    link?: Url | null
}
interface PortfolioData extends PortfolioCreate{
    pesertaId: UUID,
    createdAt: ISODateString,
    updatedAt: ISODateString
}

export type {PortfolioCreate, PortfolioUpdate, PortfolioData}
