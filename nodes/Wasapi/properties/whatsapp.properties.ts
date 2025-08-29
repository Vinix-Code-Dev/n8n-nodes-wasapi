import { INodeProperties } from 'n8n-workflow';
import { sendMessageDescription } from '../../actions/whatsapp/sendMessage.operation';
import { sendAttachmentDescription } from '../../actions/whatsapp/sendAttachment.operation';

export const whatsappOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['whatsapp'],
		},
	},
	options: [
		{
			name: 'Send Message',
			value: 'sendMessage',
			description: 'Send a text message via WhatsApp',
			action: 'Send a text message',
		},
		{
			name: 'Send Attachment',
			value: 'sendAttachment',
			description: 'Send a file or media via WhatsApp',
			action: 'Send a file or media',
		},
	],
	default: 'sendMessage',
};

export const whatsappProperties: INodeProperties[] = [
	whatsappOperations,
	...sendMessageDescription,
	...sendAttachmentDescription,
];
