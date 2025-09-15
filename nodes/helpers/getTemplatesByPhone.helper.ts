import { ILoadOptionsFunctions, INodeListSearchResult } from "n8n-workflow";
import { createClient } from "../client/createClient";
import { handleListSearchError } from "../handler/LoadOptionsError.handle";

export async function getTemplatesByPhone(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
	const client = await createClient(this as unknown as ILoadOptionsFunctions);

	if (!client) {
		return { results: [{ name: '⚠️ First Configure Credentials', value: '' }] };
	}

	client.setExecuteContext(this as any);

	try {
		const from_id = this.getNodeParameter('fromId', '') as number;

		// Check if fromId is selected
		if (!from_id || from_id === 0 ) {
			return { results: [{
				name: '⚠️ Please Select a Phone Wasapi ID First',
				value: '',
				description: 'Select a WhatsApp number to see available flows'
			}] };
		}

		const response = await client.whatsapp.getTemplatesByAppId({
			from_id: from_id,
		});


		let templates = response.map((template: any) => ({
			name: `${template.template_id} (${template.language})`,
			value: template.uuid as string,
			description: `Template: ${template.body || template.uuid}`
		}));

		// Filter results if search term is provided
		if (filter) {
			templates = templates.filter((template: any) =>
				template.name.toLowerCase().includes(filter.toLowerCase()) ||
				template.value.includes(filter)
			);
		}


		return { results: templates };

	} catch (error: any) {
		return handleListSearchError(error);
	}
}
