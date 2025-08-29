import { WasapiClient } from '@laiyon/wasapi-sdk';

export class CampaignService {
	constructor(private client: WasapiClient) {}

	async getAll(): Promise<any> {
		return await this.client.campaigns.getAll();
	}

	async getById(campaign_id: string): Promise<any> {
		return await this.client.campaigns.getById(campaign_id);
	}
}
