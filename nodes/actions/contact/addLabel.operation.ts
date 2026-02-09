import {
	IExecuteFunctions,
	IDisplayOptions,
	INodeExecutionData,
	INodeProperties,
	updateDisplayOptions,
} from 'n8n-workflow';
import { API_URL } from '../../config/constants';
export const addLabelProperties: INodeProperties[] = [

	{
		displayName: 'WhatsApp ID',
		name: 'contact_uuid',
		type: 'string',
		default: '',
		required: true,
		description: 'Enter a phone number (including the country code without the + sign). For example instead of entering use 573203294920.',
	},
	{
		displayName: 'Label Names or IDs',
		name: 'labels',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getLabels',
		},
		default: [],
		required: true,
		description: 'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
];

const displayOptions: IDisplayOptions = {
	show: {
		resource: ['contact'],
		operation: ['addLabel'],
	},
};

export const addLabelDescription = updateDisplayOptions(displayOptions, addLabelProperties);

export async function executeAddLabel(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'wasapiApi',
			{
				method: 'POST',
				url: `${API_URL}/contacts/${this.getNodeParameter('contact_uuid', 0, '') as string}/add-labels`,
				headers: {
					'Content-Type': 'application/json',
				},
				body: {
					labels: this.getNodeParameter('labels', 0, []) as number [],
					from_make: 1,
				},
			}
		);
		return [this.helpers.returnJsonArray(response)];
	} catch (error) {
		if (this.continueOnFail()) {
			return [this.helpers.returnJsonArray({ error: error.message })];
		}
		throw error;
	}
}
