import { ContactData, ContactExportRequest } from '../services/ContactService.js';

export class ContactValidator {
	static validateCreateContact(data: ContactData): void {
		if (data.email && !this.isValidEmail(data.email)) {
			throw new Error('Invalid email format');
		}

		if (data.labels && !Array.isArray(data.labels)) {
			throw new Error('Labels must be an array');
		}

		if (data.labels) {
			data.labels = data.labels.filter(label => label && typeof label === 'string' && label.trim().length > 0);
		}
	}

	static validateCustomFields(customFieldsData: any): Record<string, any> {
		let custom_fields: Record<string, any> = {};

		if (customFieldsData && customFieldsData.custom_fields && Array.isArray(customFieldsData.custom_fields)) {
			const seen = new Set<string>();

			customFieldsData.custom_fields.forEach((field: any) => {
				if (field.field_name && field.field_value) {
					if (seen.has(field.field_name)) {
						throw new Error(`The custom field "${field.field_name}" is duplicated. Each field can only be defined once.`);
					}
					seen.add(field.field_name);
					custom_fields[field.field_name] = field.field_value;
				}
			});
		}

		return custom_fields;
	}

	private static isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	static validateExportContacts(data: ContactExportRequest): void {
		if (data.email_urls && !Array.isArray(data.email_urls)) {
			throw new Error('Email URLs must be an array');
		}

		if (data.email_urls && data.email_urls.length > 5) {
			throw new Error('Maximum 5 email addresses allowed');
		}

		if (data.email_urls && data.email_urls.some(email => !this.isValidEmail(email))) {
			throw new Error('Invalid email format');
		}

		if (data.email_urls && data.email_urls.some((email: string, index: number) => data.email_urls?.indexOf(email) !== index)) {
			throw new Error('Duplicate email addresses are not allowed');
		}
	}
}
