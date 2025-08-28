import {
    IExecuteFunctions,
    IDisplayOptions,
    INodeExecutionData,
    INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';
import { executeCommon } from '../../helpers/executeCommon.helper';
import { WasapiClient } from '@laiyon/wasapi-sdk';
import { ContactDTO } from '../../dto/ContactDTO';
import { ServiceFactory } from '../../factories/ServiceFactory';

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
        required: false,
        name: 'last_name',
        type: 'string',
        default: '',
        description: 'Last name of the contact',
    },
    {
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
        default: [],
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
];

const displayOptions: IDisplayOptions = {
    show: {
        resource: ['contact'],
        operation: ['create'],
    },
};

export const createContactDescription = updateDisplayOptions(displayOptions, contactCreateProperties);

export async function executeContactCreate(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await executeCommon.call(this, async (client: WasapiClient, item: any, i: number) => {
        const contactService = ServiceFactory.createContactService(client);
        const contactData = ContactDTO.fromExecuteFunctions(this, i);
        
        // Obtener y validar custom fields
        const customFieldsData = this.getNodeParameter('custom_fields', i) as any;
        contactData.custom_fields = contactService.validateCustomFields(customFieldsData);

        return await contactService.createContact(contactData);
    });
} 