import {
    IDisplayOptions,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';
import { commonProperties } from '../base/common.operation';
import { API_URL } from '../../config/constants';
import { getFileType } from '../../../wasapiClient/helpers/filetype.helper';

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
    try {
		const wa_id = this.getNodeParameter('wa_id', 0, '') as string;
		const from_id = this.getNodeParameter('fromId', 0, '') as number;
		const filePath = this.getNodeParameter('filePath', 0, '') as string;
		const caption = this.getNodeParameter('caption', 0, '') as string;
		// get file type
		const fileType = getFileType(filePath);
		// build payload
		const payload = {
			from_id,
			wa_id,
			file: fileType,
			[fileType]: filePath,
			...(caption ? { caption } : {}),
		};
        const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'wasapiApi',
            {
                method: 'POST',
                url: `${API_URL}/whatsapp-messages/attachment`,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: payload,
            }
        );
        return [this.helpers.returnJsonArray(response)];
    } catch (error) {
        if (this.continueOnFail()) {
            return [this.helpers.returnJsonArray({ error: error.message })];
        }
        throw new Error(`Error sending attachment: ${error.message}`);
    }
}
