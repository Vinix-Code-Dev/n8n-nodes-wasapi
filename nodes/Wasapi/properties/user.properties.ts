import { INodeProperties } from 'n8n-workflow';
import { getUserDescription } from '../../actions/user/getUser.operation';

export const userOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['user'],
		},
	},
	options: [
		{
			name: 'Get User Information',
			value: 'get',
			description: 'Get current user information',
			action: 'Get user information',
		},
	],
	default: 'get',
};

export const userProperties: INodeProperties[] = [
	userOperations,
	...getUserDescription,
];
