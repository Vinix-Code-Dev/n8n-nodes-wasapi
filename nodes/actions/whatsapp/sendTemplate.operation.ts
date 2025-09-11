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
export const sendTemplateProperties: INodeProperties[] = [
	{
		displayName: 'Phone Wasapi Name or ID',
		name: 'fromId',
		type: 'options',
		typeOptions: {
				loadOptionsMethod: 'getWhatsappNumbers',
		},
		default: '',
		required: true,
		description: 'Pick the phone number of your wasapi account. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
},
{
		displayName: 'WhatsApp ID',
		name: 'recipients',
		type: 'string',
		default: '',
		required: true,
		description: 'Enter a phone number (including the country code without the + sign). For example instead of entering use 573203294920.',
},
	{
		displayName: 'Template Name or UUID',
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
	{
		displayName: 'Header Variables',
		name: 'header_vars',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Header Variable',
		default: {},
		description: 'Header template variables - only for templates with header variables',
		displayOptions: {
			show: {
				resource: ['whatsapp'],
				operation: ['sendTemplate'],
			},
			hide: {
				templateId: [''],
			},
		},
		options: [
			{
				displayName: 'Header Variable',
				name: 'header_vars',
				values: [
					{
						displayName: 'Variable Name or ID',
						name: 'name',
						type: 'options',
					typeOptions: {
						loadOptionsMethod: 'getHeaderVariables',
						loadOptionsDependsOn: ['templateId'],
					},
						default: '',
						description: 'Name of the header variable. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
					},
					{
						displayName: 'Variable Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value of the header variable',
					},
				],
			},
		],
	},
	{
		displayName: 'Body Variables',
		name: 'body_vars',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Body Variable',
		default: {},
		description: 'Body template variables - main message content variables',
		displayOptions: {
			show: {
				resource: ['whatsapp'],
				operation: ['sendTemplate'],
			},
			hide: {
				templateId: [''],
			},
		},
		options: [
			{
				displayName: 'Body Variable',
				name: 'body_vars',
				values: [
					{
						displayName: 'Variable Name or ID',
						name: 'name',
						type: 'options',
					typeOptions: {
						loadOptionsMethod: 'getBodyVariables',
						loadOptionsDependsOn: ['templateId'],
					},
						default: '',
						description: 'Name of the body variable. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
					},
					{
						displayName: 'Variable Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value of the body variable',
					},
				],
			},
		],
	},
	{
		displayName: 'CTA Variables',
		name: 'cta_vars',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add CTA Variable',
		default: {},
		description: 'CTA/Button template variables - for dynamic button content',
		displayOptions: {
			show: {
				resource: ['whatsapp'],
				operation: ['sendTemplate'],
			},
			hide: {
				templateId: [''],
			},
		},
		options: [
			{
				displayName: 'CTA Variable',
				name: 'cta_vars',
				values: [
					{
						displayName: 'Variable Name or ID',
						name: 'name',
						type: 'options',
					typeOptions: {
						loadOptionsMethod: 'getCtaVariables',
						loadOptionsDependsOn: ['templateId'],
					},
						default: '',
						description: 'Name of the CTA variable. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
					},
					{
						displayName: 'Variable Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value of the CTA variable',
					},
				],
			},
		],
	},
	{
		displayName: 'Footer Variables',
		name: 'footer_vars',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Footer Variable',
		default: {},
		description: 'Footer template variables - for footer section content',
		displayOptions: {
			show: {
				resource: ['whatsapp'],
				operation: ['sendTemplate'],
			},
			hide: {
				templateId: [''],
			},
		},
		options: [
			{
				displayName: 'Footer Variable',
				name: 'footer_vars',
				values: [
					{
						displayName: 'Variable Name or ID',
						name: 'name',
						type: 'options',
					typeOptions: {
						loadOptionsMethod: 'getFooterVariables',
						loadOptionsDependsOn: ['templateId'],
					},
						default: '',
						description: 'Name of the footer variable. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
					},
					{
						displayName: 'Variable Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value of the footer variable',
					},
				],
			},
		],
	},
	{
		displayName: 'Chatbot Status',
		name: 'chatbot_status',
		type: 'options',
		options: [
			{
				name: 'Enable',
				value: 'enable',
			},
			{
				name: 'Disable',
				value: 'disable',
			},
			{
				name: 'Disable Permanently',
				value: 'disable_permanently',
			},
		],
		default: 'enable',
		description: 'Control the chatbot status for this conversation',
		displayOptions: {
			show: {
				resource: ['whatsapp'],
				operation: ['sendTemplate'],
			},
		},
	},
	{
		displayName: 'Conversation Status',
		name: 'conversation_status',
		type: 'options',
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
			{
				name: 'Unchanged',
				value: 'unchanged',
			},
		],
		default: 'unchanged',
		description: 'Set the conversation status after sending the template',
		displayOptions: {
			show: {
				resource: ['whatsapp'],
				operation: ['sendTemplate'],
			},
		},
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
        return await whatsAppService.sendTemplate(templateData).catch((error: any) => {
            throw new Error(JSON.stringify(templateData, null, 2));
        });

    });
}
