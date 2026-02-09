// This file is used to load the options for the Wasapi node
import { ILoadOptionsFunctions } from "n8n-workflow";
import { API_URL } from "../config/constants";

// get the flows by phone id
export async function getFlowsByPhoneId(this: ILoadOptionsFunctions, from_id?: number): Promise<any> {
	const phone_id = from_id;
	const status = 'PUBLISHED';
	const flows = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'wasapiApi',
		{
			method: 'GET',
			url: `${API_URL}/whatsapp-flows`,
		}
	);
	const phone = flows.data.find((phone: any) => phone.phone.id === phone_id);
	if (!phone) {
		return []
	}
	const publishedFlows = phone?.flows.data.filter((flow: any) => flow.status === status);
	return publishedFlows;
}

export async function getFlowAssets(this: ILoadOptionsFunctions, flow_id: string, phone_id: number): Promise<any> {
	const from_id = phone_id;
	const response = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'wasapiApi',
		{
			method: 'POST',
			url: `${API_URL}/whatsapp-flows/${flow_id}/assets?phone_id=${from_id}`,
		}
	);
	return response;
}

 // return the screens of a flow
 export async function getFlowScreens(this: ILoadOptionsFunctions, flow_id: string, phone_id: number): Promise<any> {
	const assets = await getFlowAssets.call(this, flow_id, phone_id);
	return assets.data.screens;
}


// get the templates by app id

export async function getTemplatesByAppId(this: ILoadOptionsFunctions, from_id: number): Promise<any> {
	const app_id = await getAppIdByFromId.call(this, from_id);
	const templates = await getWhatsappTemplates.call(this);
	const templatesByPhoneId = templates.filter((template: any) => template.app_id === app_id);
	if (templatesByPhoneId.length === 0) {
		return [];
	}
	return templatesByPhoneId;
}

// get the app id by from id
export async function getAppIdByFromId(this: ILoadOptionsFunctions, from_id: number): Promise<any> {
	const response = await getWhatsappNumbers.call(this);

	const foundApp = response.find((app: any) => app.id === from_id);
	const app_id = foundApp.app_id;
	return app_id;
}

// get the whatsapp numbers
export async function getWhatsappNumbers(this: ILoadOptionsFunctions): Promise<any> {
	const response = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'wasapiApi',
		{
			method: 'GET',
			url: `${API_URL}/whatsapp-numbers`,
		}
	);
	return response.data;
}

// get the whatsapp templates
export async function getWhatsappTemplates(this: ILoadOptionsFunctions): Promise<any> {
	const response = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'wasapiApi',
		{
			method: 'GET',
			url: `${API_URL}/whatsapp-templates`,
		}
	);
	return response.data;
}
