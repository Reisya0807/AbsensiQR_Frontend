import { EventCreate, EventData, EventUpdate } from "@/schema/event";
import APIService from "./APIService";

class EventService extends APIService<EventData|undefined, EventCreate, EventUpdate>{

}
export default EventService