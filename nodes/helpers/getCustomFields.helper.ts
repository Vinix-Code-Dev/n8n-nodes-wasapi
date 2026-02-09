import { ILoadOptionsFunctions } from "n8n-workflow";
import { handleLoadOptionsError } from "../handler/LoadOptionsError.handle";
import { API_URL } from "../config/constants";

/**
* get the list of custom fields available
*/
export async function getCustomFields(this: ILoadOptionsFunctions) {


    try {
        // get custom fields available
        const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'wasapiApi',
            {
                method: 'GET',
                url: `${API_URL}/custom-fields`,
            }
        );

        if (!response || !Array.isArray(response.data)) {
            return [{ name: '❌ No Custom Fields Available', value: '' }];
        }

        // Crear opciones para cada campo personalizado
        const options: any[] = [];

        response.data.forEach((field: any) => {
            options.push({
                name: field.field_name,
                value: field.field_name,
            });
        });

        return options;
    } catch (error: any) {
        return handleLoadOptionsError(error);
    }
}
