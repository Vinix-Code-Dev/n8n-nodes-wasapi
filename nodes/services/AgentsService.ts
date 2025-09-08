import { WasapiClient } from '@laiyon/wasapi-sdk';
import { OnlineAgentsResponse } from '@laiyon/wasapi-sdk/dist/types/wasapi/models/response/metrics.model';
import { ChangeStatusParams } from '@laiyon/wasapi-sdk/dist/types/wasapi/models/shared/message.model';


export class AgentsService {
	constructor(private client: WasapiClient) {}

	async getOnlineAgents(): Promise<OnlineAgentsResponse> {
		const response = await this.client.metrics.getOnlineAgents();
		return response as OnlineAgentsResponse;
	}

	async changeStatus(params: ChangeStatusParams): Promise<any> {
		try {
			const response = await this.client.whatsapp.changeStatus(params);
			return response;
		} catch (error) {
			throw new Error('The conversation is already in the desired state.');
		}
	}
}
