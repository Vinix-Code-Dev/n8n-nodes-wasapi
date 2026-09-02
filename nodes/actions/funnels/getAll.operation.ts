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

export const getAllFunnelsProperties: INodeProperties[] = [];

const displayOptions: IDisplayOptions = {
	show: {
		resource: ['funnels'],
		operation: ['getAll'],
	},
};

export const getAllFunnelsDescription = updateDisplayOptions(displayOptions, getAllFunnelsProperties);

export async function executeGetAllFunnels(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(this, 'wasapiApi', {
			method: 'GET',
			url: `${API_URL}/funnels`,
			headers: { 'Content-Type': 'application/json' },
		});
		return [this.helpers.returnJsonArray(response)];
	} catch (error) {
		if (this.continueOnFail()) {
			return [this.helpers.returnJsonArray({ error: (error as Error).message })];
		}
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
