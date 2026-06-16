import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeApiError, JsonObject, updateDisplayOptions } from "n8n-workflow";
import { API_URL } from "../../config/constants";

export const updateCustomFieldProperties: INodeProperties[] = [
    {
        displayName: 'Custom Field ID',
        required: true,
        name: 'id',
        type: 'string',
        default: '',
        description: 'ID of the custom field to update',
    },
    {
        displayName: 'Field Name',
        required: true,
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name of the custom field',
    },
];

export const displayOptions = {
    show: {
        resource: ['customFields'],
        operation: ['update'],
    },
};

export const updateCustomFieldDescription = updateDisplayOptions(displayOptions, updateCustomFieldProperties);


export async function executeUpdateCustomField(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const id = this.getNodeParameter('id', 0, '') as number;
    const name = this.getNodeParameter('name', 0, '') as string;
    try {
        const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'wasapiApi',
            {
                method: 'PUT',
                url: `${API_URL}/custom-fields/${id}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: { name },
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
