import {
    IExecuteFunctions,
    IDisplayOptions,
    INodeExecutionData,
    INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';
import { API_URL } from '../../config/constants';
import { commonProperties } from '../base/common.operation';

export const toggleBotProperties: INodeProperties[] = [
    ...commonProperties,
    {
        displayName: 'Action',
        required: true,
        name: 'action',
        type: 'options',
        options: [
            {
                name: 'Enable',
                value: 'enable',
                description: 'Enable the bot for this contact',
                action: 'Enable the bot for this contact',
            },
            {
                name: 'Disable',
                value: 'disable',
                description: 'Disable the bot for this contact',
                action: 'Disable the bot for this contact',
            },
            {
                name: 'Disable Permanently',
                value: 'disable_permanently',
                description: 'Permanently disable the bot for this contact',
                action: 'Permanently disable the bot for this contact',
            },
        ],
        default: 'enable',
    },
];

const displayOptions: IDisplayOptions = {
    show: {
        resource: ['contact'],
        operation: ['toggleBot'],
    },
};

export const toggleBotDescription = updateDisplayOptions(displayOptions, toggleBotProperties);


export async function executeToggleBot(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const wa_id = this.getNodeParameter('wa_id', 0, '') as string;
	const action = this.getNodeParameter('action', 0, 'enable') as string;
	const from_id = this.getNodeParameter('fromId', 0, '') as number;
	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'wasapiApi',
			{
				method: 'POST',
				url: `${API_URL}/contacts/${wa_id}/toggle-bot`,
				headers: {
					'Content-Type': 'application/json',
				},
				body: {
					action,
					from_id
				},
			}
		);
		return [this.helpers.returnJsonArray(response)];
	} catch (error) {
		if (this.continueOnFail()) {
			return [this.helpers.returnJsonArray({ error: error.message })];
		}
		throw error;
	}
}
