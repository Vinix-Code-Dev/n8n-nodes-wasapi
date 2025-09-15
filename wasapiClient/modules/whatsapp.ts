import { getFileType, getTemplateFileType } from '../helpers/filetype.helper';
import { GetFlowAssets, IN8nHttpClient, SendAttachment } from '../types';
import { SendMessage, SendAttachmentParams, SendFlow, SendTemplate, ChangeStatusParams } from '../types';

export class WhatsappModule {
	constructor(private client: IN8nHttpClient) { }

	async sendMessage(data: SendMessage): Promise<any> {
		const response = await this.client.post('/whatsapp-messages', data);
		return response.data;
	}

	async sendAttachment({ from_id, wa_id, filePath, caption, filename }: SendAttachmentParams): Promise<any> {
		const fileType = getFileType(filePath);
		const payload: SendAttachment = {
			from_id: from_id,
			wa_id,
			file: fileType,
			[fileType]: filePath,
			...(caption ? { caption } : {}),
			...(filename ? { filename } : {})
		}
		const response = await this.client.post('/whatsapp-messages/attachment', payload);
		return response.data;
	}

	async sendTemplate({ recipients, template_id, contact_type, from_id, url_file, ...options }: SendTemplate): Promise<any> {
		const fileType = url_file ? getTemplateFileType(url_file) : undefined;
		const params = {
			recipients,
			template_id,
			contact_type,
			from_id: from_id,
			file: fileType,
			url_file,
			...options
		};
		const response = await this.client.post('/whatsapp-messages/send-template', params);
		return response.data;
	}

	async changeStatus({ from_id, wa_id, status, message, ...options }: ChangeStatusParams): Promise<any> {
		const params = {
			from_id: from_id,
			wa_id,
			status,
			message,
			...options
		}
		const response = await this.client.post('/whatsapp-messages/change-status', params);
		return response.data;
	}

	async getFlows(): Promise<any> {
		const response = await this.client.get('/whatsapp-flows');
		return response.data;
	}
	// return the published flows of a phone
	async getFlowsByPhoneId(from_id?: number): Promise<any> {
		const phone_id = from_id;
		const status = 'PUBLISHED';
		const flows = await this.getFlows();
		const phone = flows.data.find((phone: any) => phone.phone.id === phone_id);
		if (!phone) {
			return []
		}
		const publishedFlows = phone?.flows.data.filter((flow: any) => flow.status === status);
		return publishedFlows;
	}

	async sendFlow({ wa_id, message, phone_id, cta, screen, flow_id, action }: SendFlow): Promise<any> {
		const params = { wa_id, message, phone_id: phone_id, cta, screen, flow_id, action: action || 'navigate' }
		const response = await this.client.post('/whatsapp-flows', params);
		return response.data;

	}

	async getFlowAssets({ flow_id, phone_id }: GetFlowAssets): Promise<any> {
		const from_id = phone_id;
		const response = await this.client.post(`/whatsapp-flows/${flow_id}/assets?phone_id=${from_id}`);
		return response.data;
}
 // return the screens of a flow
async getFlowScreens({ flow_id, phone_id }: GetFlowAssets): Promise<any> {
		const assets = await this.getFlowAssets({ flow_id, phone_id });
		return assets.data.screens;
}

	async getFieldsTemplate(template_uuid: string): Promise<any> {
		const response = await this.client.get(`/make/template-fields/${template_uuid}`);
		return response.data;
	}

	async getWhatsappTemplates(): Promise<any> {
		const response = await this.client.get('/whatsapp-templates');
		return response.data;
	}

	async getAppIdByFromId(from_id: number): Promise<any> {
		const response = await this.getWhatsappNumbers();
		const foundApp = response.data.find((app: any) => app.id === from_id);
		const app_id = foundApp.app_id;
		return app_id;
	}

	async getTemplatesByAppId({ from_id }: { from_id: number }): Promise<any> {
		const app_id = await this.getAppIdByFromId(from_id);
		const templates = await this.getWhatsappTemplates();
		const templatesByPhoneId = templates.data.filter((template: any) => template.app_id === app_id);
		if (templatesByPhoneId.length === 0) {
			return [];
		}
		return templatesByPhoneId;
	}

	async getWhatsappNumbers(): Promise<any> {
		const response = await this.client.get('/whatsapp-numbers');
		return response.data;
	}
}
