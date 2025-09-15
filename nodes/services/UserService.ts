import { WasapiClient} from '../../wasapiClient';

export class UserService {
	constructor(private client: WasapiClient) {}

	async getUser(): Promise<any> {
		return await this.client.user.getUser();
	}
}
