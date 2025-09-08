import { INodeProperties } from 'n8n-workflow';
import { getAgentsDescription } from '../../actions/agents/getAgents.operation';

export const agentsOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['agents'],
		},
	},
	options: [
		{
			name: 'Get Agents',
			value: 'get',
			description: 'Get online agents',
			action: 'Get online agents',
		},
	],
	default: 'get',
};

export const agentsProperties: INodeProperties[] = [
	agentsOperations,
	...getAgentsDescription,
];
