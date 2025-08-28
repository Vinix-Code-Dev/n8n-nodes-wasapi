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
import { contactCreateProperties } from './createContact.operation';

export const updateContactProperties: INodeProperties[] = [
    {
        displayName: 'WhatsApp Number',
        required: true,
        name: 'wa_id',
        type: 'string',
        default: '',
        description: 'Remember that the phone number must have the country code and NO SPACES. (eg: 573102938401 instead of +57 310 293 8401).',
    },
    ...contactCreateProperties
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
        const contactData = ContactDTO.create(this, i);
        
        // Obtener y validar custom fields
        const customFieldsData = this.getNodeParameter('custom_fields', i) as any;
        contactData.custom_fields = contactService.validateCustomFields(customFieldsData);

        return await contactService.updateContact(wa_id, contactData);
    });
}