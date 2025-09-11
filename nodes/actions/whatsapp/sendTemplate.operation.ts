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
						loadOptionsMethod: 'getHeaderVariablesOptimized',
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
						loadOptionsMethod: 'getBodyVariablesOptimized',
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
						loadOptionsMethod: 'getCtaVariablesOptimized',
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
						loadOptionsMethod: 'getFooterVariablesOptimized',
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
