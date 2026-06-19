import { ILoadOptionsFunctions, INodeListSearchResult, IDataObject } from "n8n-workflow";
import { handleListSearchError } from "../handler/LoadOptionsError.handle";
import { getTemplatesByAppId } from "./OptionsLoadWpp";

export async function getTemplatesByPhone(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {


	try {
		const from_id = this.getNodeParameter('fromId', '') as number;

		// Check if fromId is selected
		if (!from_id || from_id === 0 ) {
			return { results: [{
				name: 'Please Select a Phone Wasapi ID First',
				value: '',
				description: 'Select a WhatsApp number to see available flows'
			}] };
		}

		const response = await getTemplatesByAppId.call(this, from_id);


		let templates = response.map((template: IDataObject) => ({
			name: `${template.template_id as string} (${template.language as string})`,
			value: template.uuid as string,
			description: `Template: ${(template.body as string) || template.uuid as string}`
		}));

		// Filter results if search term is provided
		if (filter) {
			templates = templates.filter((template) =>
				template.name.toLowerCase().includes(filter.toLowerCase()) ||
				template.value.includes(filter)
			);
		}


		return { results: templates };

	} catch (error: unknown) {
		return handleListSearchError(error);
	}
}
