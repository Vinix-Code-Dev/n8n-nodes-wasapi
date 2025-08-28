import { WasapiClient } from '@laiyon/wasapi-sdk';
import { ContactValidator } from '../validators/ContactValidator.js';

export interface ContactData {
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	notes: string;
	labels: any[];
	custom_fields: Record<string, any>;
}

export class ContactService {
	constructor(private client: WasapiClient) {}

	async createContact(data: ContactData): Promise<any> {
		// Validar datos antes de crear
		ContactValidator.validateCreateContact(data);
		
		return await this.client.contacts.create(data);
	}

	validateCustomFields(customFieldsData: any): Record<string, any> {
		return ContactValidator.validateCustomFields(customFieldsData);
	}

	async getContact(wa_id: string): Promise<any> {
		return await this.client.contacts.getById(wa_id);
	}
}
