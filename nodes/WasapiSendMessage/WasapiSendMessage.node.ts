import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { WasapiBase } from '../WasapiBase.js';

export class WasapiSendMessage extends WasapiBase implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wasapi Send Message',
		name: 'wasapiSendMessage',
		icon: 'file:wasapi.svg',
		group: ['transform'],
		version: 1,
		description: 'Envía mensajes de WhatsApp usando Wasapi',
		defaults: {
			name: 'Wasapi Send Message',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: this.getCommonCredentials(),
		requestDefaults: {
			baseURL: this.getUrlApi(),
		},
		properties: [
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				default: '',
				required: true,
				description: 'message to send',
			},
			...this.getCommonProperties(),
		],
	};

	// 👇 Usar el método de la clase base
	methods = {
		loadOptions: {
			getWhatsappNumbers: this.getWhatsappNumbers,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return await super.executeCommon(async (client: any, item: any, i: number) => {
			const wa_id = this.getNodeParameter('wa_id', i) as string;
			const message = this.getNodeParameter('message', i) as string;
			const from_id = this.getNodeParameter('fromId', i) as string;

			return await client.whatsapp.sendMessage({
				wa_id,
				from_id,
				message,
			});
		});
	}
}
