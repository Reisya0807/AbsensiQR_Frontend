import { ISODateString } from "./customType"

// data endpoint Event (CRUD)
interface EventUpdate {
    name?: string,
    description?: string,
    startDate?: ISODateString,
    endDate?: ISODateString,
    location?: string,
}

interface EventCreate extends EventUpdate {
    name: string,
    description: string,
    startDate: ISODateString,
    endDate: ISODateString,
    location: string,
}

// Read dan digabung response
interface EventData {
    id: string,
    name: string,
    description: string,
    startDate: ISODateString,
    endDate: ISODateString,
    location: string,
    createdAt: ISODateString,
    updatedAt: ISODateString,
    _count?: { certificates: number },
}

export type { EventCreate, EventUpdate, EventData }
