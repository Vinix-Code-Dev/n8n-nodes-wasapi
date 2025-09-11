import { ILoadOptionsFunctions } from "n8n-workflow";
import { createClient } from "../client/createClient";
import { handleLoadOptionsError } from "../handler/LoadOptionsError.handle";
import { WhatsAppTemplateBuilder } from "../builder/whatsappTemplate";

// Cache simple to avoid multiple calls
const templateCache = new Map<string, {
	builder: WhatsAppTemplateBuilder;
	timestamp: number;
}>();

const CACHE_DURATION = 30000; // 30 segundos

async function getTemplateBuilder(this: ILoadOptionsFunctions): Promise<WhatsAppTemplateBuilder | null> {
	const client = await createClient(this);

	if (!client) {
		return null;
	}

	// get the template_id from the current parameter (resourceLocator)
	const templateIdParam = this.getNodeParameter('templateId', { mode: 'list', value: '' }) as any;
	const template_id = typeof templateIdParam === 'string' ? templateIdParam : templateIdParam?.value || '';

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
	const response = await client.whatsapp.getFieldsTemplate(template_id);

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

export async function getHeaderVariables(this: ILoadOptionsFunctions) {
	try {
		const templateBuilder = await getTemplateBuilder.call(this);

		if (!templateBuilder) {
			return [{ name: '⚠️ Please Select a Template First', value: '' }];
		}

		if (!templateBuilder.hasVariables('header_var')) {
			return [{ name: '✅ This Template Has No Header Variables', value: '' }];
		}

		return templateBuilder.getFieldsByCollection('header_var');
	} catch (error: any) {
		return handleLoadOptionsError(error);
	}
}

export async function getBodyVariables(this: ILoadOptionsFunctions) {
	try {
		const templateBuilder = await getTemplateBuilder.call(this);

		if (!templateBuilder) {
			return [{ name: '⚠️ Please Select a Template First', value: '' }];
		}

		if (!templateBuilder.hasVariables('body_vars')) {
			return [{ name: '✅ This Template Has No Body Variables', value: '' }];
		}

		return templateBuilder.getFieldsByCollection('body_vars');
	} catch (error: any) {
		return handleLoadOptionsError(error);
	}
}

export async function getCtaVariables(this: ILoadOptionsFunctions) {
	try {
		const templateBuilder = await getTemplateBuilder.call(this);

		if (!templateBuilder) {
			return [{ name: '⚠️ Please Select a Template First', value: '' }];
		}

		if (!templateBuilder.hasVariables('cta_var')) {
			return [{ name: '✅ This Template Has No CTA Variables', value: '' }];
		}

		return templateBuilder.getFieldsByCollection('cta_var');
	} catch (error: any) {
		return handleLoadOptionsError(error);
	}
}

export async function getFooterVariables(this: ILoadOptionsFunctions) {
	try {
		const templateBuilder = await getTemplateBuilder.call(this);

		if (!templateBuilder) {
			return [{ name: '⚠️ Please Select a Template First', value: '' }];
		}

		if (!templateBuilder.hasVariables('footer_vars')) {
			return [{ name: '✅ This Template Has No Footer Variables', value: '' }];
		}

		return templateBuilder.getFieldsByCollection('footer_vars');
	} catch (error: any) {
		return handleLoadOptionsError(error);
	}
}
