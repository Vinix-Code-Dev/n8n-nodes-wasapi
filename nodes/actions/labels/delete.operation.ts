import { IExecuteFunctions, INodeExecutionData, INodeProperties, updateDisplayOptions } from "n8n-workflow";
import { API_URL } from "../../config/constants";

export const deleteProperties: INodeProperties[] = [
    {
        displayName: 'Label ID',
        required: true,
        name: 'id',
        type: 'string',
        default: '',
        description: 'ID of the label to delete',
    },
];

export const displayOptions = {
    show: {
        resource: ['labels'],
        operation: ['delete'],
    },
};

export const deleteDescription = updateDisplayOptions(displayOptions, deleteProperties);

export async function executeDeleteLabel(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const id = this.getNodeParameter('id', 0, '') as string;
    try {
        const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'wasapiApi',
            {
                method: 'DELETE',
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
        throw new Error(`Error deleting label: ${error.message}`);
    }
}
