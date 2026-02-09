import { IExecuteFunctions, INodeExecutionData, INodeProperties, updateDisplayOptions } from "n8n-workflow";
import { API_URL } from "../../config/constants";

export const getSearchProperties: INodeProperties[] = [
    {
        displayName: 'Name',
        required: true,
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name exactly of the label to search for',
    },
];

export const displayOptions = {
    show: {
        resource: ['labels'],
        operation: ['getSearch'],
    },
};

export const getSearchDescription = updateDisplayOptions(displayOptions, getSearchProperties);


export async function executeGetSearchLabel(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const name = this.getNodeParameter('name', 0, '') as string;
    try {
        const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'wasapiApi',
            {
                method: 'POST',
                url: `${API_URL}/labels/search`,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: { name },
            }
        );
        return [this.helpers.returnJsonArray(response)];
    } catch (error) {
        if (this.continueOnFail()) {
            return [this.helpers.returnJsonArray({ error: error.message })];
        }
        throw new Error(`Error getting search labels: ${error.message}`);
    }
}
