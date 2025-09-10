import { IExecuteFunctions } from 'n8n-workflow';
import { SendMessage, SendAttachmentParams, SendFlow, SendTemplate, TemplateVariable } from '@wasapi/js-sdk';
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
		return {
			recipients: executeFunctions.getNodeParameter('recipients', index) as string,
			template_id: executeFunctions.getNodeParameter('templateId', index) as string,
			contact_type: executeFunctions.getNodeParameter('contact_type', index) as 'phone' | 'contact',
			from_id: executeFunctions.getNodeParameter('fromId', index) as number,
			url_file: executeFunctions.getNodeParameter('url_file', index) as string,
			file_name: executeFunctions.getNodeParameter('file_name', index) as string,
			body_vars: executeFunctions.getNodeParameter('body_vars', index) as TemplateVariable[],
			header_var: executeFunctions.getNodeParameter('header_var', index) as TemplateVariable[],
			cta_var: executeFunctions.getNodeParameter('cta_var', index) as TemplateVariable[],
			chatbot_status: executeFunctions.getNodeParameter('chatbot_status', index) as 'enable' | 'disable' | 'disable_permanently',
			conversation_status: executeFunctions.getNodeParameter('conversation_status', index) as 'open' | 'hold' | 'closed' | 'unchanged',
		};
	}
}
