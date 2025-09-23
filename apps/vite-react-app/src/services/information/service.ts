import { BaseService } from "@/services/base";
import {
  BannerResponse,
  ServiceResponse,
} from "./types";

export class InformationService extends BaseService {
  constructor() {
    super('');
  }

  /**
   * Get list of banners
   * GET /banner
   * Public API - No token required
   */
  async getBanners(): Promise<BannerResponse> {
    return this.get<BannerResponse>('/banner');
  }

  /**
   * Get list of services/layanan PPOB
   * GET /services
   * Private API - Requires Bearer token
   */
  async getServices(): Promise<ServiceResponse> {
    return this.get<ServiceResponse>('/services');
  }

}

// Export instance
export const informationService = new InformationService();