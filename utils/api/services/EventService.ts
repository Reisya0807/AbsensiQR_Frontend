import { EventCreate, EventData, EventUpdate } from "@/schema/event";
import APIService, { toQueryString } from "./APIService";

class EventService extends APIService<EventData[], EventCreate, EventUpdate> {
    list(query?: Record<string, string>) {
        return this.fetchAPI(`${this.endpoint}${toQueryString(query)}`, "GET", true)
    }
}
export default EventService
