import {
    IExecuteFunctions,
    IDisplayOptions,
    INodeExecutionData,
    INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';

import { contactCreateProperties } from './createContact.operation';
import { ContactValidator } from '../../validators/ContactValidator';

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
  const wa_id = this.getNodeParameter('wa_id', 0, '') as string;
  const contactData = {
    first_name: this.getNodeParameter('first_name', 0, '') as string,
    last_name: this.getNodeParameter('last_name', 0, '') as string,
    email: this.getNodeParameter('email', 0, '') as string,
    phone: this.getNodeParameter('phone', 0, '') as string,
    notes: this.getNodeParameter('notes', 0, '') as string,
    labels: this.getNodeParameter('labels', 0, []) as number [],
    custom_fields: {},
  };
	// validate custom fields
  const customFieldsData = this.getNodeParameter('custom_fields', 0, {}) as any;
  contactData.custom_fields = ContactValidator.validateCustomFields(customFieldsData);
	// validate contact data
	ContactValidator.validateCreateContact(contactData);
  try {
    const response = await this.helpers.httpRequestWithAuthentication.call(
      this,
      'wasapiApi',
      {
        method: 'PUT',
        url: `https://api-ws.wasapi.io/api/v1/contacts/${wa_id}`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: contactData,
      }
    );
    return [this.helpers.returnJsonArray(response)];
  } catch (error) {
    if (this.continueOnFail()) {
      return [this.helpers.returnJsonArray({ error: error.message })];
    }
    throw new Error(`Error updating contact: ${error.message}`);
  }
}
