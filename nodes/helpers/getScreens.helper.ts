import { ILoadOptionsFunctions, INodeListSearchResult, IDataObject } from "n8n-workflow";
import { handleListSearchError } from "../handler/LoadOptionsError.handle";
import { getFlowScreens } from "./OptionsLoadWpp";

export async function getScreens(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {

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
		const response = await getFlowScreens.call(this, flow_id, Number(from_id));

		if (response.length === 0 ) {
			return { results: [{
				name: '📝 No Screens Available for This Flow',
				value: '',
				description: `No screens found for flow ${flow_id} on phone ${from_id}`
			}] };
		}



		let screens = response.map((screen: IDataObject) => ({
			name: (screen.label as string) || `Screen ${screen.value as string}`,
			value: screen.value as string,
			description: `Screen: ${(screen.label as string) || screen.value as string}`
		}));

		// Filter results if search term is provided
		if (filter) {
			screens = screens.filter((screen) =>
				screen.name.toLowerCase().includes(filter.toLowerCase()) ||
				(screen.value as string).includes(filter)
			);
		}

		return { results: screens };

	} catch (error: unknown) {
		return handleListSearchError(error);
	}
}
