import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeApiError, JsonObject, updateDisplayOptions } from "n8n-workflow";
import { API_URL } from "../../config/constants";

export const deleteCustomFieldProperties: INodeProperties[] = [
    {
        displayName: 'Custom Field ID',
        required: true,
        name: 'id',
        type: 'string',
        default: '',
        description: 'ID of the custom field to delete',
    },
];

export const displayOptions = {
    show: {
        resource: ['customFields'],
        operation: ['delete'],
    },
};

export const deleteCustomFieldDescription = updateDisplayOptions(displayOptions, deleteCustomFieldProperties);



export async function executeDeleteCustomField(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const id = this.getNodeParameter('id', 0, '') as string;
    try {
        const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'wasapiApi',
            {
                method: 'DELETE',
                url: `${API_URL}/custom-fields/${id}`,
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
