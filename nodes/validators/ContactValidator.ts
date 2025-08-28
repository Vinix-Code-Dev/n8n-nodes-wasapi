import { ContactData } from '../services/ContactService.js';

export class ContactValidator {
	static validateCreateContact(data: ContactData): void {
		if (data.email && !this.isValidEmail(data.email)) {
			throw new Error('Invalid email format');
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
}
