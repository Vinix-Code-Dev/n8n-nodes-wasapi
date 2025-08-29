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
			name: 'Get By UUID',
			value: 'getByUuid',
			description: 'Get a campaign by UUID',
			action: 'Get a campaign by UUID',
		},
	],
	default: 'getAll',
};

export const campaignsProperties: INodeProperties[] = [
	campaignsOperations,
	...getAllCampaignsDescription,
	...getCampaignByIdDescription,
];
