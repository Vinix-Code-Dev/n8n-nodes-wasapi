import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { WasapiBaseWithFromId } from '../WasapiBaseWithFromId';

export class WasapiSendTemplate extends WasapiBaseWithFromId implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wasapi Send Template',
		name: 'wasapiSendTemplate',
		icon: 'file:wasapi.svg',
		group: ['transform'],
		version: 1,
		description: 'Envía templates de WhatsApp usando Wasapi',
		defaults: {
			name: 'Wasapi Send Template',
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
				displayName: 'Template ID',
				name: 'template_id',
				type: 'string',
				default: '',
				required: true,
				description: 'ID del template a enviar',
			},
			{
				displayName: 'Recipients',
				name: 'recipients',
				type: 'string',
				default: '',
				required: true,
				description: 'Destinatarios del template (separados por coma)',
			},
			{
				displayName: 'Contact Type',
				name: 'contact_type',
				type: 'options',
				options: [
					{
						name: 'Phone',
						value: 'phone',
					},
					{
						name: 'Contact',
						value: 'contact',
					},
				],
				default: 'phone',
				description: 'Tipo de contacto',
			},
			{
				displayName: 'Chatbot Status',
				name: 'chatbot_status',
				type: 'options',
				options: [
					{
						name: 'Enable',
						value: 'enable',
					},
					{
						name: 'Disable',
						value: 'disable',
					},
				],
				default: 'enable',
				description: 'Estado del chatbot',
			},
			{
				displayName: 'Conversation Status',
				name: 'conversation_status',
				type: 'options',
				options: [
					{
						name: 'Unchanged',
						value: 'unchanged',
					},
					{
						name: 'Open',
						value: 'open',
					},
					{
						name: 'Hold',
						value: 'hold',
					},
					{
						name: 'Closed',
						value: 'closed',
					},
				],
				default: 'unchanged',
				description: 'Estado de la conversación',
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
				const template_id = this.getNodeParameter('template_id', i) as string;
				const recipients = this.getNodeParameter('recipients', i) as string;
				const contact_type = this.getNodeParameter('contact_type', i) as string;
				const chatbot_status = this.getNodeParameter('chatbot_status', i) as string;
				const conversation_status = this.getNodeParameter('conversation_status', i) as string;
				const nodeFromId = this.getNodeParameter('fromId', i) as string;
				
				// Configurar cliente usando la clase base
				const client = await super.configureClientWithFromId(apiKey, credentialsFromId, nodeFromId);

				const result = await client.whatsapp.sendTemplate({
					recipients,
					template_id,
					contact_type: contact_type as 'phone' | 'contact',
					chatbot_status: chatbot_status as 'enable' | 'disable' | 'disable_permanently',
					conversation_status: conversation_status as 'open' | 'hold' | 'closed' | 'unchanged',
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
