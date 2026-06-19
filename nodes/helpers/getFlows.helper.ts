import { ILoadOptionsFunctions, INodeListSearchResult, IDataObject } from "n8n-workflow";
import { handleListSearchError } from "../handler/LoadOptionsError.handle";
import { getFlowsByPhoneId } from "./OptionsLoadWpp";

export async function getFlows(this: ILoadOptionsFunctions, filter?: string) : Promise<INodeListSearchResult> {

	try {
		const from_id = this.getNodeParameter('fromId', 0) as string;

		// Check if fromId is selected
		if (!from_id || from_id === '') {
			return { results: [{
				name: 'Please Select a Phone Wasapi ID First',
				value: ''
			}] };
		}

		const response = await getFlowsByPhoneId.call(this, Number(from_id));

		if (!response || !Array.isArray(response) || response.length === 0) {
			return { results: [{
				name: 'No Flows Available for This Phone Number',
				value: ''
			}] };
		}

		let flows = response.map((flow: IDataObject) => ({
			name: (flow.name as string) || `Flow ${flow.id as string}`,
			value: String(flow.id),
		}));

		// Filter results if search term is provided
		if (filter) {
			flows = flows.filter((flow) =>
				flow.name.toLowerCase().includes(filter.toLowerCase()) ||
				flow.value.includes(filter)
			);
		}

		return { results: flows };

	} catch (error: unknown) {
		return handleListSearchError(error);
	}
}
