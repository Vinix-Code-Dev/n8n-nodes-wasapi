import {
	IDisplayOptions,
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeProperties,
	NodeApiError,
	JsonObject,
	updateDisplayOptions,
} from 'n8n-workflow';

import { TemplateValidator } from '../../validators/TemplateValidator';
import { API_URL } from '../../config/constants';
import { processTemplate } from '../../builder/processTemplate';
import { getTemplateFileType } from '../../helpers/filetype.helper';
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
	try {
		// get templateId correctly from the resourceLocator
		const templateIdParam = this.getNodeParameter('templateId', 0, '') as IDataObject | string;
		const template_id = typeof templateIdParam === 'string' ? templateIdParam : (templateIdParam?.value as string) || '';

		const baseData: IDataObject = {
			recipients: this.getNodeParameter('recipients', 0, '') as string,
			template_id,
			contact_type: 'phone' as 'phone' | 'contact',
			from_id: this.getNodeParameter('fromId', 0, '') as number,
			chatbot_status: this.getNodeParameter('chatbot_status', 0, '') as 'enable' | 'disable' | 'disable_permanently',
			conversation_status: this.getNodeParameter('conversation_status', 0, '') as 'open' | 'hold' | 'closed' | 'unchanged',
			agent_id: this.getNodeParameter('agent_id.value', 0, '') as number,
			origin: 'n8n',
		};

		// validate template variables
		const templateVars = this.getNodeParameter('template_vars', 0, {}) as IDataObject;
		TemplateValidator.validateTemplateVariables(templateVars);
		// process template variables
		const dynamicVars: IDataObject = {};
		const payload = processTemplate(templateVars, baseData, dynamicVars);
		// get file type
		if(payload.url_file) {
			payload.file = getTemplateFileType(payload.url_file as string);
		}

		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'wasapiApi',
			{
				method: 'POST',
				url: `${API_URL}/whatsapp-messages/send-template`,
				headers: {
					'Content-Type': 'application/json',
				},
				body: payload,
			}
		);
		return [this.helpers.returnJsonArray(response)];
	} catch (error) {
		if (this.continueOnFail()) {
			return [this.helpers.returnJsonArray({ error: (error as Error).message })];
		}
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}


