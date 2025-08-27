import {
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
}
