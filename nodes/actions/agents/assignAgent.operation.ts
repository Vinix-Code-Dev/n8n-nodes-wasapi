import {
    IExecuteFunctions,
    IDisplayOptions,
    INodeExecutionData,
    INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';
import { executeCommon } from '../../helpers/executeCommon.helper';
import { ServiceFactory } from '../../factories/ServiceFactory';
import { commonProperties } from '../base/common.operation';
import { WasapiClient } from '@laiyon/wasapi-sdk';
import { WhatsAppDTO } from '../../dto/WhatsAppDTO';

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
        required: true,
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
    return await executeCommon.call(this, async (client: WasapiClient, item: any, i: number) => {
        const agentsService = ServiceFactory.agentsService(client);
        const changeStatusData = WhatsAppDTO.changeStatusFromExecuteFunctions(this, i);
        return await agentsService.changeStatus(changeStatusData);
    });
}
