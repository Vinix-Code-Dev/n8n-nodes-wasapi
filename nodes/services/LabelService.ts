import { WasapiClient } from '@laiyon/wasapi-sdk';

export interface CreateLabel {
	title: string;
	description?: string;
	color: string;
}

export interface UpdateLabel {
	id: string;
	data: CreateLabel;
}

export class LabelService {
	constructor(private client: WasapiClient) {}

	async getAll(): Promise<any> {
		const response = await this.client.labels.getAll();
		return response.labels;
	}

	async getSearch(name: string): Promise<any> {
		const response = await this.client.labels.getSearch(name);
		return response;
	}

	async getById(id: string): Promise<any> {
		const response = await this.client.labels.getById(id);
		return response;
	}

	async create(data: CreateLabel): Promise<any> {
		const response = await this.client.labels.create(data);
		return response;
	}

	async update(data: UpdateLabel): Promise<any> {
		const response = await this.client.labels.update(data);
		return response;
	}

	async delete(id: string): Promise<any> {
		const response = await this.client.labels.delete(id);
		return response;
	}
}
