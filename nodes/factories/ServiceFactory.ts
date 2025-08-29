import { WasapiClient } from '@laiyon/wasapi-sdk';
import { ContactService } from '../services/ContactService';
import { WhatsAppService } from '../services/WhatsAppService';
import { LabelService } from '../services/LabelService';

export class ServiceFactory {
	static contactService(client: WasapiClient): ContactService {
		return new ContactService(client);
	}

	static whatsAppService(client: WasapiClient): WhatsAppService {
		return new WhatsAppService(client);
	}

	static labelService(client: WasapiClient): LabelService {
		return new LabelService(client);
	}
}
