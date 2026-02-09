import { IExecuteFunctions, INodeExecutionData, INodeProperties, updateDisplayOptions } from "n8n-workflow";
import { API_URL } from "../../config/constants";
export const getAllLabelsProperties: INodeProperties[] = [];

export const displayOptions = {
    show: {
        resource: ['labels'],
        operation: ['getAll'],
    },
};

export const getAllLabelsDescription = updateDisplayOptions(displayOptions, getAllLabelsProperties);

export async function executeGetAllLabels(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    try {
        const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'wasapiApi',
            {
                method: 'GET',
                url: `${API_URL}/labels`,
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
        throw new Error(`Error getting all labels: ${error.message}`);
    }
}
