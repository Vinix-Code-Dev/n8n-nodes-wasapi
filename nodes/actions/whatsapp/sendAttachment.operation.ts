import {
    IDisplayOptions,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';
import { commonProperties } from '../base/common.operation';
import { executeCommon } from '../../helpers/executeCommon.helper';
import { WasapiClient } from '@laiyon/wasapi-sdk';
import { WhatsAppDTO } from '../../dto/WhatsAppDTO';
import { ServiceFactory } from '../../factories/ServiceFactory';

export const sendAttachmentProperties: INodeProperties[] = [

			{
				displayName: 'File Path',
				name: 'filePath',
				type: 'string',
				default: '',
				required: true,
				description: 'URL or path of the file to send',
			},
			{
				displayName: 'Caption',
				name: 'caption',
				type: 'string',
				default: '',
				description: 'Description of the file (optional)',
			},
			...commonProperties,
		];


        const displayOptions: IDisplayOptions = {
            show: {
                resource: ['whatsapp'],
                operation: ['sendAttachment'],
            },
        };

        export const sendAttachmentDescription = updateDisplayOptions(displayOptions, sendAttachmentProperties);



export async function executeSendAttachment(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return await executeCommon.call(this, async (client: WasapiClient, item: any, i: number) => {
			const whatsAppService = ServiceFactory.whatsAppService(client);
			const attachmentData = WhatsAppDTO.attachmentFromExecuteFunctions(this, i);

			return await whatsAppService.sendAttachment(attachmentData);
		});
	}
