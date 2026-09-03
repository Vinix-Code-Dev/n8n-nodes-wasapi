import {
    IExecuteFunctions,
    IDisplayOptions,
    INodeExecutionData,
    IDataObject,
    INodeProperties,
    NodeApiError,
    JsonObject,
    updateDisplayOptions,
} from 'n8n-workflow';
import { ContactValidator, ContactData } from '../../validators/ContactValidator';
import { API_URL } from '../../config/constants';
export const contactCreateProperties: INodeProperties[] = [
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
        name: 'last_name',
        type: 'string',
        default: '',
        description: 'Last name of the contact',
    },
    {
        displayName: 'Email Address',
				placeholder: 'name@email.com',
        name: 'email',
        type: 'string',
        default: '',
        description: 'Email address of the contact',
    },
    {
        displayName: 'Phone Number',
        name: 'phone',
        required: true,
        type: 'string',
        default: '',
        description: 'Phone number of the contact',
    },
    {
        displayName: 'Country Code',
        name: 'country_code',
        type: 'string',
        default: '',
        placeholder: 'us',
        description: 'Country code of the contact (eg: us, co)',
    },
    {
        displayName: 'WhatsApp Username',
        name: 'wa_username',
        type: 'string',
        default: '',
        description: 'Public WhatsApp username of the contact. Only written when a non-empty value is sent; leaving it empty keeps the current one.',
    },
    {
        displayName: 'Notes',
        name: 'notes',
        type: 'string',
        default: '',
        description: 'Notes of the contact',
    },
    {
        displayName: 'Blocked',
        name: 'blocked',
        type: 'boolean',
        default: false,
        description: 'Whether the contact is blocked',
    },
    {
        displayName: 'Unsubscribed',
        name: 'unsubscribed',
        type: 'boolean',
        default: false,
        description: 'Whether the contact is unsubscribed',
    },
    {
        displayName: 'Labels Names or IDs',
        name: 'labels',
        type: 'multiOptions',
        typeOptions: {
            loadOptionsMethod: 'getLabels',
        },
        default: [],
        description: 'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
                        displayName: 'Field Name or ID',
                        name: 'field_name',
                        type: 'options',
                        typeOptions: {
                            loadOptionsMethod: 'getCustomFields',
                        },
                        default: '',
                        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
];

const displayOptions: IDisplayOptions = {
    show: {
        resource: ['contact'],
        operation: ['create'],
    },
};

export const createContactDescription = updateDisplayOptions(displayOptions, contactCreateProperties);


export async function executeContactCreate(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const contactData: ContactData = {
		first_name: this.getNodeParameter('first_name', 0, '') as string,
		last_name: this.getNodeParameter('last_name', 0, '') as string,
		email: this.getNodeParameter('email', 0, '') as string,
		phone: this.getNodeParameter('phone', 0, '') as string,
		notes: this.getNodeParameter('notes', 0, '') as string,
		labels: this.getNodeParameter('labels', 0, []) as number [],
		blocked: this.getNodeParameter('blocked', 0, false) as boolean,
		unsubscribed: this.getNodeParameter('unsubscribed', 0, false) as boolean,
		custom_fields: {},
	};

	// Optional identifiers/fields: only sent when provided, to avoid overwriting existing data
	const country_code = this.getNodeParameter('country_code', 0, '') as string;
	const wa_username = this.getNodeParameter('wa_username', 0, '') as string;
	if (country_code) contactData.country_code = country_code;
	if (wa_username) contactData.wa_username = wa_username;

	const customFieldsData = this.getNodeParameter('custom_fields', 0, {}) as IDataObject;
	contactData.custom_fields = ContactValidator.validateCustomFields(customFieldsData);

	ContactValidator.validateCreateContact(contactData);
	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'wasapiApi',
			{
				method: 'POST',
				url: `${API_URL}/contacts`,
				headers: {
					'Content-Type': 'application/json',
				},
				body: contactData,
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
