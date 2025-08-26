export abstract class WasapiBase {
	/**
	 * Configura el cliente Wasapi básico
	 */
	protected async configureBasicClient(apiKey: string): Promise<any> {
		const { WasapiClient } = await import('@laiyon/wasapi-sdk');
		return new WasapiClient({ apiKey });
	}
}
