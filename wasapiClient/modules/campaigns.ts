import { IN8nHttpClient } from '../types';

export class CampaignsModule {
    constructor(private client: IN8nHttpClient) {}

    async getAll(): Promise<any> {
			const response = await this.client.get('/campaigns');
			return response.data;
	}

	// GET https://api-ws.wasapi.io/api/v1/campaigns/{campaign_uuid} consulta una campaña por su uuid (campaign_uuid)
	async getById(campaign_uuid: string): Promise<any> {
			const response = await this.client.get(`/campaigns/${campaign_uuid}`);
			return response.data;
	}
}
