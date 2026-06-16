// This file is used to load the options for the Wasapi node
import { ILoadOptionsFunctions, IDataObject } from "n8n-workflow";
import { API_URL } from "../config/constants";

// get the flows by phone id
export async function getFlowsByPhoneId(this: ILoadOptionsFunctions, from_id?: number): Promise<IDataObject[]> {
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
	const phone = (flows.data as IDataObject[]).find((phone: IDataObject) => (phone.phone as IDataObject).id === phone_id);
	if (!phone) {
		return []
	}
	const publishedFlows = (phone?.flows as IDataObject).data as IDataObject[];
	return publishedFlows.filter((flow: IDataObject) => flow.status === status);
}

export async function getFlowAssets(this: ILoadOptionsFunctions, flow_id: string, phone_id: number): Promise<IDataObject> {
	const from_id = phone_id;
	const response = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'wasapiApi',
		{
			method: 'POST',
			url: `${API_URL}/whatsapp-flows/${flow_id}/assets?phone_id=${from_id}`,
		}
	);
	return response as IDataObject;
}

 // return the screens of a flow
 export async function getFlowScreens(this: ILoadOptionsFunctions, flow_id: string, phone_id: number): Promise<IDataObject[]> {
	const assets = await getFlowAssets.call(this, flow_id, phone_id);
	return (assets.data as IDataObject).screens as IDataObject[];
}


// get the templates by app id

export async function getTemplatesByAppId(this: ILoadOptionsFunctions, from_id: number): Promise<IDataObject[]> {
	const app_id = await getAppIdByFromId.call(this, from_id);
	const templates = await getWhatsappTemplates.call(this);
	const templatesByPhoneId = templates.filter((template: IDataObject) => template.app_id === app_id);
	if (templatesByPhoneId.length === 0) {
		return [];
	}
	return templatesByPhoneId;
}

// get the app id by from id
export async function getAppIdByFromId(this: ILoadOptionsFunctions, from_id: number): Promise<unknown> {
	const response = await getWhatsappNumbers.call(this);

	const foundApp = response.find((app: IDataObject) => app.id === from_id);
	const app_id = (foundApp as IDataObject).app_id;
	return app_id;
}

// get the whatsapp numbers
export async function getWhatsappNumbers(this: ILoadOptionsFunctions): Promise<IDataObject[]> {
	const response = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'wasapiApi',
		{
			method: 'GET',
			url: `${API_URL}/whatsapp-numbers`,
		}
	);
	return response.data as IDataObject[];
}

// get the whatsapp templates
export async function getWhatsappTemplates(this: ILoadOptionsFunctions): Promise<IDataObject[]> {
	const response = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'wasapiApi',
		{
			method: 'GET',
			url: `${API_URL}/whatsapp-templates`,
		}
	);
	return response.data as IDataObject[];
}
