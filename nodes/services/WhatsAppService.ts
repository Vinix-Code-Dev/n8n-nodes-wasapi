import { SendAttachmentParams, SendFlow, SendMessage, WasapiClient } from '@wasapi/js-sdk';

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
}
