import { SendAttachmentParams, SendFlow, SendMessage, SendTemplate, WasapiClient } from '@wasapi/js-sdk';

export class WhatsAppService {
	constructor(private client: WasapiClient) {}

	async sendMessage(data: SendMessage) {
		return await this.client.whatsapp.sendMessage(data);
	}

	async sendAttachment(data: SendAttachmentParams) {
		return await this.client.whatsapp.sendAttachment(data);
	}

	async sendFlow(data: SendFlow ) {
		return await this.client.whatsapp.sendFlow(data);
	}

	async sendTemplate({ recipients, template_id, contact_type, from_id, url_file, ...options }: SendTemplate): Promise<any> {
	return await this.client.whatsapp.sendTemplate({ recipients, template_id, contact_type, from_id, url_file, ...options });
	}
}
