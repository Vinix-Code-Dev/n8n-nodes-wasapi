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

export const agentMetricsProperties: INodeProperties[] = [
	{
		displayName: 'Metric Type',
		name: 'type',
		type: 'options',
		required: true,
		default: 'time_response',
		options: [
			{ name: 'Transferred Requests', value: 'transferred' },
			{ name: 'Response Time', value: 'time_response' },
			{ name: 'Volume of Work', value: 'volume_of_work' },
			{ name: 'Time in Conversation', value: 'time_in_conversation' },
		],
		description: 'Type of agent metric to retrieve',
	},
	{
		displayName: 'Agent',
		name: 'agent_id',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		description: 'The agent to retrieve metrics for',
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
		displayName: 'Start Date',
		name: 'start',
		type: 'string',
		required: true,
		default: '',
		placeholder: '2024-03-01',
		description: 'Start date of the range (YYYY-MM-DD)',
	},
	{
		displayName: 'End Date',
		name: 'end',
		type: 'string',
		required: true,
		default: '',
		placeholder: '2024-03-31',
		description: 'End date of the range (YYYY-MM-DD)',
	},
];

const displayOptions: IDisplayOptions = {
	show: {
		resource: ['dashboard'],
		operation: ['agentMetrics'],
	},
};

export const agentMetricsDescription = updateDisplayOptions(displayOptions, agentMetricsProperties);

export async function executeDashboardAgentMetrics(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const type = this.getNodeParameter('type', 0, '') as string;
	const agent_id = this.getNodeParameter('agent_id.value', 0, '') as string;
	const start = this.getNodeParameter('start', 0, '') as string;
	const end = this.getNodeParameter('end', 0, '') as string;

	const queryParams = new URLSearchParams();
	if (type) queryParams.append('type', type);
	if (agent_id) queryParams.append('agent_id', agent_id.toString());
	if (start) queryParams.append('start', start);
	if (end) queryParams.append('end', end);

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(this, 'wasapiApi', {
			method: 'GET',
			url: `${API_URL}/metrics?${queryParams.toString()}`,
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
