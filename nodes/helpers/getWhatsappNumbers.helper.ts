import { ILoadOptionsFunctions, IDataObject, INodePropertyOptions } from "n8n-workflow";
import { handleLoadOptionsError } from "../handler/LoadOptionsError.handle";
import { API_URL } from "../config/constants";

export async function getWhatsappNumbers(this: ILoadOptionsFunctions) {

    try {
        // get whatsapp numbers available
        const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'wasapiApi',
            {
                method: 'GET',
                url: `${API_URL}/whatsapp-numbers`,
            }
        );

        if (!response.success) {
            return [{ name: '❌ No Numbers Available', value: '' }];
        }

        // create options for each number
        const options: INodePropertyOptions[] = [
            { name: '-- Select a WhatsApp Number --', value: '' },
        ];
        response.data.forEach((n: IDataObject) => {
            const isDefault = n.default === 1;
            options.push({
                name: `${n.display_name as string} (${n.phone_number as string})${isDefault ? ' (Default)' : ''}`,
                value: n.id as number,
            });
        });

        return options;
    } catch (error: unknown) {
        return handleLoadOptionsError(error);
    }
}
