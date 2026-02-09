import {
    IExecuteFunctions,
    IDisplayOptions,
    INodeExecutionData,
    INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';
import { API_URL } from '../../config/constants';

export const getUserProperties: INodeProperties[] = [];

const displayOptions: IDisplayOptions = {
    show: {
        resource: ['user'],
        operation: ['get'],
    },
};

export const getUserDescription = updateDisplayOptions(displayOptions, getUserProperties);

export async function executeGetUser(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    try {
        const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'wasapiApi',
            {
                method: 'GET',
                url: `${API_URL}/user`,
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
        throw new Error(`Error getting user: ${error.message}`);
    }
}

