import { INodeProperties } from 'n8n-workflow';
import { getWorkflowStatusesDescription } from '../../actions/workflow/getStatuses.operation';

export const workflowOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['workflow'],
		},
	},
	options: [
		{
			name: 'Get Statuses',
			value: 'getStatuses',
			description: 'Get a paginated list of workflow statuses with optional filters',
			action: 'Get workflow statuses',
		},
	],
	default: 'getStatuses',
};

export const workflowProperties: INodeProperties[] = [
	workflowOperations,
	...getWorkflowStatusesDescription,
];
