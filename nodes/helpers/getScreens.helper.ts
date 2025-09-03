import { ILoadOptionsFunctions } from "n8n-workflow";
import { createClient } from "../client/createClient";
import { handleLoadOptionsError } from "../handler/LoadOptionsError.handle";

export async function getScreens(this: ILoadOptionsFunctions) {
	const client = await createClient(this as unknown as ILoadOptionsFunctions);

	if (!client) {
		return [{ name: '⚠️ First Configure Credentials', value: '' }];
	}

	try {
		const from_id = this.getNodeParameter('fromId', '') as string;
		const flow_id = this.getNodeParameter('flowId', '') as string;

		// 🔧 FIX: Validación más estricta y logging
		if (!from_id || from_id === '' || from_id === 'undefined') {
			return [{
				name: '⚠️ Please Select A WhatsApp Number First',
				value: '',
				description: 'Select a WhatsApp number to see available flows'
			}];
		}

		if (!flow_id || flow_id === '' || flow_id === 'undefined') {
			return [{
				name: 'Please Select A Screen',
				value: '',
				description: 'No found screens for this flow'
			}];
		}
		const response = await client.whatsapp.getFlowScreens({
			flow_id: flow_id,
			phone_id: Number(from_id)
		});

		if (!response || response.length === 0) {
			return [{
				name: 'No Screens Available For This Flow',
				value: '',
				description: `No screens found for flow ${flow_id} on phone ${from_id}`
			}];
		}

		// 🎯 VALIDACIÓN INTELIGENTE: Verificar si el screen anterior es válido
		const currentScreen = this.getNodeParameter('screen', '') as string;
		if (currentScreen && currentScreen !== '') {
			const screenExists = response.some((screen: any) => screen.value === currentScreen);
			if (!screenExists) {
				return response.map((screen: any) => ({
					name: screen.label || `Screen ${screen.value}`,
					value: screen.value,
					description: `Screen: ${screen.label || screen.value}`
				}));
			}
		}

		return response.map((screen: any) => ({
			name: screen.label || `Screen ${screen.value}`,
			value: screen.value,
			description: `Screen: ${screen.label || screen.value}`
		}));

	} catch (error: any) {
		return handleLoadOptionsError(error);
	}
}
