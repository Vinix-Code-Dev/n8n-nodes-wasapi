import { AddLabelContact, RemoveLabelContact, WasapiClient } from '@laiyon/wasapi-sdk';
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

export interface BotStatusRequest {
    from_id: number;
    action: 'enable' | 'disable' | 'disable_permanently';
}

export interface ContactSearchParams {
    search?: string;
    labels?: number;
    page?: number;
}

export interface ContactExportRequest {
    email_urls?: string[];
}
export class ContactService {
	constructor(private client: WasapiClient) {}

	async createContact(data: ContactData): Promise<any> {
		// validate data before creating
		ContactValidator.validateCreateContact(data);

		return await this.client.contacts.create(data);
	}

	validateCustomFields(customFieldsData: any): Record<string, any> {
		return ContactValidator.validateCustomFields(customFieldsData);
	}

	async getContact(wa_id: string): Promise<any> {
		return await this.client.contacts.getById(wa_id);
	}

	async deleteContact(wa_id: string): Promise<any> {
		return await this.client.contacts.delete(wa_id);
	}

	async updateContact(wa_id: string, data: ContactData): Promise<any> {
		return await this.client.contacts.update({wa_id, data});
	}

	async toggleBotStatus(wa_id: string, data: BotStatusRequest): Promise<any> {
		return await this.client.bot.toggleStatus({wa_id, data});
	}

	async getAll(): Promise<any> {
		return await this.client.contacts.getAll();
	}

	async getSearch(params: ContactSearchParams): Promise<any> {
		return await this.client.contacts.getSearch(params);
	}

	async export(data: ContactExportRequest): Promise<any> {
		return await this.client.contacts.export(data);
	}

	async addLabel({ contact_uuid, label_id }: AddLabelContact): Promise<any> {
		return await this.client.contacts.addLabel({ contact_uuid, label_id });
	}

	async removeLabel({ contact_uuid, label_id }: RemoveLabelContact): Promise<any> {
    return await this.client.contacts.removeLabel({ contact_uuid, label_id });
	}
}
