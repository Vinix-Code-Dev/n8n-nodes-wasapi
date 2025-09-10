import { WasapiClient } from '@wasapi/js-sdk';
import { UserResponse } from '@wasapi/js-sdk/dist/types/wasapi/models/response/user.model';

export class UserService {
	constructor(private client: WasapiClient) {}

	async getUser(): Promise<UserResponse> {
		return await this.client.user.getUser();
	}
}
