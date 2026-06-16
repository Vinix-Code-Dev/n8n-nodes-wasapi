import { IDisplayOptions, IExecuteFunctions, INodeExecutionData, INodeProperties, NodeApiError, JsonObject, updateDisplayOptions } from "n8n-workflow";
import { commonProperties } from "../base/common.operation";
import { API_URL } from "../../config/constants";

export const sendFlowProperties: INodeProperties[] = [

	...commonProperties,
	{
		displayName: 'Flow Name or ID',
		name: 'flowId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getFlows',
					searchable: true,
				},
			},
		],
		required: true,
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>. Click to search flows.',
	},
	{
		displayName: 'Screen Principal Name or ID',
		name: 'screen',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getScreens',
					searchable: true,
				},
			},
		],
		required: true,
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>. Click to search screens.',
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		default: '',
		required: true,
	},
	{
		displayName: 'Call to Action',
		name: 'cta',
		type: 'string',
		default: '',
		required: true,
	},
];

const displayOptions: IDisplayOptions = {
	show: {
		resource: ['whatsapp'],
		operation: ['sendFlow'],
	},
};

export const sendFlowDescription = updateDisplayOptions(displayOptions, sendFlowProperties);


export async function executeSendFlow(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    try {
					const fromIdParam = this.getNodeParameter('fromId', 0, '') as number;
					const phone_id = typeof fromIdParam === 'string' ? parseInt(fromIdParam, 10) : fromIdParam as number;
					const wa_id = this.getNodeParameter('wa_id', 0, '') as string;
					const flow_id = this.getNodeParameter('flowId.value', 0, '') as string;
					const message = this.getNodeParameter('message', 0, '') as string;
					const cta = this.getNodeParameter('cta', 0, '') as string;
					const screen = this.getNodeParameter('screen.value', 0, '') as string;

        	const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'wasapiApi',
            {
                method: 'POST',
                url: `${API_URL}/whatsapp-flows`,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    phone_id,
                    wa_id,
                    flow_id,
                    message,
                    cta,
                    screen,
										action: 'navigate',
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
