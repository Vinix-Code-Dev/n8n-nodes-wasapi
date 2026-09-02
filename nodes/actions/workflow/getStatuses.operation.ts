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

export const getWorkflowStatusesProperties: INodeProperties[] = [
	{
		displayName: 'Action',
		name: 'action',
		type: 'options',
		default: '',
		options: [
			{ name: 'Any', value: '' },
			{ name: 'Open', value: 'open' },
			{ name: 'Hold', value: 'hold' },
			{ name: 'Closed', value: 'closed' },
		],
		description: 'Filter by action type',
	},
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		default: '',
		description: 'Filter by the phone number the interaction was with',
	},
	{
		displayName: 'Agent',
		name: 'agent_id',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		description: 'Filter by agent',
		modes: [
			{
				displayName: 'Agent List',
				name: 'list',
				type: 'list',
				placeholder: 'Select an agent...',
				typeOptions: {
					searchListMethod: 'getAgents',
					searchable: true,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'Enter agent ID',
			},
		],
	},
	{
		displayName: 'Dates',
		name: 'dates',
		type: 'string',
		default: '',
		placeholder: '2024-03-01,2024-03-31',
		description: 'Date range in YYYY-MM-DD format separated by comma (e.g. 2024-03-01,2024-03-31)',
	},
	{
		displayName: 'Per Page',
		name: 'per_page',
		type: 'number',
		default: 15,
		typeOptions: {
			maxValue: 50,
			minValue: 1,
		},
		description: 'Number of records per page. Maximum 50, default 15.',
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		description: 'Page number for pagination',
	},
];

const displayOptions: IDisplayOptions = {
	show: {
		resource: ['workflow'],
		operation: ['getStatuses'],
	},
};

export const getWorkflowStatusesDescription = updateDisplayOptions(displayOptions, getWorkflowStatusesProperties);

export async function executeGetWorkflowStatuses(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const action = this.getNodeParameter('action', 0, '') as string;
	const phone = this.getNodeParameter('phone', 0, '') as string;
	const agent_id = this.getNodeParameter('agent_id.value', 0, '') as string;
	const dates = this.getNodeParameter('dates', 0, '') as string;
	const per_page = this.getNodeParameter('per_page', 0, 15) as number;
	const page = this.getNodeParameter('page', 0, 1) as number;

	const queryParams = new URLSearchParams();
	if (action) queryParams.append('action', action);
	if (phone) queryParams.append('phone', phone);
	if (agent_id) queryParams.append('agent_id', agent_id.toString());
	if (dates) queryParams.append('dates', dates);
	if (per_page) queryParams.append('per_page', per_page.toString());
	if (page) queryParams.append('page', page.toString());

	const queryString = queryParams.toString();

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(this, 'wasapiApi', {
			method: 'GET',
			url: `${API_URL}/workflow-statuses${queryString ? `?${queryString}` : ''}`,
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
