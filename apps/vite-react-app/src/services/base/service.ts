import api from "@/utils/api";
import { toast } from "@workspace/ui/components/sonner";
import { AxiosResponse } from "axios";

export abstract class BaseService {
  protected baseEndpoint: string;

  constructor(baseEndpoint: string) {
    this.baseEndpoint = `${baseEndpoint}`;
  }

  protected async handleRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>
  ): Promise<T> {
    try {
      const response = await requestFn();
      return response.data;
    } catch (error: any) {

      let errorMessage = "Terjadi kesalahan yang tidak diketahui";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error('Gagal', {
        description: errorMessage
      })

      throw new Error(errorMessage);
    }
  }

  protected async get<T>(endpoint: string, config?: any): Promise<T> {
    return this.handleRequest(
      () => api.get(`${this.baseEndpoint}${endpoint}`, config)
    );
  }

  protected async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.handleRequest(
      () => api.post(`${this.baseEndpoint}${endpoint}`, data)
    );
  }

  protected async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.handleRequest(
      () => api.put(`${this.baseEndpoint}${endpoint}`, data)
    );
  }

  protected async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.handleRequest(
      () => api.patch(`${this.baseEndpoint}${endpoint}`, data)
    );
  }

  protected async delete<T>(endpoint: string): Promise<T> {
    return this.handleRequest(
      () => api.delete(`${this.baseEndpoint}${endpoint}`)
    );
  }

  protected buildQuery(params: Record<string, any>): string {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    });
    return query.toString() ? `?${query.toString()}` : "";
  }
}