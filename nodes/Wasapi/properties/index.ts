import { INodeProperties } from 'n8n-workflow';
import { contactProperties } from './contact.properties';
import { whatsappProperties } from './whatsapp.properties';
import { labelsProperties } from './labels.properties';
import { customFieldsProperties } from './customFields.properties';

export const resourceOptions: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{
			name: 'Contact',
			value: 'contact',
			description: 'Manage contacts',
			action: 'Manage contacts',
		},
		{
			name: 'WhatsApp',
			value: 'whatsapp',
			description: 'Send WhatsApp messages and attachments',
			action: 'Send WhatsApp messages',
		},
		{
			name: 'Labels',
			value: 'labels',
			description: 'Manage labels',
			action: 'Manage labels',
		},
		{
			name: 'Custom Fields',
			value: 'customFields',
			description: 'Manage custom fields',
			action: 'Manage custom fields',
		},
	],
	default: 'contact',
};

export const allProperties: INodeProperties[] = [
	resourceOptions,
	...contactProperties,
	...whatsappProperties,
	...labelsProperties,
	...customFieldsProperties,
];
