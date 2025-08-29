import { INodeProperties } from 'n8n-workflow';
import { createContactDescription } from '../../actions/contact/createContact.operation';
import { getContactDescription } from '../../actions/contact/getContact.operation';
import { deleteContactDescription } from '../../actions/contact/deleteContact.operation';
import { updateContactDescription } from '../../actions/contact/updateContact.operation';

export const contactOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['contact'],
		},
	},
	options: [
		{
			name: 'Create',
			value: 'create',
			description: 'Create a new contact',
			action: 'Create a new contact',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Get a contact',
			action: 'Get a contact',
		},
		{
			name: 'Delete',
			value: 'delete',
			description: 'Delete a contact',
			action: 'Delete a contact',
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Update a contact',
			action: 'Update a contact',
		},
	],
	default: 'create',
};

export const contactProperties: INodeProperties[] = [
	contactOperations,
	...createContactDescription,
	...getContactDescription,
	...deleteContactDescription,
	...updateContactDescription,
];
