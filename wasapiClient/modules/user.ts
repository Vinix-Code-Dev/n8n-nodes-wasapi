import { IN8nHttpClient } from '../types';
export class UserModule {
    constructor(private client: IN8nHttpClient) {}

    async getUser(): Promise<any> {
        const response = await this.client.get('/user');
        return response.data;
    }
}
