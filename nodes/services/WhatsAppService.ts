import { WasapiClient } from '@laiyon/wasapi-sdk';

export interface WhatsAppMessageData {
	wa_id: string;
	from_id: number;
	message: string;
}

export interface WhatsAppAttachmentData {
	wa_id: string;
	from_id: number;
	filePath: string;
	caption: string;
}

export class WhatsAppService {
	constructor(private client: WasapiClient) {}

	async sendMessage(data: WhatsAppMessageData) {
		return await this.client.whatsapp.sendMessage(data);
	}

	async sendAttachment(data: WhatsAppAttachmentData) {
		return await this.client.whatsapp.sendAttachment(data);
	}
}
