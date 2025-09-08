import { INodeProperties } from 'n8n-workflow';
import { campaignsProperties } from './campaigns.properties';
import { contactProperties } from './contact.properties';
import { customFieldsProperties } from './customFields.properties';
import { labelsProperties } from './labels.properties';
import { whatsappProperties } from './whatsapp.properties';
import { userProperties } from './user.properties';

export const resourceOptions: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
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
			name: 'Label',
			value: 'labels',
			description: 'Manage label',
			action: 'Manage label',
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
];
