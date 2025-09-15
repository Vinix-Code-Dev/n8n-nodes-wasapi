import { IN8nHttpClient } from '../types';

export class MetricsModule {
    constructor(private client: IN8nHttpClient) {}

    async getOnlineAgents(): Promise<any> {
			const response = await this.client.get('/dashboard/metrics/online-agents');
			return response.data;
	}
}
