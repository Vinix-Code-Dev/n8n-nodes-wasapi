export class TemplateValidator {
	static validateTemplate(template: unknown): void {
		if (!template) {
			throw new Error('Template is required');
		}
	}

	static validateTemplateVariables(templateVariables: Record<string, unknown>): Record<string, unknown> {
		const template_vars: Record<string, unknown> = {};

		if (templateVariables && templateVariables.template_vars && Array.isArray(templateVariables.template_vars)) {
			const seen = new Set<string>();

			templateVariables.template_vars.forEach((field: Record<string, unknown>) => {
				if (field.name && field.value) {
					const fieldName = field.name as string;
					if (seen.has(fieldName)) {
						throw new Error(`The template variable "${fieldName}" and value "${field.value as string}" is duplicated. Each variable can only be defined once.`);
					}
					seen.add(fieldName);
					template_vars[fieldName] = field.value;
				}
			});
		}

		return template_vars;
	}
}
