import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { WasapiBase } from '../WasapiBase.js';

export class WasapiCreateContact extends WasapiBase implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wasapi Create Contact',
		name: 'wasapiCreateContact',
		icon: 'file:wasapi.svg',
		group: ['transform'],
		version: 1,
		description: 'Create contacts using Wasapi',
		defaults: {
			name: 'Wasapi Create Contact',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: this.getCommonCredentials(),
		requestDefaults: {
			baseURL: this.getUrlApi(),
		},
		properties: [
			{
				displayName: 'First Name',
				required: true,
				name: 'first_name',
				type: 'string',
				default: '',
				description: 'First name of the contact',
			},
			{
				displayName: 'Last Name',
				required: false,
				name: 'last_name',
				type: 'string',
				default: '',
				description: 'Last name of the contact',
			}, {
				displayName: 'Email Address',
				required: false,
				name: 'email',
				type: 'string',
				default: '',
				description: 'Email address of the contact',
			},
			{
				displayName: 'Phone Number',
				required: true,
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number of the contact',
			},

			{
				displayName: 'Notes',
				required: false,
				name: 'notes',
				type: 'string',
				default: '',
				description: 'Notes of the contact',
			},
			{
				displayName: 'Label',
				name: 'labels',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getLabels',
				},
				default: '',
				description: 'Label of the contact',
			},
		],

	};

	methods = {
		loadOptions: {
			getLabels: this.getLabels,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return await super.executeCommon(async (client: any, item: any, i: number) => {
			const first_name = this.getNodeParameter('first_name', i) as string;
			const last_name = this.getNodeParameter('last_name', i) as string;
			const email = this.getNodeParameter('email', i) as string;
			const phone = this.getNodeParameter('phone', i) as string;
			const notes = this.getNodeParameter('notes', i) as string;
			const labels = this.getNodeParameter('labels', i) as string[];
			return await client.contacts.create({
				first_name,
				last_name,
				email,
				phone,
				notes,
				labels
			});
		});
	}
}
