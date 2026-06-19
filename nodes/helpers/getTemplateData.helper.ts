import { ILoadOptionsFunctions, IDataObject } from "n8n-workflow";
import { WhatsAppTemplateBuilder } from "../builder/whatsappTemplate";
import { TemplateEnum } from "../enum/template.enum";
import { API_URL } from "../config/constants";

// Cache simple to avoid multiple calls
const templateCache = new Map<string, {
	builder: WhatsAppTemplateBuilder;
	timestamp: number;
}>();

const CACHE_DURATION = 30000; // 30 seconds

async function getTemplateBuilder(this: ILoadOptionsFunctions): Promise<WhatsAppTemplateBuilder | null> {

	// get the template_id from the current parameter (resourceLocator)
	const templateIdParam = this.getNodeParameter('templateId', { mode: 'list', value: '' }) as IDataObject | string;
	const template_id = typeof templateIdParam === 'string' ? templateIdParam : (templateIdParam?.value as string) || '';

	if (!template_id) {
		return null;
	}

	// verify cache
	const cacheKey = template_id;
	const cached = templateCache.get(cacheKey);
	const now = Date.now();

	if (cached && (now - cached.timestamp) < CACHE_DURATION) {
		return cached.builder;
	}

	// make call to the API
	const response = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'wasapiApi',
		{
			method: 'GET',
			url: `${API_URL}/make/template-fields/${template_id}`,
		}
	);

	if (!response?.success || !Array.isArray(response.data)) {
		return null;
	}

	// create builder and save it in cache
	const templateBuilder = new WhatsAppTemplateBuilder(response);
	templateCache.set(cacheKey, {
		builder: templateBuilder,
		timestamp: now
	});

	return templateBuilder;
}

// Helper that returns all available template variables in one list
export async function getAllTemplateVariables(this: ILoadOptionsFunctions) {
	try {
		const templateBuilder = await getTemplateBuilder.call(this);
		if (!templateBuilder) {
			return [];
		}

		const allVariables: Array<{name: string, value: string}> = [];


		// Add header variables if available
		if (templateBuilder.hasVariables('header_var')) {
			const headerVars = templateBuilder.getFieldsByCollection('header_var');
			headerVars.forEach(variable => {
				if (variable.value && variable.value !== '') {
					allVariables.push({
						name: `[${TemplateEnum.HEADER}] ${variable.name}`, // Use value (the actual variable name)
						value: `[${TemplateEnum.HEADER}] ${variable.value}`
					});
				}
			});
		}

		// Add body variables if available
		if (templateBuilder.hasVariables('body_vars')) {
			const bodyVars = templateBuilder.getFieldsByCollection('body_vars');
			bodyVars.forEach(variable => {
				if (variable.value && variable.value !== '') {
					allVariables.push({
						name: `[${TemplateEnum.BODY}] ${variable.name}`, // Use value (the actual variable name)
						value: `[${TemplateEnum.BODY}] ${variable.value}`
					});
				}
			});
		}

		// Add CTA variables if available
		if (templateBuilder.hasVariables('cta_var')) {
			const ctaVars = templateBuilder.getFieldsByCollection('cta_var');
			ctaVars.forEach(variable => {
				if (variable.value && variable.value !== '') {
					allVariables.push({
						name: `[${TemplateEnum.BUTTON}] ${variable.name}`, // Use value (the actual variable name)
						value: `[${TemplateEnum.CTA}] ${variable.value}`,
					});
				}
			});
		}

		// Add footer variables if available
		if (templateBuilder.hasVariables('footer')) {
			const footerVars = templateBuilder.getFieldsByCollection('footer');
			footerVars.forEach(variable => {
				if (variable.value && variable.value !== '') {
					allVariables.push({
						name: `[${TemplateEnum.FOOTER}] ${variable.name}`, // Use value (the actual variable name)
						value: `[${TemplateEnum.FOOTER}] ${variable.value}`,
					});
				}
			});
		}

		if(allVariables.length === 0) {
			return [{ name: 'This Template Needs No Dynamic Variables', value: '' }];
		}

		return allVariables;
	} catch (error) {
		return [{ name: 'Error fetching template variables: ' + (error as Error).message, value: '' }];
	}
}
