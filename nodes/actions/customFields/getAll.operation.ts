import { IExecuteFunctions, INodeExecutionData, INodeProperties, updateDisplayOptions } from "n8n-workflow";
import { WasapiClient } from "@laiyon/wasapi-sdk";
import { executeCommon } from "../../helpers/executeCommon.helper";
import { ServiceFactory } from "../../factories/ServiceFactory";

export const getAllCustomFieldsProperties: INodeProperties[] = [];

export const displayOptions = {
    show: {
        resource: ['customFields'],
        operation: ['getAll'],
    },
};

export const getAllCustomFieldsDescription = updateDisplayOptions(displayOptions, getAllCustomFieldsProperties);

export async function executeGetAllCustomFields(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await executeCommon.call(this, async (client: WasapiClient, item: any, i: number) => {
        const customFieldService = ServiceFactory.customFieldService(client);
        return await customFieldService.getAll();
    });
}
