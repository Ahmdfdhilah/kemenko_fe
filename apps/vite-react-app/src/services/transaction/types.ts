import { ApiResponse, PaginatedResponse } from "@/services/base";

// Request Types
export interface TopUpRequest {
    top_up_amount: number;
}

export interface TransactionRequest {
    service_code: string;
}

// Response Data Types
export interface Balance {
    balance: number;
}

export interface TransactionDetail {
    invoice_number: string;
    service_code: string;
    service_name: string;
    transaction_type: 'PAYMENT' | 'TOPUP';
    total_amount: number;
    created_on: string;
}

export interface TransactionHistoryRecord {
    invoice_number: string;
    transaction_type: 'PAYMENT' | 'TOPUP';
    description: string;
    total_amount: number;
    created_on: string;
}

export interface TransactionHistoryData extends PaginatedResponse<TransactionHistoryRecord> {}

// API Response Types
export interface BalanceResponse extends ApiResponse<Balance> {}

export interface TopUpResponse extends ApiResponse<Balance> {}

export interface TransactionResponse extends ApiResponse<TransactionDetail> {}

export interface TransactionHistoryResponse extends ApiResponse<TransactionHistoryData> {}