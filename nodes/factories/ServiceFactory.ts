import { WasapiClient } from '@laiyon/wasapi-sdk';
import { ContactService } from '../services/ContactService';
import { WhatsAppService } from '../services/WhatsAppService';

export class ServiceFactory {
	static createContactService(client: WasapiClient): ContactService {
		return new ContactService(client);
	}

	static createWhatsAppService(client: WasapiClient): WhatsAppService {
		return new WhatsAppService(client);
	}
}
