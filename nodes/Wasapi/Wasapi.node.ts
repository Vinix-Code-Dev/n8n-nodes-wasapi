import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { createContactDescription } from '../actions/contact/createContact.operation';
import { sendMessageDescription } from '../actions/whatsapp/sendMessage.operation';
import { sendAttachmentDescription } from '../actions/whatsapp/sendAttachment.operation';
import { getLabels } from '../helpers/getLabels.helper';
import { getCustomFields } from '../helpers/getCustomFields.helper';
import { getWhatsappNumbers } from '../helpers/getWhatsappNumbers.helper';
import { OperationFactory } from '../factories/OperationFactory';
import { getContactDescription } from '../actions/contact/getContact.operation';
import { deleteContactDescription } from '../actions/contact/deleteContact.operation';
import { updateContactDescription } from '../actions/contact/updateContact.operation';
import { getAllLabelsDescription } from '../actions/labels/getLabels.operation';
import { getSearchDescription } from '../actions/labels/getSearch.operation';
import { getByIdDescription } from '../actions/labels/getById.operation';
import { createDescription } from '../actions/labels/create.operation';
import { updateDescription } from '../actions/labels/update.operation';
import { deleteDescription } from '../actions/labels/delete.operation';

export class Wasapi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wasapi',
		name: 'wasapi',
		icon: 'file:wasapi.svg',
		group: ['transform'],
		version: 1,
		description: 'Interact with Wasapi API - Manage contacts and send WhatsApp messages',
		defaults: {
			name: 'Wasapi',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'wasapiApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api-ws.wasapi.io/api/v1',
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Contact',
						value: 'contact',
						description: 'Manage contacts',
						action: 'Manage contacts',
					},
					{
						name: 'WhatsApp',
						value: 'whatsapp',
						description: 'Send WhatsApp messages and attachments',
						action: 'Send WhatsApp messages',
					},
					{
						name: 'Labels',
						value: 'labels',
						description: 'Manage labels',
						action: 'Manage labels',
					},
				],
				default: 'contact',
			},
			// Contact Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['contact'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new contact',
						action: 'Create a new contact',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a contact',
						action: 'Get a contact',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a contact',
						action: 'Delete a contact',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a contact',
						action: 'Update a contact',
					},
				],
				default: 'create',
			},
			// WhatsApp Operations
			{
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
			},
			// Labels Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['labels'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all labels',
						action: 'Get all labels',
					},
					{
						name: 'Get Search',
						value: 'getSearch',
						description: 'Search labels by name',
						action: 'Search labels by name',
					},
					{
						name: 'Get By ID',
						value: 'getById',
						description: 'Get a label by ID',
						action: 'Get a label by ID',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new label',
						action: 'Create a new label',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a label',
						action: 'Update a label',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a label',
						action: 'Delete a label',
					},
				],
				default: 'getAll',
			},
			// Contact Create Properties
          ...createContactDescription,
			// Contact Get Properties
			...getContactDescription,
			// Contact Delete Properties
			...deleteContactDescription,
			// Contact Update Properties
			...updateContactDescription,
			// WhatsApp Send Message Properties
			...sendMessageDescription,
			// WhatsApp Send Attachment Properties
			...sendAttachmentDescription,
			// Labels Get All Properties
			...getAllLabelsDescription,
			// Labels Get Search Properties
			...getSearchDescription,
			// Labels Get By ID Properties
			...getByIdDescription,
			// Labels Create Properties
			...createDescription,
			// Labels Update Properties
			...updateDescription,
			// Labels Delete Properties
			...deleteDescription,
		],
	};

	methods = {
		loadOptions: {
			getLabels: getLabels,
			getCustomFields: getCustomFields,
			getWhatsappNumbers: getWhatsappNumbers,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const operationHandler = OperationFactory.getOperation(resource, operation);
		
		if (operationHandler) {
			return await operationHandler.execute.call(this);
		}

		throw new Error(`Resource "${resource}" with operation "${operation}" is not supported`);
	}

}
