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
			name: 'Delete',
			value: 'delete',
			description: 'Delete a label',
			action: 'Delete a label',
		},
		{
			name: 'Get By ID',
			value: 'getById',
			description: 'Get a label by ID',
			action: 'Get a label by ID',
		},
		{
			name: 'Get Many',
			value: 'getAll',
			description: 'Get many labels',
			action: 'Get many labels',
		},
		{name: 'Search by Name',
			value: 'getSearch',
			description: 'Search labels by name',
			action: 'Search labels by name',
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Update a label',
			action: 'Update a label',
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
