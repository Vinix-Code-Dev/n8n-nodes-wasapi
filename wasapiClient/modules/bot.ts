import { BotStatusParams, IN8nHttpClient } from '../types';

export class BotModule {
    constructor(private client: IN8nHttpClient) {}

    async toggleStatus({ wa_id, data }: BotStatusParams): Promise<any> {
			  const response = await this.client.post(`/contacts/${wa_id}/toggle-bot`, data);
        return response.data;
    }
}
