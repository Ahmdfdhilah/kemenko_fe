import { ApiResponse } from "@/services/base";

// Banner Types
export interface Banner {
  banner_name: string;
  banner_image: string;
  description: string;
}

// Service Types
export interface Service {
  service_code: string;
  service_name: string;
  service_icon: string;
  service_tariff: number;
}

// API Response Types
export interface BannerResponse extends ApiResponse<Banner[]> {}

export interface ServiceResponse extends ApiResponse<Service[]> {}