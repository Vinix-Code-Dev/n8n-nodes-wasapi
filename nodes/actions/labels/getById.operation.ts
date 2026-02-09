import { IExecuteFunctions, INodeExecutionData, INodeProperties, updateDisplayOptions } from "n8n-workflow";
import { API_URL } from "../../config/constants";

export const getByIdProperties: INodeProperties[] = [
    {
        displayName: 'Label ID',
        required: true,
        name: 'id',
        type: 'string',
        default: '',
        description: 'ID of the label to retrieve',
    },
];

export const displayOptions = {
    show: {
        resource: ['labels'],
        operation: ['getById'],
    },
};

export const getByIdDescription = updateDisplayOptions(displayOptions, getByIdProperties);

export async function executeGetByIdLabel(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const id = this.getNodeParameter('id', 0, '') as string;
    try {
        const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'wasapiApi',
            {
                method: 'GET',
                url: `${API_URL}/labels/${id}`,
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
        throw new Error(`Error getting label by id: ${error.message}`);
    }
}
