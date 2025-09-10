import { WasapiClient } from "@wasapi/js-sdk";
import { ILoadOptionsFunctions } from "n8n-workflow";

/**
 * create Wasapi client and handle credentials
 */
export async function createClient(context: ILoadOptionsFunctions): Promise<WasapiClient | null> {
    try {
        const credentials = await context.getCredentials('wasapiApi');
        const apiKey = credentials.apiKey as string;

        if (!apiKey) {
            throw new Error('❌ No API key provided');
        }

        return new WasapiClient({ apiKey });
    } catch (error: any) {
        throw new Error(`❌ Error creating Wasapi client: ${error.message}`);
    }
}

