import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription
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
				displayName: 'Labels',
				name: 'labels',
				required: false,
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getLabels',
				},
				default: '',
				description: 'Label of the contact',
			},
			{
				displayName: 'Custom Fields',
				name: 'custom_fields',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				description: 'Custom fields to assign to the contact',
				options: [
					{
						name: 'custom_fields',
						displayName: 'Custom Fields',
						values: [
							{
								displayName: 'Field Name',
								name: 'field_name',
								type: 'options',
								typeOptions: {
									loadOptionsMethod: 'getCustomFields',
								},
								default: '',
								description: 'Select the custom field',
								required: true,
							},
							{
								displayName: 'Field Value',
								name: 'field_value',
								type: 'string',
								default: '',
								description: 'Value for the custom field',
								required: true,
							},
						],
					},
				],
			},
		],

	};

	methods = {
		loadOptions: {
			getLabels: this.getLabels,
			getCustomFields: this.getCustomFields,
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
			
			// Obtener custom fields
			const customFieldsData = this.getNodeParameter('custom_fields', i) as any;
			let custom_fields: Record<string, any> = {};

			if (customFieldsData && customFieldsData.custom_fields && Array.isArray(customFieldsData.custom_fields)) {
				const seen = new Set<string>();
				
				customFieldsData.custom_fields.forEach((field: any) => {
					if (field.field_name && field.field_value) {
						if (seen.has(field.field_name)) {
							throw new Error(`The custom field "${field.field_name}" is duplicated. Each field can only be defined once.`);
						}
						seen.add(field.field_name);
						custom_fields[field.field_name] = field.field_value;
					}
				});
			}

			return await client.contacts.create({
				first_name,
				last_name,
				email,
				phone,
				notes,
				labels,
				custom_fields
			});
		});
	}
}
