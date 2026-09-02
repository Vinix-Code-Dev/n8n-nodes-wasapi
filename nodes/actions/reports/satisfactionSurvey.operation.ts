import {
	IExecuteFunctions,
	IDisplayOptions,
	INodeExecutionData,
	INodeProperties,
	NodeApiError,
	JsonObject,
	updateDisplayOptions,
} from 'n8n-workflow';
import { API_URL } from '../../config/constants';

export const satisfactionSurveyProperties: INodeProperties[] = [
	{
		displayName: 'Start Date',
		name: 'start_date',
		type: 'string',
		default: '',
		placeholder: '2025-01-01',
		description: 'Start date of the query range (YYYY-MM-DD). Optional.',
	},
	{
		displayName: 'End Date',
		name: 'end_date',
		type: 'string',
		default: '',
		placeholder: '2025-01-31',
		description: 'End date of the query range (YYYY-MM-DD). Optional.',
	},
	{
		displayName: 'WhatsApp Number Name or ID',
		name: 'whatsapp_number_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getWhatsappNumbers',
		},
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
];

const displayOptions: IDisplayOptions = {
	show: {
		resource: ['reports'],
		operation: ['satisfactionSurvey'],
	},
};

export const satisfactionSurveyDescription = updateDisplayOptions(displayOptions, satisfactionSurveyProperties);

export async function executeReportSatisfactionSurvey(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const start_date = this.getNodeParameter('start_date', 0, '') as string;
	const end_date = this.getNodeParameter('end_date', 0, '') as string;
	const whatsapp_number_id = this.getNodeParameter('whatsapp_number_id', 0, '') as string;

	const queryParams = new URLSearchParams();
	if (start_date) queryParams.append('start_date', start_date);
	if (end_date) queryParams.append('end_date', end_date);
	if (whatsapp_number_id) queryParams.append('whatsapp_number_id', whatsapp_number_id.toString());

	const queryString = queryParams.toString();

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(this, 'wasapiApi', {
			method: 'GET',
			url: `${API_URL}/reports/satisfaction-survey-report${queryString ? `?${queryString}` : ''}`,
			headers: { 'Content-Type': 'application/json' },
		});
		return [this.helpers.returnJsonArray(response)];
	} catch (error) {
		if (this.continueOnFail()) {
			return [this.helpers.returnJsonArray({ error: (error as Error).message })];
		}
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
