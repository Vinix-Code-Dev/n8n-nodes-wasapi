import {
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class WasapiApi implements ICredentialType {
	name = 'wasapiApi';
	displayName = 'Wasapi API';
	documentationUrl = 'https://github.com/juanalvarezPro/wasapi-sdk';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'API Key generada por Wasapi',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api-ws.wasapi.io/api/v1',
			url: '/user',
			method: 'GET',
			headers: {
				'Authorization': '=Bearer {{$credentials.apiKey}}',
				'Content-Type': 'application/json',
			},
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					message: 'API Key is valid',
					key: 'success',
					value: true,
				},
			},
		],
	};
}
