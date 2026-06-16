import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeApiError, JsonObject, updateDisplayOptions } from "n8n-workflow";
import { API_URL } from '../../config/constants';

export const getContactProperties: INodeProperties[] = [
    {
        displayName: 'Phone Number',
        required: true,
        name: 'wa_id',
        type: 'string',
        default: '',
        description: 'Remember that the phone number must have the country code and NO SPACES. (eg: 573102938401 instead of +57 310 293 8401).',
    },
];

export const displayOptions = {
    show: {
        resource: ['contact'],
        operation: ['get'],
    },
};

export const getContactDescription = updateDisplayOptions(displayOptions, getContactProperties);


export async function executeGetContact(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'wasapiApi',
			{
				method: 'GET',
				url: `${API_URL}/contacts/${this.getNodeParameter('wa_id', 0, '') as string}`,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		return [this.helpers.returnJsonArray(response)];
	} catch (error) {
		if (this.continueOnFail()) {
			return [this.helpers.returnJsonArray({ error: (error as Error).message })];
		}
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
