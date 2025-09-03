import { ILoadOptionsFunctions } from "n8n-workflow";
import { createClient } from "../client/createClient";
import { handleLoadOptionsError } from "../handler/LoadOptionsError.handle";

export async function getFlows(this: ILoadOptionsFunctions) {
	const client = await createClient(this);

	if (!client) {
		return [{ name: '⚠️ First Configure Credentials', value: '' }];
	}

	try {
		const from_id = this.getNodeParameter('fromId', '') as string;
		if (!from_id || from_id === '' || from_id === 'undefined') {
			return [{
				name: '⚠️ Please Select A WhatsApp Number First',
				value: '',
				description: 'Select a WhatsApp number to see available flows'
			}];
		}

		const response = await client.whatsapp.getFlowsByPhoneId(Number(from_id));

		if (!response || response.length === 0) {
			return [{
				name: 'Select A Flow',
				value: '',
				description: `No flows found for phone ID: ${from_id}`
			}];
		}

		// 🎯 VALIDATION INTELLIGENTE: Verify if the previous flowId is valid
		const currentFlowId = this.getNodeParameter('flowId', '') as string;
		if (currentFlowId && currentFlowId !== '') {
			const flowExists = response.some((flow: any) => flow.id.toString() === currentFlowId);
			if (!flowExists) {
				return response.map((flow: any) => ({
					name: flow.name || `Flow ${flow.id}`,
					value: flow.id.toString(),
					description: `Flow ID: ${flow.id} (Previous selection was invalid and has been cleared)`
				}));
			}
		}

		return response.map((flow: any) => ({
			name: flow.name || `Flow ${flow.id}`,
			value: flow.id.toString(),
			description: `Flow ID: ${flow.id}`
		}));

	} catch (error: any) {
		return handleLoadOptionsError(error);
	}
}
