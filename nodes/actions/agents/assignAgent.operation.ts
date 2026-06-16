import {
    IExecuteFunctions,
    IDisplayOptions,
    INodeExecutionData,
    INodeProperties,
    NodeApiError,
    JsonObject,
    updateDisplayOptions,
} from 'n8n-workflow';
import { commonProperties } from '../base/common.operation';
import { API_URL } from '../../config/constants';

export const assignAgentProperties: INodeProperties[] = [
	...commonProperties,
    {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        required: true,
        default: 'open',
        options: [
            {
                name: 'Open',
                value: 'open',
            },
            {
                name: 'Hold',
                value: 'hold',
            },
            {
                name: 'Closed',
                value: 'closed',
            },
        ],
        description: 'Select the chat status to assign to the conversation',
        displayOptions: {
            show: {
                resource: ['agents'],
                operation: ['assignAgent'],
            },
        },
    },
    {
        displayName: '(Optional) Agent',
        name: 'agent_id',
        type: 'resourceLocator',
        default: { mode: 'list', value: '' },
        description: '(Only if the status is open). Select the agent to which the change will be assigned.',
        displayOptions: {
            show: {
                resource: ['agents'],
                operation: ['assignAgent'],
            },
        },
        modes: [
            {
                displayName: 'Agent List',
                name: 'list',
                type: 'list',
                placeholder: 'Select an agent...',
                typeOptions: {
                    searchListMethod: 'getAgents',
                    searchable: true,
                },
            },
            {
                displayName: 'ID',
                name: 'id',
                type: 'string',
                placeholder: 'Enter agent ID',
            },
        ],
    },
    {
        displayName: '(Optional) Message',
        name: 'message',
        type: 'string',
        default: '',
        description: 'If the chat is being transferred, a note can be provided',
        displayOptions: {
            show: {
                resource: ['agents'],
                operation: ['assignAgent'],
            },
        },
    },
];

const displayOptions: IDisplayOptions = {
    show: {
        resource: ['agents'],
        operation: ['assignAgent'],
    },
};

export const assignAgentDescription = updateDisplayOptions(displayOptions, assignAgentProperties);


export async function executeAssignAgent(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

	const wa_id = this.getNodeParameter('wa_id', 0, '') as string;
	const from_id = this.getNodeParameter('fromId', 0, '') as number;
	const status = this.getNodeParameter('status', 0, 'open') as 'open' | 'hold' | 'closed';
	const message = this.getNodeParameter('message', 0, '') as string;
	const agent_id = this.getNodeParameter('agent_id.value', 0, '') as number;
	const origin = 'n8n' as const;

    try {
        const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'wasapiApi',
            {
                method: 'POST',
                url: `${API_URL}/whatsapp-messages/change-status`,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    from_id,
                    wa_id,
                    status,
                    message,
                    agent_id,
                    origin,
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
