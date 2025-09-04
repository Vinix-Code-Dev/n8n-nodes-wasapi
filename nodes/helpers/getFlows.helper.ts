import { ILoadOptionsFunctions, INodeListSearchResult } from "n8n-workflow";
import { createClient } from "../client/createClient";
import { handleListSearchError } from "../handler/LoadOptionsError.handle";

export async function getFlows(this: ILoadOptionsFunctions, filter?: string) : Promise<INodeListSearchResult> {
	const client = await createClient(this);

	if (!client) {
		return { results: [{ name: '⚠️ First Configure Credentials', value: '' }] };
	}

	try {
		const from_id = this.getNodeParameter('fromId', 0) as string;

		// Check if fromId is selected
		if (!from_id || from_id === '') {
			return { results: [{
				name: '⚠️ Please Select a Phone Wasapi ID First',
				value: ''
			}] };
		}

		const response = await client.whatsapp.getFlowsByPhoneId(Number(from_id));

		if (!response || !Array.isArray(response) || response.length === 0) {
			return { results: [{
				name: '📝 No Flows Available for This Phone Number',
				value: ''
			}] };
		}

		let flows = response.map((flow: any) => ({
			name: flow.name || `Flow ${flow.id}`,
			value: flow.id.toString(),
		}));

		// Filter results if search term is provided
		if (filter) {
			flows = flows.filter((flow: any) =>
				flow.name.toLowerCase().includes(filter.toLowerCase()) ||
				flow.value.includes(filter)
			);
		}

		return { results: flows };

	} catch (error: any) {
		return handleListSearchError(error);
	}
}
