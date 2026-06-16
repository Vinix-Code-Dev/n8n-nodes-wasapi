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

export const getAllContactsProperties: INodeProperties[] = [];

const displayOptions: IDisplayOptions = {
    show: {
        resource: ['contact'],
        operation: ['getAll'],
    },
};

export const getAllContactsDescription = updateDisplayOptions(displayOptions, getAllContactsProperties);

export async function executeGetAllContacts(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

    try {
        const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'wasapiApi',
            {
                method: 'GET',
                url: `${API_URL}/contacts`,
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
