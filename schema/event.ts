import { ISODateString } from "./customType"

// data endpoint Event (CRUD)
interface EventUpdate {
    nama?: string,
}

interface EventCreate extends EventUpdate {
    nama: string,
}

// Read dan digabung response
interface EventData {
    id: string,
    nama: string,
    createdAt: ISODateString,
    updatedAt: ISODateString,
    _count?: { certificates: number },
}

export type { EventCreate, EventUpdate, EventData }
