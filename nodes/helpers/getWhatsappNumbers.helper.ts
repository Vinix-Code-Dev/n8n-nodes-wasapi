import { ILoadOptionsFunctions } from "n8n-workflow";
import { createClient } from "../client/createClient";
import { handleLoadOptionsError } from "../handler/LoadOptionsError.handle";

export async function getWhatsappNumbers(this: ILoadOptionsFunctions) {
    const client = await createClient(this);

    if (!client) {
        return [{ name: '⚠️ First Configure Credentials', value: '' }];
    }

    try {
        // get whatsapp numbers available
        const response = await client.whatsapp.getWhatsappNumbers();

        if (!response?.success || !Array.isArray(response.data)) {
            return [{ name: '❌ No Numbers Available', value: '' }];
        }

        // create options for each number
        const options: any[] = [
            { name: '-- Select a WhatsApp Number --', value: '' },
        ];

        response.data.forEach((n: any) => {
            const isDefault = n.default === 1;
            options.push({
                name: `${n.display_name} (${n.phone_number})${isDefault ? ' (Default)' : ''}`,
                value: n.id.toString(),
            });
        });

        return options;
    } catch (error: any) {
        return handleLoadOptionsError(error);
    }
}
