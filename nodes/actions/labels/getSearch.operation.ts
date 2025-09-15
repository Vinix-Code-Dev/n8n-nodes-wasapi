import { IExecuteFunctions, INodeExecutionData, INodeProperties, updateDisplayOptions } from "n8n-workflow";
import { WasapiClient } from "../../../wasapiClient";
import { executeCommon } from "../../helpers/executeCommon.helper";
import { ServiceFactory } from "../../factories/ServiceFactory";
import { LabelDTO } from "../../dto/LabelDTO";

export const getSearchProperties: INodeProperties[] = [
    {
        displayName: 'Name',
        required: true,
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name exactly of the label to search for',
    },
];

export const displayOptions = {
    show: {
        resource: ['labels'],
        operation: ['getSearch'],
    },
};

export const getSearchDescription = updateDisplayOptions(displayOptions, getSearchProperties);

export async function executeGetSearch(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await executeCommon.call(this, async (client: WasapiClient, item: any, i: number) => {
        const labelService = ServiceFactory.labelService(client);
        const name = LabelDTO.getSearch(this, i);
        return await labelService.getSearch(name);
    });
}
