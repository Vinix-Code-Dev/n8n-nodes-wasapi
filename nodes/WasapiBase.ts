import { IExecuteFunctions, ILoadOptionsFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { WasapiClient } from '@laiyon/wasapi-sdk';

export abstract class WasapiBase {
	/**
	 * Obtiene la lista de números de WhatsApp disponibles
	 */
	protected async getWhatsappNumbers(this: ILoadOptionsFunctions) {
		try {
			// Obtener credenciales
			const credentials = await this.getCredentials('wasapiApi');
			const apiKey = credentials.apiKey as string;
			
			if (!apiKey) {
				return [{ name: '⚠️ First configure credentials', value: '' }];
			}

			// Inicializar cliente Wasapi
			const client = new WasapiClient({ apiKey });

			// Obtener números disponibles
			const response = await client.whatsapp.getWhatsappNumbers();
			
			if (!response?.success || !Array.isArray(response.data)) {
				return [{ name: '❌ No numbers available', value: '' }];
			}

			// Crear opciones para cada número
			const options: any[] = [
				{ name: '-- Use From ID from credentials --', value: '' },
			];

			response.data.forEach((n: any) => {
				const isDefault = n.default === 1;
				options.push({
					name: `${n.display_name} (${n.phone_number})${isDefault ? ' (Default)' : ''}`,
					value: n.id.toString(),
				});
			});

			return options;
		} catch (error: any) {
			return [
				{
					name: `❌ Connection error: ${error.message || 'Unknown'}`,
					value: '',
				},
			];
		}
	}

	/**
	 * Crea un cliente Wasapi configurado con from_id
	 */
	protected async createClient(apiKey: string, nodeFromId?: string, credentialsFromId?: string): Promise<WasapiClient> {
		const clientConfig: any = { apiKey };
		
		// Prioridad: From ID del nodo > From ID de credenciales > SDK por defecto
		let fromId = nodeFromId || credentialsFromId;
		if (fromId) {
			clientConfig.from_id = parseInt(fromId);
		}
		
		return new WasapiClient(clientConfig);
	}

	/**
	 * Obtiene el from_id prioritizado
	 */
	protected getPrioritizedFromId(nodeFromId?: string, credentialsFromId?: string): string | undefined {
		return nodeFromId || credentialsFromId;
	}

	/**
	 * Propiedades comunes para todos los nodos Wasapi
	 */
	protected getCommonProperties(): INodeProperties[] {
		return [
			{
				displayName: 'Sender Phone Number',
				name: 'fromId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getWhatsappNumbers',
				},
				default: '',
				required: true,
				description: 'Pick the phone number you want to use to send messages from',
			},
			{
				displayName: 'WhatsApp ID',
				name: 'wa_id',
				type: 'string',
				default: '',
				required: true,
				description: 'Enter a phone number (including the country code without the + sign). For example instead of entering use 573203294920.',
			},
		];
	}

	/**
	 * Propiedades de credenciales comunes
	 */
	protected getCommonCredentials() {
		return [
			{
				name: 'wasapiApi',
				required: true,
			},
		];
	}

	/**
	 * Método execute común que maneja la lógica repetida
	 */
	protected async executeCommon(
		this: IExecuteFunctions,
		operation: (client: WasapiClient, item: any, index: number) => Promise<any>
	): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: any[] = [];

		// Obtener credenciales
		const credentials = await this.getCredentials('wasapiApi');
		const apiKey = credentials.apiKey as string;
		const credentialsFromId = credentials.fromId as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const nodeFromId = this.getNodeParameter('fromId', i) as string;
				
				// Crear cliente directamente aquí
				const clientConfig: any = { apiKey };
				let fromId = nodeFromId || credentialsFromId;
				if (fromId) {
					clientConfig.from_id = parseInt(fromId);
				}
				const client = new WasapiClient(clientConfig);

				// Ejecutar la operación específica del nodo
				const result = await operation.call(this, client, items[i], i);
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
