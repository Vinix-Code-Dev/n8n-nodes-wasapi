import {
    IExecuteFunctions,
    IDisplayOptions,
    INodeExecutionData,
    INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';
import { API_URL } from '../../config/constants';

export const getAgentsProperties: INodeProperties[] = [];

const displayOptions: IDisplayOptions = {
    show: {
        resource: ['agents'],
        operation: ['get'],
    },
};

export const getAgentsDescription = updateDisplayOptions(displayOptions, getAgentsProperties);


export async function executeGetAgents(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    try {
        const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'wasapiApi',
            {
                method: 'GET',
                url: `${API_URL}/dashboard/metrics/online-agents`,
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
        throw new Error(`Error getting agents: ${error.message}`);
    }
}
