import { IExecuteFunctions } from 'n8n-workflow';
import { BotStatusRequest, ContactData, ContactExportRequest, ContactSearchParams } from '../services/ContactService';

export class ContactDTO {
	static create(executeFunctions: IExecuteFunctions, index: number): ContactData {
		return {
			first_name: executeFunctions.getNodeParameter('first_name', index) as string,
			last_name: executeFunctions.getNodeParameter('last_name', index) as string,
			email: executeFunctions.getNodeParameter('email', index) as string,
			phone: executeFunctions.getNodeParameter('phone', index) as string,
			notes: executeFunctions.getNodeParameter('notes', index) as string,
			labels: executeFunctions.getNodeParameter('labels', index) as string[],
			custom_fields: {},
		};
	}

	static getById(executeFunctions: IExecuteFunctions, index: number): string {
		return executeFunctions.getNodeParameter('wa_id', index) as string;
	}

	static delete(executeFunctions: IExecuteFunctions, index: number): string {
		return executeFunctions.getNodeParameter('wa_id', index) as string;
	}

	static toggleBot(executeFunctions: IExecuteFunctions, index: number): BotStatusRequest {
		return {
			from_id: executeFunctions.getNodeParameter('fromId', index) as number,
			action: executeFunctions.getNodeParameter('action', index) as 'enable' | 'disable' | 'disable_permanently',
		};
	}

	static getSearch(executeFunctions: IExecuteFunctions, index: number): ContactSearchParams {
		return {
			search: executeFunctions.getNodeParameter('search', index) as string,
			labels: executeFunctions.getNodeParameter('labels', index) as number,
		};
	}

	static export(executeFunctions: IExecuteFunctions, index: number): ContactExportRequest{
		return {
			email_urls: executeFunctions.getNodeParameter('email_urls', index) as string[],
		};
	}
}
