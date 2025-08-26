import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { WasapiBaseWithFromId } from '../WasapiBaseWithFromId';

export class WasapiSendAttachment extends WasapiBaseWithFromId implements INodeType {
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
		credentials: [
			{
				name: 'wasapiApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api-ws.wasapi.io/api/v1',
		},
		properties: [
			{
				displayName: 'WhatsApp ID',
				name: 'wa_id',
				type: 'string',
				default: '',
				required: true,
				description: 'ID de WhatsApp del destinatario',
			},
			{
				displayName: 'File Path',
				name: 'filePath',
				type: 'string',
				default: '',
				required: true,
				description: 'URL o ruta del archivo a enviar',
			},
			{
				displayName: 'Caption',
				name: 'caption',
				type: 'string',
				default: '',
				required: false,
				description: 'Descripción del archivo (opcional)',
			},
			{
				displayName: 'Filename',
				name: 'filename',
				type: 'string',
				default: '',
				required: false,
				description: 'Nombre del archivo (opcional)',
			},
			{
				displayName: 'From ID',
				name: 'fromId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getWhatsappNumbers',
				},
				default: '',
				required: false,
				description: 'ID del número de WhatsApp desde el cual enviar (opcional, usa el de las credenciales si no se especifica)',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: any[] = [];

		// Obtener credenciales
		const credentials = await this.getCredentials('wasapiApi');
		const apiKey = credentials.apiKey as string;
		const credentialsFromId = credentials.fromId as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const wa_id = this.getNodeParameter('wa_id', i) as string;
				const filePath = this.getNodeParameter('filePath', i) as string;
				const caption = this.getNodeParameter('caption', i) as string;
				const filename = this.getNodeParameter('filename', i) as string;
				const nodeFromId = this.getNodeParameter('fromId', i) as string;
				
				// Configurar cliente usando la clase base
				const client = await super.configureClientWithFromId(apiKey, credentialsFromId, nodeFromId);

				const result = await client.whatsapp.sendAttachment({
					wa_id,
					filePath,
					caption,
					filename,
				});

				returnData.push(result);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.message });
					continue;
				}
				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
