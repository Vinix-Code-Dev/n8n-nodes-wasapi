import {
    IDisplayOptions,
    IExecuteFunctions,
    INodeExecutionData,
    INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';


import { executeCommon } from '../../helpers/executeCommon.helper';
import { WasapiClient } from '@wasapi/js-sdk';
import { WhatsAppDTO } from '../../dto/WhatsAppDTO';
import { ServiceFactory } from '../../factories/ServiceFactory';
import { commonProperties } from '../base/common.operation';

export const sendTemplateProperties: INodeProperties[] = [
...commonProperties,
	{
		displayName: 'Template Name or ID',
		name: 'templateId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getTemplatesByPhone',
					searchable: true,
				},
			},
		],
		required: true,
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>. Click to search flows.',
	},
];

const displayOptions: IDisplayOptions = {
    show: {
        resource: ['whatsapp'],
        operation: ['sendTemplate'],
    },
};

export const sendTemplateDescription = updateDisplayOptions(displayOptions, sendTemplateProperties);

export async function executeSendTemplate(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await executeCommon.call(this, async (client: WasapiClient, item: any, i: number) => {
        const whatsAppService = ServiceFactory.whatsAppService(client);
        const templateData = WhatsAppDTO.sendTemplateFromExecuteFunctions(this, i);
           throw new Error('test');
        return await whatsAppService.sendTemplate(templateData);
    });
}
