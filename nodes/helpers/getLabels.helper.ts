    import { ILoadOptionsFunctions } from "n8n-workflow";
import { createClient } from "../client/createClient";
import { handleLoadOptionsError } from "../handler/LoadOptionsError.handle";

// get labels
export async function getLabels(this: ILoadOptionsFunctions) {
    const client = await createClient(this);

    if (!client) {
        return [{ name: '⚠️ First Configure Credentials', value: '' }];
    }

    try {
        const response = await client.labels.getAll();
        return response.labels.map((label: any) => ({
            name: label.title,
            value: label.id.toString(),
        }));
    } catch (error: any) {
        return handleLoadOptionsError(error);
    }
}
