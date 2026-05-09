import { UUID } from "crypto"
import { ISODateString } from "./customType"
// data endpoint Event (CRUD)
interface EventUpdate{
    name?:string|null,
    description?: string|null,
    startDate?: ISODateString|null,
    location?: string |null
    endDate?: ISODateString|null,
}
interface EventCreate extends EventUpdate{
    name:string,
    startDate: ISODateString,
    endDate: ISODateString,
}
// Read dan digabung response
interface EventData extends EventCreate{
    id: UUID,
    name: string,
    description: string,
    startDate: ISODateString,
    endDate: ISODateString,
    location: string,
    createdAt: ISODateString,
    updatedAt: ISODateString
}

export type {EventCreate, EventUpdate, EventData}