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
enum keyTemplate {
	header_var = "header_var",
	body_vars = "body_vars",
	cta_var = "cta_var",
	footer_var = "footer_var",
}

enum typeSpec {
	text = "text",
	html = "html",
	url = "url",
}
type N8nProperty = {
	displayName: string;
	name: string;
	type: string;
	default: string | string[];
	description?: string;
	hint?: string;
	required?: boolean;
	options?: N8nProperty[];
};

export class WhatsAppTemplateBuilder {
	private template: TemplateBase[];
	private inputs: Record<string, string[]> = {};
	private n8nProperties: N8nProperty[] = [];

	constructor(payload: TemplateBuilderResponse) {
			this.template = payload.data;
			this.processPayload(payload.data);
	}

	private processPayload(templateData: TemplateBase[]): void {
			templateData.forEach((template) => {
					switch (template.key) {
							case keyTemplate.header_var:
									this.processHeaderVar(template);
									break;
							case keyTemplate.body_vars:
									this.processBodyVars(template);
									break;
							case keyTemplate.cta_var:
									this.processCtaVar(template);
									break;
							case keyTemplate.footer_var:
									this.processFooterVar(template);
									break;
					}
			});
	}

	private processHeaderVar(template: TemplateBase): void {
			const hint = this.getHint(template);
			this.processVariableSection(template, "header", "Header Variables", "Variables for the header", hint);
	}

	private processBodyVars(template: TemplateBase): void {
			const hint = this.getHint(template);
			this.processVariableSection(template, "body", "Body Variables", "Variables for the message body", hint);
	}

	private processCtaVar(template: TemplateBase): void {
			const hint = this.getHint(template);
			this.processVariableSection(template, "cta", "CTA Variables", "Variables for the CTA buttons", hint);
	}
	private processFooterVar(template: TemplateBase): void {
			const hint = this.getHint(template);
			this.processVariableSection(template, "footer", "Footer Variables", "Variables for the footer", hint);
	}

	private getHint(template: TemplateBase): string {
			return template.spec.find((spec) => spec.type === typeSpec.html)?.label || "";
	}
	/**
	 * Método común para procesar cualquier sección de variables (header, body, cta)
	 */
	private processVariableSection(
			template: TemplateBase,
			sectionType: string,
			displayName: string,
			description: string,
			hint?: string
	): void {
			const variableSpecs = template.spec.filter((spec) => spec.type !== typeSpec.html);
			const variables: N8nProperty[] = [];

			if (variableSpecs.length > 0) {
					variableSpecs.forEach((spec, index) => {
							const propertyName = `${sectionType}_var_${index + 1}`;

							if (spec.type === typeSpec.text) {
									variables.push({
											displayName: `${this.capitalizeFirst(sectionType)} ${index + 1} Variable`,
											name: propertyName,
											type: "string",
											default: "",
											description: spec.help || spec.label,
											required: spec.required || false,
									});
							}

							if (spec.type === typeSpec.url) {
									variables.push({
											displayName: spec.label,
											name: spec.name || propertyName,
											type: "string",
											hint: spec.label,
											default: "",
											description: spec.help,
											required: spec.required || false,
									});
							}

							if (spec.type === typeSpec.html) {
									variables.push({
											displayName: spec.label,
											name: spec.name || propertyName,
											type: "string",
											default: "",
											description: spec.help || spec.label,
											required: spec.required || false,
									});
							}
					});

					// Crear la colección con las variables
					const collectionProperty: N8nProperty = {
							displayName,
							name: `${sectionType}_vars`,
							type: "collection",
							default: []	,
							description,
							options: variables,
					};

					// Agregar hint si está disponible (principalmente para body)
					if (hint) {
							collectionProperty.hint = hint;
					}

					this.n8nProperties.push(collectionProperty);
			} else {
					this.n8nProperties.push({
							displayName: hint || "",
							name: `${sectionType}_notice`,
							type: "notice",
							default: ""
					});
			}
	}

	/**
	 * Capitaliza la primera letra de una cadena
	 */
	private capitalizeFirst(str: string): string {
			return str.charAt(0).toUpperCase() + str.slice(1);
	}

	build(): TemplateBase[] {
			return this.template;
	}

	getTemplate(): TemplateBase[] {
			return this.template;
	}

	getInputs(): Record<string, string[]> {
			return this.inputs;
	}

	getProperties(): N8nProperty[] {
			return this.n8nProperties;
	}

	getN8nProperties(): N8nProperty[] {
			return this.n8nProperties;
	}
}
