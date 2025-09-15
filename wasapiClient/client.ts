import { IExecuteFunctions, IHttpRequestMethods, IHttpRequestOptions } from 'n8n-workflow';
import { IN8nHttpClient } from './types';

export class N8nHttpClient implements IN8nHttpClient {
    private baseURL: string;
    private headers: Record<string, string>;

    constructor(apiKey: string, baseURL?: string, private executeFunctions?: IExecuteFunctions) {
        // Validate that API key is not empty
        if (!apiKey || apiKey.trim() === '') {
            throw new Error('WasAPI: API key is required and cannot be empty');
        }

        // Set default baseURL if not provided
        this.baseURL = baseURL || 'https://api-ws.wasapi.io/api/v1';

        // Set headers
        this.headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        };
    }

    private async makeRequest(method: string, url: string, data?: any, config?: any): Promise<any> {
        if (!this.executeFunctions) {
            throw new Error('ExecuteFunctions context is required for HTTP requests');
        }

        const requestConfig: IHttpRequestOptions = {
            method: method as IHttpRequestMethods,
            url: this.baseURL + url,
            headers: this.headers,
            timeout: 30000,
        };

        // Add query parameters if provided
        if (config?.params) {
            requestConfig.qs = config.params;
        }

        // Add body data for POST/PUT requests
        if (data && (method === 'POST' || method === 'PUT')) {
            requestConfig.body = data;
        }

        try {
            const response = await this.executeFunctions.helpers.httpRequest(requestConfig);
            return { data: response };
        } catch (error: any) {
            // Transform n8n error to axios-like error structure
            throw {
                response: {
                    data: error.message,
                    status: error.status || 500,
                },
                message: error.message,
            };
        }
    }

    public async get<T = any>(url: string, config?: any): Promise<{ data: T }> {
        return await this.makeRequest('GET', url, undefined, config);
    }

    public async post<T = any>(url: string, data?: any, config?: any): Promise<{ data: T }> {
        return await this.makeRequest('POST', url, data, config);
    }

    public async put<T = any>(url: string, data?: any, config?: any): Promise<{ data: T }> {
        return await this.makeRequest('PUT', url, data, config);
    }

    public async delete<T = any>(url: string, config?: any): Promise<{ data: T }> {
        return await this.makeRequest('DELETE', url, undefined, config);
    }

    // Method to validate connection
    public async validateConnection(): Promise<boolean> {
        try {
            await this.get('/user'); // Simple endpoint to validate
            return true;
        } catch (error) {
            return false;
        }
    }
}
