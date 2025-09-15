import { ILoadOptionsFunctions, INodeListSearchResult } from "n8n-workflow";
import { createClient } from "../client/createClient";
import { handleListSearchError } from "../handler/LoadOptionsError.handle";

export async function getScreens(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
	const client = await createClient(this as unknown as ILoadOptionsFunctions);

	if (!client) {
		return { results: [{ name: '⚠️ First Configure Credentials', value: '' }] };
	}

	client.setExecuteContext(this as any);

	try {
		const from_id = this.getNodeParameter('fromId', '') as number;
		const flow_id = this.getNodeParameter('flowId.value', '') as string;

		// Check if fromId is selected
		if (!from_id || from_id === 0 ) {
			return { results: [{
				name: '⚠️ Please Select a Phone Wasapi ID First',
				value: '',
				description: 'Select a WhatsApp number to see available flows'
			}] };
		}

		// Check if flowId is selected
		if (!flow_id || flow_id === '' || flow_id === 'undefined') {
			return { results: [{
				name: '⚠️ Please Select a Flow First',
				value: '',
				description: 'Select a flow to see available screens'
			}] };
		}
		const response = await client.whatsapp.getFlowScreens({
			flow_id: flow_id,
			phone_id: Number(from_id)
		});

		if (!response || !Array.isArray(response) || response.length === 0) {
			return { results: [{
				name: '📝 No Screens Available for This Flow',
				value: '',
				description: `No screens found for flow ${flow_id} on phone ${from_id}`
			}] };
		}

		let screens = response.map((screen: any) => ({
			name: screen.label || `Screen ${screen.value}`,
			value: screen.value,
			description: `Screen: ${screen.label || screen.value}`
		}));

		// Filter results if search term is provided
		if (filter) {
			screens = screens.filter((screen: any) =>
				screen.name.toLowerCase().includes(filter.toLowerCase()) ||
				screen.value.includes(filter)
			);
		}


		return { results: screens };

	} catch (error: any) {
		return handleListSearchError(error);
	}
}
