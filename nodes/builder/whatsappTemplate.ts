type TemplateBuilderResponse = {
	success: boolean;
	data: TemplateBase[];
};

type TemplateBase = {
	key: string;
	type: string;
	label: string;
	spec: specBase[];
};

type specBase = {
	type: "text" | "html" | "url";
	label: string;
	name?: string;
	help?: string;
	required?: boolean;
};

export class WhatsAppTemplateBuilder {
	private template: TemplateBase[];

	constructor(payload: TemplateBuilderResponse) {
			this.template = payload.data;
	}

	getTemplate(): TemplateBase[] {
			return this.template;
	}

	/**
	 * Get the collections available for dropdowns in n8n
	 * Only return collections that have variables
	 */
	getCollectionsForDropdown(): Array<{name: string, value: string}> {
		const options: Array<{name: string, value: string}> = [
			{ name: '-- Select a Collection --', value: '' },
		];

		this.template.forEach((template) => {
			// Only show collections that have variables
			const hasVariables = template.spec.some((spec) => spec.type !== 'html');

			if (hasVariables) {
				options.push({
					name: `${template.label} (${template.key})`,
					value: template.key,
				});
			}
		});

		return options;
	}

	/**
	 * Get the fields available for dropdowns in n8n
	 * Only return fields that are not HTML (that are informational)
	 */
	getFieldsForDropdown(): Array<{name: string, value: string}> {
		const options: Array<{name: string, value: string}> = [
			{ name: '-- Select a Field --', value: '' },
		];

		this.template.forEach((template) => {
			template.spec.forEach((spec) => {
				// Only show fields that are not HTML (that are only informational)
				if (spec.type !== 'html') {
					options.push({
						name: `${spec.label} (${spec.type}) - ${template.label}`,
						value: spec.name || spec.label,
					});
				}
			});
		});

		return options;
	}

	/**
	 * Get the fields of a specific collection
	 */
	getFieldsByCollection(collectionKey: string): Array<{name: string, value: string}> {
		const options: Array<{name: string, value: string}> = [
			{ name: '-- Select a Field --', value: '' },
		];

		const collection = this.template.find(t => t.key === collectionKey);
		if (collection) {
			collection.spec.forEach((spec) => {
				if (spec.type !== 'html') {
					const fieldValue = spec.name || spec.label;
					// Escape variables with curly braces to prevent n8n from treating them as expressions
					const escapedValue = fieldValue.includes('{{') && fieldValue.includes('}}')
						? `VAR_${fieldValue.replace(/[{}]/g, '')}`
						: fieldValue;

					options.push({
						name: `${spec.label} (${spec.type})` as string,
						value: escapedValue as string,
					});
				}
			});
		}

		return options;
	}

	/**
	 * Verify if a collection has variables
	 */
	hasVariables(collectionKey: string): boolean {
		const collection = this.template.find(t => t.key === collectionKey);
		if (!collection) return false;

		return collection.spec.some((spec) => spec.type !== 'html');
	}

	/**
	 * Get the hint/preview HTML of a collection
	 */
	getCollectionHint(collectionKey: string): string {
		const collection = this.template.find(t => t.key === collectionKey);
		if (!collection) return '';

		const htmlSpec = collection.spec.find((spec) => spec.type === 'html');
		return htmlSpec?.label || '';
	}


}
