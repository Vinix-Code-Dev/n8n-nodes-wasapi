import { ILoadOptionsFunctions } from "n8n-workflow";
import { handleLoadOptionsError } from "../handler/LoadOptionsError.handle";
import { API_URL } from "../config/constants";

// get labels
export async function getLabels(this: ILoadOptionsFunctions) {

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'wasapiApi',
			{
				method: 'GET',
				url: `${API_URL}/labels`,
			}
		);
		return response.labels.map((label: any) => ({
			name: label.title,
			value: label.id as number,
		}));
	} catch (error: any) {
		return handleLoadOptionsError(error);
	}
}
