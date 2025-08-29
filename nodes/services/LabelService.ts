import { WasapiClient } from '@laiyon/wasapi-sdk';


export class LabelService {
	constructor(private client: WasapiClient) {}

	async getAll(): Promise<any> {
		const response = await this.client.labels.getAll();
		return response.labels;
	}
}
