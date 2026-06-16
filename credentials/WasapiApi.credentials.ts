import {
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	IAuthenticateGeneric,
} from 'n8n-workflow';

export class WasapiApi implements ICredentialType {
	name = 'wasapiApi';
	displayName = 'Wasapi API';
	documentationUrl = 'https://github.com/juanalvarezPro/wasapi-sdk';
	icon = 'file:../nodes/Wasapi/icon.svg' as ICredentialType['icon'];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};
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
