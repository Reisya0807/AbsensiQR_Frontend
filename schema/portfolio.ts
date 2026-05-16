import { ISODateString } from "./customType"

interface PortfolioUpdate {
    title?: string,
    description?: string,
    link?: string | null,
}

interface PortfolioCreate extends PortfolioUpdate {
    title: string,
    description: string,
    link?: string | null,
}

interface PortfolioData {
    id: string,
    title: string,
    description: string,
    link: string | null,
    pesertaId: string,
    createdAt: ISODateString,
    updatedAt: ISODateString,
}

export type { PortfolioCreate, PortfolioUpdate, PortfolioData }
