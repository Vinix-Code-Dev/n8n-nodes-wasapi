import {
    IDisplayOptions,
    IExecuteFunctions,
    INodeExecutionData,
    INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';


import { executeCommon } from '../../helpers/executeCommon.helper';
import { WasapiClient } from '../../../wasapiClient';
import { WhatsAppDTO } from '../../dto/WhatsAppDTO';
import { ServiceFactory } from '../../factories/ServiceFactory';
import { TemplateValidator } from '../../validators/TemplateValidator';
export const sendTemplateProperties: INodeProperties[] = [
	{
		// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
		displayName: 'Sender Phone Number',
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
		displayName: 'Recipient WhatsApp ID',
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
		displayName: 'Template Variables will appear automatically below after selecting a template. Only add the variables you actually need.',
		name: 'template_variables_guide',
		type: 'notice',
		default: '',
	},
	{
		displayName: 'Template Variables',
		name: 'template_vars',
		required: true,
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Template Variable',
		default: {},
		description: 'All available template variables - automatically shows only variables that exist in the selected template',
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
				displayName: 'Template Variable',
				name: 'template_vars',
				values: [
					{
						displayName: 'Variable Name or ID',
						name: 'name',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getAllTemplateVariables',
							loadOptionsDependsOn: ['templateId'],
						},
						default: '',
						description: 'Select a template variable. Only variables available in the selected template will be shown. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
					},
					{
						displayName: 'Variable Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value for the selected template variable',
					},
				],
			},
		],
	},
	{
		displayName: '(Optional) Chatbot Status',
		name: 'chatbot_status',
		type: 'options',
		options: [
			{
				name: 'Enable',
				value: 'enable',
			},
			{
				name: 'Disable For 24 Hours',
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
		displayName: '(Optional) Conversation Status',
		name: 'conversation_status',
		type: 'options',
		options: [
			{
				name: 'Open',
				value: 'open',
			},
			{
				name: 'On Hold',
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
	{
		displayName: '(Optional) Assign Conversation to an Agent',
		name: 'agent_id',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		description: '(Only if the status is open). Select the agent to which the change will be assigned.',
		displayOptions: {
			show: {
				resource: ['whatsapp'],
				operation: ['sendTemplate'],
			},
		},
		modes: [
			{
				displayName: 'Agent List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getAgents',
					searchable: true,
				},
			},
		],

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
			const { template_vars, ...payload } = templateData;
			// validate template variables
			TemplateValidator.validateTemplateVariables(template_vars);

        return await whatsAppService.sendTemplate(payload).catch((error: any) => {
            throw new Error(error.message);
        });

    });
}
