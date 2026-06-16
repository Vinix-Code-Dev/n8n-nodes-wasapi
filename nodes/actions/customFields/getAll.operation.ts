import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeApiError, JsonObject, updateDisplayOptions } from "n8n-workflow";
import { API_URL } from "../../config/constants";

export const getAllCustomFieldsProperties: INodeProperties[] = [];

export const displayOptions = {
    show: {
        resource: ['customFields'],
        operation: ['getAll'],
    },
};

export const getAllCustomFieldsDescription = updateDisplayOptions(displayOptions, getAllCustomFieldsProperties);

export async function executeGetAllCustomFields(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    try {
        const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'wasapiApi',
            {
                method: 'GET',
                url: `${API_URL}/custom-fields`,
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
