import { INodeProperties } from 'n8n-workflow';
import { getAllFunnelsDescription } from '../../actions/funnels/getAll.operation';
import { searchFunnelContactDescription } from '../../actions/funnels/searchContact.operation';
import { moveFunnelContactDescription } from '../../actions/funnels/moveContact.operation';

export const funnelsOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['funnels'],
		},
	},
	options: [
		{
			name: 'Get Many',
			value: 'getAll',
			description: 'Get the list of funnels with their stages',
			action: 'Get many funnels',
		},
		{
			name: 'Search Contact',
			value: 'searchContact',
			description: 'Search a contact in the funnels by UUID or phone',
			action: 'Search a contact in funnels',
		},
		{
			name: 'Move Contact',
			value: 'moveContact',
			description: 'Move a contact to another stage of the funnel',
			action: 'Move a contact to another stage',
		},
	],
	default: 'getAll',
};

export const funnelsProperties: INodeProperties[] = [
	funnelsOperations,
	...getAllFunnelsDescription,
	...searchFunnelContactDescription,
	...moveFunnelContactDescription,
];
