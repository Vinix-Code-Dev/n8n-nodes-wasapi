import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { WasapiBase } from '../WasapiBase.js';

export class WasapiSendAttachment extends WasapiBase implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wasapi Send Attachment',
		name: 'wasapiSendAttachment',
		icon: 'file:wasapi.svg',
		group: ['transform'],
		version: 1,
		description: 'Envía archivos adjuntos de WhatsApp usando Wasapi',
		defaults: {
			name: 'Wasapi Send Attachment',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: this.getCommonCredentials(),
		requestDefaults: {
			baseURL: this.getUrlApi(),
		},
		properties: [
			{
				displayName: 'File Path',
				name: 'filePath',
				type: 'string',
				default: '',
				required: true,
				description: 'URL or path of the file to send',
			},
			{
				displayName: 'Caption',
				name: 'caption',
				type: 'string',
				default: '',
				required: false,
				description: 'description of the file (optional)',
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
			const filePath = this.getNodeParameter('filePath', i) as string;
			const caption = this.getNodeParameter('caption', i) as string;
			const from_id = this.getNodeParameter('fromId', i) as string;

			return await client.whatsapp.sendAttachment({
				wa_id,
				filePath,
				caption,
				from_id,
			});
		});
	}
}
