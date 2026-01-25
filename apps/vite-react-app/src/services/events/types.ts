import { Base, PaginatedResponse, Sort } from "@/services/base";
import { FolderSummary } from "@/services/folders/types";

export type LocationType = 'offline' | 'online' | 'hybrid';

export interface Event extends Base {
    name: string;
    start_time: string;
    end_time: string;
    location_type: LocationType;
    location?: string;
    meeting_link?: string;
    pic: string[];
    event_type: string;
    description?: string;
    documentation_folder_id?: string | null;
    documentation_folder?: FolderSummary;
}

export interface EventResponsePaginated extends PaginatedResponse<Event> { }

export interface EventCreate {
    name: string;
    start_time: string;
    end_time: string;
    location_type: LocationType;
    location?: string;
    meeting_link?: string;
    pic: string[];
    event_type: string;
    description?: string;
    documentation_folder_id?: string | null;
}

export interface EventUpdate extends Partial<EventCreate> { }

export interface EventPaginatedParams {
    page: number;
    limit: number;
    search?: string | null;
    event_type?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    sort_by?: 'name' | 'start_time' | 'end_time' | 'event_type' | 'created_at' | null;
    sort_type?: Sort | null;
}
