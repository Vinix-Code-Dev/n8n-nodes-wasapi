import { ILoadOptionsFunctions } from "n8n-workflow";
import { createClient } from "../client/createClient";
import { handleLoadOptionsError } from "../handler/LoadOptionsError.handle";

/**
* get the list of custom fields available
*/
export async function getCustomFields(this: ILoadOptionsFunctions) {
    const client = await createClient(this);

    if (!client) {
        return [{ name: '❌ First Configure Credentials', value: '' }];
    }

    try {
        // get custom fields available
        const response = await client.customFields.getAll();

        if (!response?.success || !Array.isArray(response.data)) {
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
