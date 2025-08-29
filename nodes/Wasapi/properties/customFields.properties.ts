import { INodeProperties } from 'n8n-workflow';
import { getAllCustomFieldsDescription } from '../../actions/customFields/getAll.operation';
import { createCustomFieldDescription } from '../../actions/customFields/create.operation';
import { updateCustomFieldDescription } from '../../actions/customFields/update.operation';
import { deleteCustomFieldDescription } from '../../actions/customFields/delete.operation';

export const customFieldsOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['customFields'],
		},
	},
	options: [
		{
			name: 'Get All',
			value: 'getAll',
			description: 'Get all custom fields',
			action: 'Get all custom fields',
		},
		{
			name: 'Create',
			value: 'create',
			description: 'Create a new custom field',
			action: 'Create a new custom field',
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Update a custom field',
			action: 'Update a custom field',
		},
		{
			name: 'Delete',
			value: 'delete',
			description: 'Delete a custom field',
			action: 'Delete a custom field',
		},
	],
	default: 'getAll',
};

export const customFieldsProperties: INodeProperties[] = [
	customFieldsOperations,
	...getAllCustomFieldsDescription,
	...createCustomFieldDescription,
	...updateCustomFieldDescription,
	...deleteCustomFieldDescription,
];
