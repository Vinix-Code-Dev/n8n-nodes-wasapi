import {
    IDisplayOptions,
    IExecuteFunctions,
    INodeExecutionData,
    INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';

import { commonProperties } from '../base/common.operation';
import { API_URL } from '../../config/constants';
export const sendMessageProperties: INodeProperties[] = [

    {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        default: '',
        required: true,
        description: 'Message to send',
    },
    ...commonProperties,
];

const displayOptions: IDisplayOptions = {
    show: {
        resource: ['whatsapp'],
        operation: ['sendMessage'],
    },
};

export const sendMessageDescription = updateDisplayOptions(displayOptions, sendMessageProperties);

export async function executeSendMessage(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    try {
			const wa_id = this.getNodeParameter('wa_id', 0, '') as string;
			const from_id = this.getNodeParameter('fromId', 0, '') as number;
			const message = this.getNodeParameter('message', 0, '') as string;
        const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'wasapiApi',
            {
                method: 'POST',
                url: `${API_URL}/whatsapp-messages`,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    from_id,
                    wa_id,
                    message,
                },
            }
        );
        return [this.helpers.returnJsonArray(response)];
    } catch (error) {
        if (this.continueOnFail()) {
            return [this.helpers.returnJsonArray({ error: error.message })];
        }
        throw new Error(`Error sending message: ${error.message}`);
    }
}
