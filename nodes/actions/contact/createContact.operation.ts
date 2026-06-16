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
import { ContactValidator } from '../../validators/ContactValidator';
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
        required: true,
        name: 'phone',
        type: 'string',
        default: '',
        description: 'Phone number of the contact',
    },
    {
        displayName: 'Notes',
        name: 'notes',
        type: 'string',
        default: '',
        description: 'Notes of the contact',
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
	const contactData = {
		first_name: this.getNodeParameter('first_name', 0, '') as string,
		last_name: this.getNodeParameter('last_name', 0, '') as string,
		email: this.getNodeParameter('email', 0, '') as string,
		phone: this.getNodeParameter('phone', 0, '') as string,
		notes: this.getNodeParameter('notes', 0, '') as string,
		labels: this.getNodeParameter('labels', 0, []) as number [],
		custom_fields: {},
	};

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
