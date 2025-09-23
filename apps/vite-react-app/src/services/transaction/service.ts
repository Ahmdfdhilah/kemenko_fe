import { BaseService } from "@/services/base";
import {
    TopUpRequest,
    TransactionRequest,
    BalanceResponse,
    TopUpResponse,
    TransactionResponse,
    TransactionHistoryResponse
} from "./types";
import { PaginationParams } from "@/services/base";

export class TransactionService extends BaseService {
    constructor() {
        super('');
    }

    /**
     * Get user balance
     * GET /balance
     * Private API - Requires Bearer token
     */
    async getBalance(): Promise<BalanceResponse> {
        return this.get<BalanceResponse>('/balance');
    }

    /**
     * Top up user balance
     * POST /topup
     * Private API - Requires Bearer token
     */
    async topUp(data: TopUpRequest): Promise<TopUpResponse> {
        return this.post<TopUpResponse>('/topup', data);
    }

    /**
     * Make transaction for services
     * POST /transaction
     * Private API - Requires Bearer token
     */
    async createTransaction(data: TransactionRequest): Promise<TransactionResponse> {
        return this.post<TransactionResponse>('/transaction', data);
    }

    /**
     * Get transaction history
     * GET /transaction/history
     * Private API - Requires Bearer token
     */
    async getTransactionHistory(params?: PaginationParams): Promise<TransactionHistoryResponse> {
        const queryParams = new URLSearchParams();
        
        if (params?.offset !== undefined) {
            queryParams.append('offset', params.offset.toString());
        }
        
        if (params?.limit !== undefined) {
            queryParams.append('limit', params.limit.toString());
        }

        const queryString = queryParams.toString();
        const endpoint = queryString ? `/transaction/history?${queryString}` : '/transaction/history';
        
        return this.get<TransactionHistoryResponse>(endpoint);
    }

    /**
     * Utility method to validate top up amount
     */
    static validateTopUpAmount(amount: number): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        if (!amount || isNaN(amount)) {
            errors.push('Amount harus berupa angka');
        } else if (amount <= 0) {
            errors.push('Amount harus lebih besar dari 0');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Utility method to validate service code
     */
    static validateServiceCode(serviceCode: string): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        if (!serviceCode || !serviceCode.trim()) {
            errors.push('Service code wajib diisi');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Utility method to validate top up request
     */
    static validateTopUpRequest(data: TopUpRequest): {
        isValid: boolean;
        errors: string[];
    } {
        return this.validateTopUpAmount(data.top_up_amount);
    }

    /**
     * Utility method to validate transaction request
     */
    static validateTransactionRequest(data: TransactionRequest): {
        isValid: boolean;
        errors: string[];
    } {
        return this.validateServiceCode(data.service_code);
    }

    /**
     * Utility method to format currency (Indonesian Rupiah)
     */
    static formatCurrency(amount: number): string {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }
}

// Export instance 
export const transactionService = new TransactionService();