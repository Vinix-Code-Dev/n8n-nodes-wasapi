	export interface ContactData {
		first_name: string;
		last_name: string;
		email: string;
		phone: string;
		notes: string;
		labels: number[];
		custom_fields: Record<string, unknown>;
	}

	export interface ContactExportRequest {
    email_urls?: string[];
}

export class ContactValidator {
	static validateCreateContact(data: ContactData): void {
		if (!data.first_name  && !data.phone) {
			throw new Error('First name and phone are required');
		}

		if (data.email && !this.isValidEmail(data.email)) {
			throw new Error('Invalid email format');
		}

		if (data.labels && !Array.isArray(data.labels)) {
			throw new Error('Labels must be an array');
		}
	}

	static validateCustomFields(customFieldsData: Record<string, unknown>): Record<string, unknown> {
		const custom_fields: Record<string, unknown> = {};

		if (customFieldsData && customFieldsData.custom_fields && Array.isArray(customFieldsData.custom_fields)) {
			const seen = new Set<string>();

			customFieldsData.custom_fields.forEach((field: Record<string, unknown>) => {
				if (field.field_name && field.field_value) {
					const fieldName = field.field_name as string;
					if (seen.has(fieldName)) {
						throw new Error(`The custom field "${fieldName}" is duplicated. Each field can only be defined once.`);
					}
					seen.add(fieldName);
					custom_fields[fieldName] = field.field_value;
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
