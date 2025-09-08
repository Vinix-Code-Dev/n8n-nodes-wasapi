import { WasapiClient } from '@laiyon/wasapi-sdk';
import { OnlineAgentsResponse } from '@laiyon/wasapi-sdk/dist/types/wasapi/models/response/metrics.model';


export class AgentsService {
	constructor(private client: WasapiClient) {}

	async getOnlineAgents(): Promise<OnlineAgentsResponse> {
		const response = await this.client.metrics.getOnlineAgents();
		return response as OnlineAgentsResponse;
	}
}
