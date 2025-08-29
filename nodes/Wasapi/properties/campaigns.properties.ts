import { INodeProperties } from 'n8n-workflow';
import { getAllCampaignsDescription } from '../../actions/campaigns/getAll.operation';
import { getCampaignByIdDescription } from '../../actions/campaigns/getById.operation';

export const campaignsOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['campaigns'],
		},
	},
	options: [
		{
			name: 'Get All',
			value: 'getAll',
			description: 'Get all campaigns',
			action: 'Get all campaigns',
		},
		{
			name: 'Get By ID',
			value: 'getById',
			description: 'Get a campaign by ID',
			action: 'Get a campaign by ID',
		},
	],
	default: 'getAll',
};

export const campaignsProperties: INodeProperties[] = [
	campaignsOperations,
	...getAllCampaignsDescription,
	...getCampaignByIdDescription,
];
