import { Response } from "express";

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    meta?: {
        total_data?: number;
        page?: number;
        limit?: number;
        total_pages?: number;
        highlighted_ips?: string[];
    };
    data?: T;
    error?: string;
}

export function successResponse<T>(res: Response, { message, meta, data }: { message: string; meta?: any; data?: T }): Response {
    const response: ApiResponse<T> = {
        success: true,
        message,
        ...(meta && { meta }),
        ...(data !== undefined && { data }),
    };

    return res.status(200).json(response);
}

export function errorResponse(res: Response, message: string, statusCode: number = 400, error?: string): Response {
    const response: ApiResponse = {
        success: false,
        message,
        ...(error && { error }),
    };

    return res.status(statusCode).json(response);
}
