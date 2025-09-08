import { WasapiClient } from '@laiyon/wasapi-sdk';
import { UserResponse } from '@laiyon/wasapi-sdk/dist/types/wasapi/models/response/user.model';

export class UserService {
	constructor(private client: WasapiClient) {}

	async getUser(): Promise<UserResponse> {
		return await this.client.user.getUser();
	}
}
