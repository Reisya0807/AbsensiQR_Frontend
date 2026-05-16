import { RundownCreate, RundownData, RundownUpdate } from "@/schema/rundown";
import APIService from "./APIService";

class RundownService extends APIService<RundownData[], RundownCreate, RundownUpdate> {}

export default RundownService
