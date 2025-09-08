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
			name: 'Change Chat Status or Transfer',
			value: 'assignAgent',
			description: 'Change the status of a chat (open, closed, on hold) or transfer chat to an agent',
			action: 'Change chat status or transfer',
		},
	],
	default: 'get',
};

export const agentsProperties: INodeProperties[] = [
	agentsOperations,
	...getAgentsDescription,
	...assignAgentDescription,
];
