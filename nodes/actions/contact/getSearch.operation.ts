import {
	IExecuteFunctions,
	IDisplayOptions,
	INodeExecutionData,
	INodeProperties,
	updateDisplayOptions,
} from 'n8n-workflow';
import { API_URL } from '../../config/constants';

export const getSearchContactsProperties: INodeProperties[] = [
	{
		displayName: 'Search by Name',
		name: 'search',
		type: 'string',
		default: '',
		description: 'Search contacts by name',
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		description: 'Page number for pagination',

	},
	{   //eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
		displayName: 'Labels Names or IDs',
		name: 'labels',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getLabels',
		},
		default: [],
		description: 'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
];

const displayOptions: IDisplayOptions = {
	show: {
		resource: ['contact'],
		operation: ['getSearch'],
	},
};

export const getSearchContactsDescription = updateDisplayOptions(displayOptions, getSearchContactsProperties);



export async function executeGetSearchContacts(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

	const search = this.getNodeParameter('search', 0, '') as string;
	const labels = this.getNodeParameter('labels', 0, '') as number;
	const page = this.getNodeParameter('page', 0, 1) as number;
//params for search contacts
	const queryParams = new URLSearchParams();
	if (search) queryParams.append('search', search);
	if (labels) queryParams.append('labels', labels.toString());
	if (page) queryParams.append('page', page.toString());
	// request search contacts
	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(this, 'wasapiApi', {
			method: 'GET',
			url: `${API_URL}/contacts?${queryParams.toString()}`,
			headers: { 'Content-Type': 'application/json' },

		});
		return [this.helpers.returnJsonArray(response)];
	} catch (error) {
		if (this.continueOnFail()) {
			return [this.helpers.returnJsonArray({ error: error.message })];
		}
		throw error;
	}
}
