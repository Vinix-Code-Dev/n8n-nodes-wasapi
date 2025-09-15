import { IExecuteFunctions, INodeExecutionData, INodeProperties, updateDisplayOptions } from "n8n-workflow";
import { WasapiClient } from "../../../wasapiClient";
import { executeCommon } from "../../helpers/executeCommon.helper";
import { ServiceFactory } from "../../factories/ServiceFactory";

export const getAllLabelsProperties: INodeProperties[] = [];

export const displayOptions = {
    show: {
        resource: ['labels'],
        operation: ['getAll'],
    },
};

export const getAllLabelsDescription = updateDisplayOptions(displayOptions, getAllLabelsProperties);

export async function executeGetAllLabels(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await executeCommon.call(this, async (client: WasapiClient, item: any, i: number) => {
        const labelService = ServiceFactory.labelService(client);
        return await labelService.getAll();
    });
}
