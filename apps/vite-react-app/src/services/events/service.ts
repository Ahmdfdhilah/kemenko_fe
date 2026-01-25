import { BaseService } from "../base";
import {
    Event,
    EventCreate,
    EventUpdate,
    EventPaginatedParams,
    EventResponsePaginated,
} from "./types";

export class EventService extends BaseService {
    constructor() {
        super('/events')
    }

    /**
     * Get all events with optional filtering
     */
    async eventGetAll(params: EventPaginatedParams): Promise<EventResponsePaginated> {
        return this.get<EventResponsePaginated>(`${this.buildQuery(params)}`);
    }

    /**
     * Get event by ID
     */
    async eventGetById(id: string): Promise<Event> {
        return this.get<Event>(`/${id}`);
    }

    /**
     * Create new event
     */
    async eventCreate(data: EventCreate): Promise<{ message: string; data: Event }> {
        return this.post<{ message: string; data: Event }>('', data);
    }

    /**
     * Update event
     */
    async eventUpdate(id: string, data: EventUpdate): Promise<{ message: string; data: Event }> {
        return this.put<{ message: string; data: Event }>(`/${id}`, data);
    }

    /**
     * Delete event
     */
    async eventDelete(id: string): Promise<{ message: string }> {
        return this.delete<{ message: string }>(`/${id}`);
    }
}

export const eventService = new EventService();
