    import { ILoadOptionsFunctions } from "n8n-workflow";
import { createClient } from "../client/createClient";
import { handleLoadOptionsError } from "../handler/LoadOptionsError.handle";

// get labels
export async function getLabels(this: ILoadOptionsFunctions) {
    const client = await createClient(this);

    if (!client) {
        return [{ name: '⚠️ First Configure Credentials', value: '' }];
    }

    // Set execute context for HTTP requests
    client.setExecuteContext(this as any);

    try {
        const response = await client.labels.getAll();
        return response.labels.map((label: any) => ({
            name: label.title,
            value: label.id as number,
        }));
    } catch (error: any) {
        return handleLoadOptionsError(error);
    }
}
