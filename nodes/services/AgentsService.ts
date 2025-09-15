import { WasapiClient, ChangeStatusParams } from '../../wasapiClient';


export class AgentsService {
	constructor(private client: WasapiClient) {}

	async getOnlineAgents(): Promise<any> {
		const response = await this.client.metrics.getOnlineAgents();
		return response;
	}

	async changeStatus(params: ChangeStatusParams): Promise<any> {
		try {
			const response = await this.client.whatsapp.changeStatus(params);
			return response;
		} catch (error) {
			throw new Error(error as string);
		}
	}
}
