import { WasapiClient } from '@laiyon/wasapi-sdk';

export interface CreateCustomField {
	name: string;
}

export interface UpdateCustomField {
	id: string;
	data: CreateCustomField;
}

export class CustomFieldService {
	constructor(private client: WasapiClient) {}

	async getAll(): Promise<any> {
		const response = await this.client.customFields.getAll();
		return response;
	}
	async create(data: CreateCustomField): Promise<any> {
		const response = await this.client.customFields.create(data);
		return response;
	}

	async update(data: UpdateCustomField): Promise<any> {
		const response = await this.client.customFields.update(data);
		return response;
	}

	async delete(id: string): Promise<any> {
		const response = await this.client.customFields.delete(id);
		return response;
	}
}
