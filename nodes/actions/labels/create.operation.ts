import { IExecuteFunctions, INodeExecutionData, INodeProperties, updateDisplayOptions } from "n8n-workflow";
import { API_URL } from "../../config/constants";

export const createProperties: INodeProperties[] = [
    {
        displayName: 'Title',
        required: true,
        name: 'title',
        type: 'string',
        default: '',
        description: 'Title of the label',
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the label',
    },
    {
        displayName: 'Color',
        required: true,
        name: 'color',
        type: 'color',
        default: '#000000',
        description: 'Color of the label (hex format)',
    },
];

export const displayOptions = {
    show: {
        resource: ['labels'],
        operation: ['create'],
    },
};

export const createDescription = updateDisplayOptions(displayOptions, createProperties);

export async function executeCreateLabel(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const title = this.getNodeParameter('title', 0, '') as string;
    const description = this.getNodeParameter('description', 0, '') as string;
    const color = this.getNodeParameter('color', 0, '') as string;
    try {
        const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'wasapiApi',
            {
                method: 'POST',
                url: `${API_URL}/labels`,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: { title, description, color },
            }
        );
        return [this.helpers.returnJsonArray(response)];
    } catch (error) {
        if (this.continueOnFail()) {
            return [this.helpers.returnJsonArray({ error: error.message })];
        }
        throw new Error(`Error creating label: ${error.message}`);
    }
}
