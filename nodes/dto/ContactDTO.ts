import { IExecuteFunctions } from 'n8n-workflow';
import { ContactData } from '../services/ContactService';

export class ContactDTO {
	static fromExecuteFunctions(executeFunctions: IExecuteFunctions, index: number): ContactData {
		return {
			first_name: executeFunctions.getNodeParameter('first_name', index) as string,
			last_name: executeFunctions.getNodeParameter('last_name', index) as string,
			email: executeFunctions.getNodeParameter('email', index) as string,
			phone: executeFunctions.getNodeParameter('phone', index) as string,
			notes: executeFunctions.getNodeParameter('notes', index) as string,
			labels: executeFunctions.getNodeParameter('labels', index) as any[],
			custom_fields: {},
		};
	}
}
