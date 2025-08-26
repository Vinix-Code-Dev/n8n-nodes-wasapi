import {
	IExecuteFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';
import { WasapiBase } from './WasapiBase';

export abstract class WasapiBaseWithFromId extends WasapiBase {
	/**
	 * Obtiene la lista de números de WhatsApp disponibles
	 */
	protected async getWhatsappNumbers(this: IExecuteFunctions): Promise<INodePropertyOptions[]> {
		try {
			// Obtener credenciales
			const credentials = await this.getCredentials('wasapiApi');
			const apiKey = credentials.apiKey as string;
			
			if (!apiKey) {
				return [
					{
						name: '⚠️ Primero configura las credenciales Wasapi',
						value: '',
					},
				];
			}

			// Inicializar cliente Wasapi
			const { WasapiClient } = await import('@laiyon/wasapi-sdk');
			const client = new WasapiClient({ apiKey });
			
			// Obtener números disponibles
			const response = await client.whatsapp.getWhatsappNumbers();
			
			if (!response.success || !response.data) {
				return [
					{
						name: '❌ Error al obtener números',
						value: '',
					},
				];
			}

			// Crear opciones para cada número
			const options: INodePropertyOptions[] = [
				{
					name: '-- Usar From ID de las credenciales --',
					value: '',
				},
			];

			response.data.forEach((number: any) => {
				const isDefault = number.default === 1;
				const label = `${number.phone_number}${isDefault ? ' (Por defecto)' : ''}`;
				
				options.push({
					name: label,
					value: number.id.toString(),
				});
			});

			return options;
		} catch (error) {
			return [
				{
					name: '❌ Error de conexión',
					value: '',
				},
			];
		}
	}

	/**
	 * Configura el cliente Wasapi con el fromId apropiado
	 */
	protected async configureClientWithFromId(apiKey: string, credentialsFromId?: string, nodeFromId?: string): Promise<any> {
		const { WasapiClient } = await import('@laiyon/wasapi-sdk');
		const clientConfig: any = { apiKey };
		
		// Priorizar el fromId del nodo sobre el de las credenciales
		let fromId = nodeFromId || credentialsFromId;
		
		if (fromId) {
			clientConfig.from_id = parseInt(fromId);
		}
		
		return new WasapiClient(clientConfig);
	}
}
