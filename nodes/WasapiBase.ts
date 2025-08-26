import { WasapiClient } from '@laiyon/wasapi-sdk';

export abstract class WasapiBase {
	/**
	 * Configura el cliente Wasapi básico
	 */
	protected configureBasicClient(apiKey: string): WasapiClient {
		return new WasapiClient({ apiKey });
	}
}
