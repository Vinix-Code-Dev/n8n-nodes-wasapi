import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodeApiError, JsonObject, updateDisplayOptions } from "n8n-workflow";


export const createCustomFieldProperties: INodeProperties[] = [
    {
        displayName: 'Field Name',
        required: true,
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name of the custom field',
    }
];

export const displayOptions = {
    show: {
        resource: ['customFields'],
        operation: ['create'],
    },
};

export const createCustomFieldDescription = updateDisplayOptions(displayOptions, createCustomFieldProperties);



export async function executeCreateCustomField(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const name = this.getNodeParameter('name', 0, '') as string;
  try {
    const response = await this.helpers.httpRequestWithAuthentication.call(
      this,
      'wasapiApi',
      {
        method: 'POST',
        url: 'https://api-ws.wasapi.io/api/v1/custom-fields',
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
