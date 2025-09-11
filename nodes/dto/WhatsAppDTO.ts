import { IExecuteFunctions } from 'n8n-workflow';
import { SendMessage, SendAttachmentParams, SendFlow, SendTemplate } from '@wasapi/js-sdk';
import { ChangeStatusParams } from '@wasapi/js-sdk/dist/types/wasapi/models/shared/message.model';

export class WhatsAppDTO {
	static messageFromExecuteFunctions(executeFunctions: IExecuteFunctions, index: number): SendMessage {
		return {
			wa_id: executeFunctions.getNodeParameter('wa_id', index) as string,
			from_id: executeFunctions.getNodeParameter('fromId', index) as number,
			message: executeFunctions.getNodeParameter('message', index) as string,
		};
	}

	static attachmentFromExecuteFunctions(executeFunctions: IExecuteFunctions, index: number): SendAttachmentParams {
		return {
			wa_id: executeFunctions.getNodeParameter('wa_id', index) as string,
			from_id: executeFunctions.getNodeParameter('fromId', index) as number,
			filePath: executeFunctions.getNodeParameter('filePath', index) as string,
			caption: executeFunctions.getNodeParameter('caption', index) as string,
		};
	}

	static flowFromExecuteFunctions(executeFunctions: IExecuteFunctions, index: number): SendFlow {
		const fromIdParam = executeFunctions.getNodeParameter('fromId', index);
		const phone_id = typeof fromIdParam === 'string' ? parseInt(fromIdParam, 10) : fromIdParam as number;
		const wa_id = executeFunctions.getNodeParameter('wa_id', index) as string;
		const flow_id = executeFunctions.getNodeParameter('flowId.value', index) as string;
		const message = executeFunctions.getNodeParameter('message', index) as string;
		const cta = executeFunctions.getNodeParameter('cta', index) as string;
		const screen = executeFunctions.getNodeParameter('screen.value', index) as string;
		return {
			wa_id: wa_id,
			phone_id: phone_id,
			flow_id: flow_id,
			message: message,
			cta: cta,
			screen: screen,
		};
	}

	static changeStatusFromExecuteFunctions(executeFunctions: IExecuteFunctions, index: number): ChangeStatusParams {
		return {
			wa_id: executeFunctions.getNodeParameter('wa_id', index) as string,
			from_id: executeFunctions.getNodeParameter('fromId', index) as number,
			status: executeFunctions.getNodeParameter('status', index) as 'open' | 'hold' | 'closed',
			message: executeFunctions.getNodeParameter('message', index) as string,
			agent_id: executeFunctions.getNodeParameter('agent_id.value', index) as number
		};
	}

	static sendTemplateFromExecuteFunctions(executeFunctions: IExecuteFunctions, index: number): SendTemplate {
		// get templateId correctly from the resourceLocator
		const templateIdParam = executeFunctions.getNodeParameter('templateId', index) as any;
		const template_id = typeof templateIdParam === 'string' ? templateIdParam : templateIdParam?.value || '';

		const baseData = {
			recipients: executeFunctions.getNodeParameter('recipients', index) as string,
			template_id,
			contact_type: executeFunctions.getNodeParameter('contact_type', index) as 'phone' | 'contact',
			from_id: executeFunctions.getNodeParameter('fromId', index) as number,
			url_file: executeFunctions.getNodeParameter('url_file', index) as string,
			file_name: executeFunctions.getNodeParameter('file_name', index) as string,
			chatbot_status: executeFunctions.getNodeParameter('chatbot_status', index) as 'enable' | 'disable' | 'disable_permanently',
			conversation_status: executeFunctions.getNodeParameter('conversation_status', index) as 'open' | 'hold' | 'closed' | 'unchanged',
		};

		// get dynamic variables from the template
		const dynamicVars: Record<string, any> = {};

		// process variables of each collection (fixedCollection structure)
		const headerVars = executeFunctions.getNodeParameter('header_vars', index, {}) as any;
		const bodyVars = executeFunctions.getNodeParameter('body_vars', index, {}) as any;
		const ctaVars = executeFunctions.getNodeParameter('cta_vars', index, {}) as any;
		const footerVars = executeFunctions.getNodeParameter('footer_vars', index, {}) as any;

		if (headerVars?.header_vars && Array.isArray(headerVars.header_vars)) {
			dynamicVars.header_var = headerVars.header_vars.map((varItem: any) => ({
				name: varItem.name,
				value: varItem.value
			}));
		}

		if (bodyVars?.body_vars && Array.isArray(bodyVars.body_vars)) {
			dynamicVars.body_vars = bodyVars.body_vars.map((varItem: any) => ({
				name: varItem.name,
				value: varItem.value
			}));
		}

		if (ctaVars?.cta_vars && Array.isArray(ctaVars.cta_vars)) {
			dynamicVars.cta_var = ctaVars.cta_vars.map((varItem: any) => ({
				name: varItem.name,
				value: varItem.value
			}));
		}

		if (footerVars?.footer_vars && Array.isArray(footerVars.footer_vars)) {
			dynamicVars.footer_var = footerVars.footer_vars.map((varItem: any) => ({
				name: varItem.name,
				value: varItem.value
			}));
		}

		return { ...baseData, ...dynamicVars };
	}

}
