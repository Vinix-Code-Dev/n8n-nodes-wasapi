import { ILoadOptionsFunctions, INodeListSearchResult } from "n8n-workflow";
import { createClient } from "../client/createClient";
import { handleListSearchError } from "../handler/LoadOptionsError.handle";

export async function getTemplatesByPhone(this: ILoadOptionsFunctions, filter?: string) : Promise<INodeListSearchResult> {
	const client = await createClient(this);
	const from_id = this.getNodeParameter('fromId', 0) as number;

	if (!client) {
		return { results: [{ name: '⚠️ First Configure Credentials', value: '' }] };
	}

	try {
		const response = await client.whatsapp.getTemplatesByAppId({from_id});
		return { results: response.map((template: any) => ({ name: template.template_id, value: template.uuid })) };
	} catch (error: any) {
		return handleListSearchError(error);
	}
	}
