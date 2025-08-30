import { INodeProperties } from 'n8n-workflow';
import { createContactDescription } from '../../actions/contact/createContact.operation';
import { getContactDescription } from '../../actions/contact/getContact.operation';
import { getAllContactsDescription } from '../../actions/contact/getAll.operation';
//import { getSearchContactsDescription } from '../../actions/contact/getSearch.operation';
import { deleteContactDescription } from '../../actions/contact/deleteContact.operation';
import { updateContactDescription } from '../../actions/contact/updateContact.operation';
import { toggleBotDescription } from '../../actions/contact/toggleBot.operation';
import { exportContactsDescription } from '../../actions/contact/export.operation';

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
			name: 'Delete',
			value: 'delete',
			description: 'Delete a contact',
			action: 'Delete a contact',
		},
		{
			name: 'Export',
			value: 'export',
			description: 'Export contacts by email',
			action: 'Export contacts',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Get a contact',
			action: 'Get a contact',
		},
		{
			name: 'Get Many',
			value: 'getAll',
			description: 'Get many contacts',
			action: 'Get many contacts',
		},
		{
			name: 'Toggle Bot',
			value: 'toggleBot',
			description: 'Toggle bot status for a contact',
			action: 'Toggle bot status for a contact',
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
	...getAllContactsDescription,
	//...getSearchContactsDescription,
	...deleteContactDescription,
	...updateContactDescription,
	...toggleBotDescription,
	...exportContactsDescription,
];
