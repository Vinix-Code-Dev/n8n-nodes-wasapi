import { INodeProperties } from 'n8n-workflow';
import { getAgentsDescription } from '../../actions/agents/getAgents.operation';
import { assignAgentDescription } from '../../actions/agents/assignAgent.operation';

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
		{
			name: 'Assign Agent',
			value: 'assignAgent',
			description: 'Assign agent to contact or change conversation status',
			action: 'Assign agent to contact',
		},
	],
	default: 'get',
};

export const agentsProperties: INodeProperties[] = [
	agentsOperations,
	...getAgentsDescription,
	...assignAgentDescription,
];
