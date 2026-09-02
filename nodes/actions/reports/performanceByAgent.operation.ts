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

export const performanceByAgentProperties: INodeProperties[] = [
	{
		displayName: 'Start Date',
		name: 'start_date',
		type: 'string',
		required: true,
		default: '',
		placeholder: '2025-11-12',
		description: 'Start date of the query range (YYYY-MM-DD)',
	},
	{
		displayName: 'End Date',
		name: 'end_date',
		type: 'string',
		required: true,
		default: '',
		placeholder: '2025-11-18',
		description: 'End date of the query range (YYYY-MM-DD)',
	},
];

const displayOptions: IDisplayOptions = {
	show: {
		resource: ['reports'],
		operation: ['performanceByAgent'],
	},
};

export const performanceByAgentDescription = updateDisplayOptions(displayOptions, performanceByAgentProperties);

export async function executeReportPerformanceByAgent(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const start_date = this.getNodeParameter('start_date', 0, '') as string;
	const end_date = this.getNodeParameter('end_date', 0, '') as string;

	const queryParams = new URLSearchParams();
	if (start_date) queryParams.append('start_date', start_date);
	if (end_date) queryParams.append('end_date', end_date);

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(this, 'wasapiApi', {
			method: 'GET',
			url: `${API_URL}/reports/performance-by-agent?${queryParams.toString()}`,
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
