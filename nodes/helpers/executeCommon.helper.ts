import { IExecuteFunctions, ILoadOptionsFunctions, INodeExecutionData } from "n8n-workflow";
import { WasapiClient } from "@wasapi/js-sdk";
import { createClient } from "../client/createClient";

export async function executeCommon(
    this: IExecuteFunctions,
    operation: (client: WasapiClient, item: any, index: number) => Promise<any>
): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: any[] = [];

    // get credentials
    const client = await createClient(this as unknown as ILoadOptionsFunctions);

    if (!client) {
        return [this.helpers.returnJsonArray([{ error: '⚠️ First configure credentials' }])];
    }

    for (let i = 0; i < items.length; i++) {
        try {
            const result = await operation.call(this, client, items[i], i);
            returnData.push(result);
        } catch (error) {
            if (this.continueOnFail()) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                returnData.push({ error: errorMessage });
                continue;
            }
            throw error;
        }
    }

    return [this.helpers.returnJsonArray(returnData)];
}
