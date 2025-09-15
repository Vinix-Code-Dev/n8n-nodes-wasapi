import { IN8nHttpClient } from '../types';
import { CreateCustomField, UpdateCustomField } from '../types';

export class CustomFieldsModule {
    constructor(private client: IN8nHttpClient) {}

    async getAll(): Promise<any> {
        const response = await this.client.get('/custom-fields');
        return response.data;
    }

    async create(data: CreateCustomField): Promise<any> {
        const response = await this.client.post('/custom-fields', data);
        return response.data;
    }

    async update(data: UpdateCustomField): Promise<any> {
        const response = await this.client.put(`/custom-fields/${data.id}`, data.data);
        return response.data;
    }

    async delete(id: string): Promise<any> {
        const response = await this.client.delete(`/custom-fields/${id}`);
        return response.data;
    }
}
