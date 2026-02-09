import {
    IExecuteFunctions,
    IDisplayOptions,
    INodeExecutionData,
    INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';
import { ContactValidator } from '../../validators/ContactValidator';
import { API_URL } from '../../config/constants';
export const exportContactsProperties: INodeProperties[] = [
    {
        displayName: 'Email URLs',
        name: 'email_urls',
        type: 'string',
        description: 'Email addresses to send the export to (maximum 5)',
        typeOptions: {
            multipleValues: true,
        },
        default: [],
        placeholder: 'email@example.com',
    },
];

const displayOptions: IDisplayOptions = {
    show: {
        resource: ['contact'],
        operation: ['export'],
    },
};

export const exportContactsDescription = updateDisplayOptions(displayOptions, exportContactsProperties);



export async function executeExportContacts(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const emailUrlsData = {
		email_urls: this.getNodeParameter('email_urls', 0, []) as string [],
	};
	ContactValidator.validateExportContacts(emailUrlsData);

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'wasapiApi',
			{
				method: 'POST',
				url: `${API_URL}/contacts/export`,
				headers: {
					'Content-Type': 'application/json',
				},
				body: emailUrlsData,
			}
		);
		return [this.helpers.returnJsonArray(response)];
	} catch (error) {
		if (this.continueOnFail()) {
			return [this.helpers.returnJsonArray({ error: error.message })];
		}
		throw error;
	}
}

