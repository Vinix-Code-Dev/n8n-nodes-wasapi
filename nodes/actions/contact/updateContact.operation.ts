import {
    IExecuteFunctions,
    IDisplayOptions,
    IDataObject,
    INodeExecutionData,
    INodeProperties,
    NodeApiError,
    JsonObject,
    updateDisplayOptions,
} from 'n8n-workflow';
import { API_URL } from '../../config/constants';
import { contactCreateProperties } from './createContact.operation';
import { ContactValidator, ContactData } from '../../validators/ContactValidator';

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

  // Optional fields: only sent when provided (bsuid is ignored by the API on update, so it is omitted)
  const country_code = this.getNodeParameter('country_code', 0, '') as string;
  const wa_username = this.getNodeParameter('wa_username', 0, '') as string;
  if (country_code) contactData.country_code = country_code;
  if (wa_username) contactData.wa_username = wa_username;

	// validate custom fields
  const customFieldsData = this.getNodeParameter('custom_fields', 0, {}) as IDataObject;
  contactData.custom_fields = ContactValidator.validateCustomFields(customFieldsData);
	// validate contact data
	ContactValidator.validateCreateContact(contactData);
  try {
    const response = await this.helpers.httpRequestWithAuthentication.call(
      this,
      'wasapiApi',
      {
        method: 'PUT',
        url: `${API_URL}/contacts/${wa_id}`,
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
