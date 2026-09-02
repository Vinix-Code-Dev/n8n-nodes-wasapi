import {
	IExecuteFunctions,
	IDisplayOptions,
	INodeExecutionData,
	INodeProperties,
	NodeApiError,
	JsonObject,
	updateDisplayOptions,
} from 'n8n-workflow';
import { API_URL } from '../../config/constants';

export const searchFunnelContactProperties: INodeProperties[] = [
	{
		displayName: 'Contact UUID',
		name: 'contact_uuid',
		type: 'string',
		default: '',
		placeholder: '1ad0f50f-f717-4ccf-94f3-e4d8810f5a13',
		description: 'UUID of the contact to search in the funnels. Provide this or a phone number.',
	},
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		default: '',
		placeholder: '573207017093',
		description: 'Phone number of the contact (must include country code). Provide this or a contact UUID.',
	},
];

const displayOptions: IDisplayOptions = {
	show: {
		resource: ['funnels'],
		operation: ['searchContact'],
	},
};

export const searchFunnelContactDescription = updateDisplayOptions(displayOptions, searchFunnelContactProperties);

export async function executeSearchFunnelContact(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const contact_uuid = this.getNodeParameter('contact_uuid', 0, '') as string;
	const phone = this.getNodeParameter('phone', 0, '') as string;

	if (!contact_uuid && !phone) {
		throw new NodeApiError(this.getNode(), {
			message: 'You must provide either a Contact UUID or a Phone number to search',
		} as JsonObject);
	}

	const queryParams = new URLSearchParams();
	if (contact_uuid) queryParams.append('contact_uuid', contact_uuid);
	if (phone) queryParams.append('phone', phone);

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(this, 'wasapiApi', {
			method: 'GET',
			url: `${API_URL}/funnels/contacts/search?${queryParams.toString()}`,
			headers: { 'Content-Type': 'application/json' },
		});
		return [this.helpers.returnJsonArray(response)];
	} catch (error) {
		if (this.continueOnFail()) {
			return [this.helpers.returnJsonArray({ error: (error as Error).message })];
		}
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
