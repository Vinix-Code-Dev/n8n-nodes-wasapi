import { INodeProperties } from 'n8n-workflow';
import { getAllLabelsDescription } from '../../actions/labels/getLabels.operation';
import { getSearchDescription } from '../../actions/labels/getSearch.operation';
import { getByIdDescription } from '../../actions/labels/getById.operation';
import { createDescription } from '../../actions/labels/create.operation';
import { updateDescription } from '../../actions/labels/update.operation';
import { deleteDescription } from '../../actions/labels/delete.operation';

export const labelsOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['labels'],
		},
	},
	options: [
		{
			name: 'Get All',
			value: 'getAll',
			description: 'Get all labels',
			action: 'Get all labels',
		},
		{
			name: 'Get Search',
			value: 'getSearch',
			description: 'Search labels by name',
			action: 'Search labels by name',
		},
		{
			name: 'Get By ID',
			value: 'getById',
			description: 'Get a label by ID',
			action: 'Get a label by ID',
		},
		{
			name: 'Create',
			value: 'create',
			description: 'Create a new label',
			action: 'Create a new label',
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Update a label',
			action: 'Update a label',
		},
		{
			name: 'Delete',
			value: 'delete',
			description: 'Delete a label',
			action: 'Delete a label',
		},
	],
	default: 'getAll',
};

export const labelsProperties: INodeProperties[] = [
	labelsOperations,
	...getAllLabelsDescription,
	...getSearchDescription,
	...getByIdDescription,
	...createDescription,
	...updateDescription,
	...deleteDescription,
];
