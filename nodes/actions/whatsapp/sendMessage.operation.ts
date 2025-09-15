import {
    IDisplayOptions,
    IExecuteFunctions,
    INodeExecutionData,
    INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';

import { commonProperties } from '../base/common.operation';
import { executeCommon } from '../../helpers/executeCommon.helper';
import { WasapiClient } from '../../../wasapiClient';
import { WhatsAppDTO } from '../../dto/WhatsAppDTO';
import { ServiceFactory } from '../../factories/ServiceFactory';

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
    return await executeCommon.call(this, async (client: WasapiClient, item: any, i: number) => {
        const whatsAppService = ServiceFactory.whatsAppService(client);
        const messageData = WhatsAppDTO.messageFromExecuteFunctions(this, i);

        return await whatsAppService.sendMessage(messageData);
    });
}

