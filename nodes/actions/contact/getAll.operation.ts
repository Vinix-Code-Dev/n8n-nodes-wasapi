import {
    IExecuteFunctions,
    IDisplayOptions,
    INodeExecutionData,
    INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';

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
                url: 'https://api-ws.wasapi.io/api/v1/contacts',
                headers: {
                    'Content-Type': 'application/json',
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
