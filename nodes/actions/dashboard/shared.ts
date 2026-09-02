import { INodeProperties } from 'n8n-workflow';

/**
 * Date range properties shared by the dashboard metric operations that expect a
 * `dates[]` query param (dates[0] = start, dates[1] = end).
 */
export const dateRangeProperties: INodeProperties[] = [
	{
		displayName: 'Start Date',
		name: 'start_date',
		type: 'string',
		required: true,
		default: '',
		placeholder: '2024-03-01',
		description: 'Start date of the range (YYYY-MM-DD)',
	},
	{
		displayName: 'End Date',
		name: 'end_date',
		type: 'string',
		required: true,
		default: '',
		placeholder: '2024-03-31',
		description: 'End date of the range (YYYY-MM-DD)',
	},
];

/**
 * Builds the `dates[]=start&dates[]=end` query string used by the dashboard
 * metric endpoints (OpenAPI style: form, explode true).
 */
export function buildDatesQuery(start: string, end: string): string {
	const queryParams = new URLSearchParams();
	if (start) queryParams.append('dates[]', start);
	if (end) queryParams.append('dates[]', end);
	return queryParams.toString();
}
