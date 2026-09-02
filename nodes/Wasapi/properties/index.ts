import { INodeProperties } from 'n8n-workflow';
import { campaignsProperties } from './campaigns.properties';
import { contactProperties } from './contact.properties';
import { customFieldsProperties } from './customFields.properties';
import { labelsProperties } from './labels.properties';
import { whatsappProperties } from './whatsapp.properties';
import { userProperties } from './user.properties';
import { agentsProperties } from './agents.properties';
import { dashboardProperties } from './dashboard.properties';
import { funnelsProperties } from './funnels.properties';
import { reportsProperties } from './reports.properties';
import { workflowProperties } from './workflow.properties';

export const resourceOptions: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{
			name: 'Agent',
			value: 'agents',
			description: 'Get online agent information',
			action: 'Get online agent',
		},
		{
			name: 'Campaign',
			value: 'campaigns',
			description: 'Manage campaigns',
			action: 'Manage campaigns',
		},
		{
			name: 'Contact',
			value: 'contact',
			description: 'Manage contacts',
			action: 'Manage contacts',
		},
		{
			name: 'Custom Field',
			value: 'customFields',
			description: 'Manage custom fields',
			action: 'Manage custom fields',
		},
		{
			name: 'Dashboard',
			value: 'dashboard',
			description: 'Get dashboard metrics',
			action: 'Get dashboard metrics',
		},
		{
			name: 'Funnel',
			value: 'funnels',
			description: 'Manage funnels and their contacts',
			action: 'Manage funnels',
		},
		{
			name: 'Label',
			value: 'labels',
			description: 'Manage label',
			action: 'Manage label',
		},
		{
			name: 'Report',
			value: 'reports',
			description: 'Get reports',
			action: 'Get reports',
		},
		{
			name: 'User',
			value: 'user',
			description: 'Get user information',
			action: 'Get user information',
		},
		{
			name: 'WhatsApp',
			value: 'whatsapp',
			description: 'Send WhatsApp messages and attachments',
			action: 'Send WhatsApp messages',
		},
		{
			name: 'Workflow',
			value: 'workflow',
			description: 'Get workflow statuses',
			action: 'Get workflow statuses',
		},
	],
	default: 'contact',
};

export const allProperties: INodeProperties[] = [
	resourceOptions,
	...campaignsProperties,
	...contactProperties,
	...customFieldsProperties,
	...labelsProperties,
	...whatsappProperties,
	...userProperties,
	...agentsProperties,
	...dashboardProperties,
	...funnelsProperties,
	...reportsProperties,
	...workflowProperties,
];
