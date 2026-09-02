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

export const totalCampaignsProperties: INodeProperties[] = [...dateRangeProperties];

const displayOptions: IDisplayOptions = {
	show: {
		resource: ['dashboard'],
		operation: ['totalCampaigns'],
	},
};

export const totalCampaignsDescription = updateDisplayOptions(displayOptions, totalCampaignsProperties);

export async function executeDashboardTotalCampaigns(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const start_date = this.getNodeParameter('start_date', 0, '') as string;
	const end_date = this.getNodeParameter('end_date', 0, '') as string;
	const queryString = buildDatesQuery(start_date, end_date);
	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(this, 'wasapiApi', {
			method: 'GET',
			url: `${API_URL}/dashboard/metrics/total-campaigns?${queryString}`,
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
