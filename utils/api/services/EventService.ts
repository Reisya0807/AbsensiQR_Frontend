import { EventCreate, EventData, EventUpdate } from "@/schema/event";
import APIService from "./APIService";

class EventService extends APIService<EventData[], EventCreate, EventUpdate> {
    list() {
        return this.fetchAPI<EventData[]>(this.endpoint, "GET", true)
    }
}
export default EventService
