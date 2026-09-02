import {
	IExecuteFunctions,
	IDisplayOptions,
	INodeExecutionData,
	INodeProperties,
	NodeApiError,
	JsonObject,
	updateDisplayOptions,
} from 'n8n-workflow';
import { API_URL } from '../../config/constants';

export const moveFunnelContactProperties: INodeProperties[] = [
	{
		displayName: 'Contact ID',
		name: 'contact_id',
		type: 'number',
		required: true,
		default: 0,
		description: 'Identifier of the funnel contact to move',
	},
	{
		displayName: 'To Stage ID',
		name: 'to_stage_id',
		type: 'number',
		required: true,
		default: 0,
		description: 'Identifier of the destination stage the contact will be moved to',
	},
];

const displayOptions: IDisplayOptions = {
	show: {
		resource: ['funnels'],
		operation: ['moveContact'],
	},
};

export const moveFunnelContactDescription = updateDisplayOptions(displayOptions, moveFunnelContactProperties);

export async function executeMoveFunnelContact(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const contact_id = this.getNodeParameter('contact_id', 0, 0) as number;
	const to_stage_id = this.getNodeParameter('to_stage_id', 0, 0) as number;

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(this, 'wasapiApi', {
			method: 'POST',
			url: `${API_URL}/funnels/stage/move-contact`,
			headers: { 'Content-Type': 'application/json' },
			body: {
				contact_id,
				to_stage_id,
			},
		});
		return [this.helpers.returnJsonArray(response)];
	} catch (error) {
		if (this.continueOnFail()) {
			return [this.helpers.returnJsonArray({ error: (error as Error).message })];
		}
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
