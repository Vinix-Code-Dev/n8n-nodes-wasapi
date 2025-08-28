import {
    IExecuteFunctions,
    IDisplayOptions,
    INodeExecutionData,
    INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';
import { executeCommon } from '../../helpers/executeCommon.helper';
import { ContactDTO } from '../../dto/ContactDTO';
import { ServiceFactory } from '../../factories/ServiceFactory';
export const updateContactProperties: INodeProperties[] = [
    {
        displayName: 'Phone Number',
        required: true,
        name: 'wa_id',
        type: 'string',
        default: '',
        description: 'Remember that the phone number must have the country code and NO SPACES. (eg: 573102938401 instead of +57 310 293 8401).',
    },
    {
        displayName: 'First Name',
        required: false,
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
        operation: ['update'],
    },
};

export const updateContactDescription = updateDisplayOptions(displayOptions, updateContactProperties);

export async function executeContactUpdate(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await executeCommon.call(this, async (client: any, item: any, i: number) => {
        const contactService = ServiceFactory.contactService(client);
        const wa_id = ContactDTO.getById(this, i);
        const contactData = ContactDTO.update(this, i);
        
        // Obtener y validar custom fields
        const customFieldsData = this.getNodeParameter('custom_fields', i) as any;
        contactData.custom_fields = contactService.validateCustomFields(customFieldsData);

        return await contactService.updateContact(wa_id, contactData);
    });
}