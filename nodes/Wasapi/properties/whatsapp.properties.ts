import { INodeProperties } from 'n8n-workflow';
import { sendMessageDescription } from '../../actions/whatsapp/sendMessage.operation';
import { sendAttachmentDescription } from '../../actions/whatsapp/sendAttachment.operation';
import { sendFlowDescription } from '../../actions/whatsapp/sendFlow.operation';

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
		{
			name: 'Send Flow',
			value: 'sendFlow',
			description: 'Send a flow via WhatsApp',
			action: 'Send a flow',
		},
	],
	default: 'sendMessage',
};

export const whatsappProperties: INodeProperties[] = [
	whatsappOperations,
	...sendMessageDescription,
	...sendAttachmentDescription,
	...sendFlowDescription,
];
