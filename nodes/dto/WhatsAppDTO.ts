import { IExecuteFunctions } from 'n8n-workflow';
import { SendMessage, SendAttachmentParams, SendFlow } from '@laiyon/wasapi-sdk';

export class WhatsAppDTO {
	static messageFromExecuteFunctions(executeFunctions: IExecuteFunctions, index: number): SendMessage {
		return {
			wa_id: executeFunctions.getNodeParameter('wa_id', index) as string,
			from_id: executeFunctions.getNodeParameter('fromId', index) as number,
			message: executeFunctions.getNodeParameter('message', index) as string,
		};
	}

	static attachmentFromExecuteFunctions(executeFunctions: IExecuteFunctions, index: number): SendAttachmentParams {
		return {
			wa_id: executeFunctions.getNodeParameter('wa_id', index) as string,
			from_id: executeFunctions.getNodeParameter('fromId', index) as number,
			filePath: executeFunctions.getNodeParameter('filePath', index) as string,
			caption: executeFunctions.getNodeParameter('caption', index) as string,
		};
	}

	static flowFromExecuteFunctions(executeFunctions: IExecuteFunctions, index: number): SendFlow {
		return {
			wa_id: executeFunctions.getNodeParameter('wa_id', index) as string,
			phone_id: executeFunctions.getNodeParameter('fromId', index) as number,
			flow_id: executeFunctions.getNodeParameter('flowId', index) as string,
			message: executeFunctions.getNodeParameter('message', index) as string,
			cta: executeFunctions.getNodeParameter('cta', index) as string,
			screen: executeFunctions.getNodeParameter('screen', index) as string,
		};
	}
}
