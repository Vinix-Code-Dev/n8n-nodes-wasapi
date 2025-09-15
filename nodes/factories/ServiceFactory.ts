import { WasapiClient } from '../../wasapiClient';
import { ContactService } from '../services/ContactService';
import { WhatsAppService } from '../services/WhatsAppService';
import { LabelService } from '../services/LabelService';
import { CustomFieldService } from '../services/CustomFieldService';
import { CampaignService } from '../services/CampaignService';
import { UserService } from '../services/UserService';
import { AgentsService } from '../services/AgentsService';

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

	static customFieldService(client: WasapiClient): CustomFieldService {
		return new CustomFieldService(client);
	}

	static campaignService(client: WasapiClient): CampaignService {
		return new CampaignService(client);
	}

	static userService(client: WasapiClient): UserService {
		return new UserService(client);
	}

	static agentsService(client: WasapiClient): AgentsService {
		return new AgentsService(client);
	}
}
