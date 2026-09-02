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
import { dateRangeProperties, buildDatesQuery } from './shared';

export const consolidatedConversationsProperties: INodeProperties[] = [...dateRangeProperties];

const displayOptions: IDisplayOptions = {
	show: {
		resource: ['dashboard'],
		operation: ['consolidatedConversations'],
	},
};

export const consolidatedConversationsDescription = updateDisplayOptions(displayOptions, consolidatedConversationsProperties);

export async function executeDashboardConsolidatedConversations(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const start_date = this.getNodeParameter('start_date', 0, '') as string;
	const end_date = this.getNodeParameter('end_date', 0, '') as string;
	const queryString = buildDatesQuery(start_date, end_date);
	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(this, 'wasapiApi', {
			method: 'GET',
			url: `${API_URL}/dashboard/metrics/consolidated-conversations?${queryString}`,
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
