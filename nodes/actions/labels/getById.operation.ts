import { IExecuteFunctions, INodeExecutionData, INodeProperties, updateDisplayOptions } from "n8n-workflow";
import { WasapiClient } from "@laiyon/wasapi-sdk";
import { executeCommon } from "../../helpers/executeCommon.helper";
import { ServiceFactory } from "../../factories/ServiceFactory";
import { LabelDTO } from "../../dto/LabelDTO";

export const getByIdProperties: INodeProperties[] = [
    {
        displayName: 'Label ID',
        required: true,
        name: 'id',
        type: 'string',
        default: '',
        description: 'ID of the label to retrieve',
    },
];

export const displayOptions = {
    show: {
        resource: ['labels'],
        operation: ['getById'],
    },
};

export const getByIdDescription = updateDisplayOptions(displayOptions, getByIdProperties);

export async function executeGetById(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await executeCommon.call(this, async (client: WasapiClient, item: any, i: number) => {
        const labelService = ServiceFactory.labelService(client);
        const id = LabelDTO.getById(this, i);
        return await labelService.getById(id);
    });
}
