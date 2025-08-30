import {
    IExecuteFunctions,
    IDisplayOptions,
    INodeExecutionData,
    INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';
import { executeCommon } from '../../helpers/executeCommon.helper';
import { ContactDTO } from '../../dto/ContactDTO';
import { ServiceFactory } from '../../factories/ServiceFactory';
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
    return await executeCommon.call(this, async (client: any, item: any, i: number) => {
        const contactService = ServiceFactory.contactService(client);
        const wa_id = ContactDTO.getById(this, i);
        const data = ContactDTO.toggleBot(this, i);
        return await contactService.toggleBotStatus(wa_id, data);
    });
}
