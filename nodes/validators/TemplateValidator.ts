export class TemplateValidator {
	static validateTemplate(template: any): void {
		if (!template) {
			throw new Error('Template is required');
		}
	}

	static validateTemplateVariables(templateVariables: any): Record<string, any> {
		let template_vars: Record<string, any> = {};

		if (templateVariables && templateVariables.template_vars && Array.isArray(templateVariables.template_vars)) {
			const seen = new Set<string>();

			templateVariables.template_vars.forEach((field: any) => {
				if (field.name && field.value) {
					if (seen.has(field.name)) {
						throw new Error(`The template variable "${field.name}" is duplicated. Each variable can only be defined once.`);
					}
					seen.add(field.name);
					template_vars[field.name] = field.value;
				}
			});
		}

		return template_vars;
	}
}
