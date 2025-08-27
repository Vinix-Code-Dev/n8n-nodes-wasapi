import { IExecuteFunctions, ILoadOptionsFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { WasapiClient } from '@laiyon/wasapi-sdk';

export abstract class WasapiBase {
	/**
	 * get the list of available WhatsApp numbers
	 */
	protected async getWhatsappNumbers(this: ILoadOptionsFunctions) {
		try {
			// get credentials
			const credentials = await this.getCredentials('wasapiApi');
			const apiKey = credentials.apiKey as string;

			if (!apiKey) {
				return [{ name: '⚠️ First configure credentials', value: '' }];
			}

			// initialize Wasapi client
			const client = new WasapiClient({ apiKey });

			// get available numbers
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

			return options; ``
		} catch (error: any) {
			return [
				{
					name: `❌ Connection error: ${error.message || 'Unknown'}`,
					value: '',
				},
			];
		}
	}
	// get labels
	protected async getLabels(this: ILoadOptionsFunctions) {
		const credentials = await this.getCredentials('wasapiApi');
		const apiKey = credentials.apiKey as string;
		if (!apiKey) {
			return [{ name: '⚠️ First configure credentials', value: '' }];
		}
		const client = new WasapiClient({ apiKey });
		try {
			const response = await client.labels.getAll();
			return response.labels.map((label: any) => ({
				name: label.name,
				value: label.id.toString(),
			}));
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
	 * create a Wasapi client configured with from_id
	 */
	protected async createClient(apiKey: string, nodeFromId?: string, credentialsFromId?: string): Promise<WasapiClient> {
		const clientConfig: any = { apiKey };

		// priority: From ID of the node > From ID of credentials > default SDK
		let fromId = nodeFromId || credentialsFromId;
		if (fromId) {
			clientConfig.from_id = parseInt(fromId);
		}

		return new WasapiClient(clientConfig);
	}

	/**
	 * get the prioritized from_id
	 */
	protected getPrioritizedFromId(nodeFromId?: string, credentialsFromId?: string): string | undefined {
		return nodeFromId || credentialsFromId;
	}

	/**
	 * common properties for all Wasapi nodes
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
	 * common credentials properties
	 */
	protected getCommonCredentials() {
		return [
			{
				name: 'wasapiApi',
				required: true,
			},
		];
	}


	protected getUrlApi() {
		return 'https://api-ws.wasapi.io/api/v1';
	}

	/**
	 * common execute method that handles the repetitive logic
	 */
	protected async executeCommon(
		this: IExecuteFunctions & WasapiBase,
		operation: (client: WasapiClient, item: any, index: number) => Promise<any>
	): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: any[] = [];

		// get credentials
		const credentials = await this.getCredentials('wasapiApi');
		const apiKey = credentials.apiKey as string;
		const credentialsFromId = credentials.fromId as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const nodeFromId = this.getNodeParameter('fromId', i) as string;

				// use the existing createClient method
				const client = await this.createClient(apiKey, nodeFromId, credentialsFromId);

				// execute the specific operation of the node
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
