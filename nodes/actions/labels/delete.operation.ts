import { IExecuteFunctions, INodeExecutionData, INodeProperties, updateDisplayOptions } from "n8n-workflow";
import { WasapiClient } from "../../../wasapiClient";
import { executeCommon } from "../../helpers/executeCommon.helper";
import { ServiceFactory } from "../../factories/ServiceFactory";
import { LabelDTO } from "../../dto/LabelDTO";

export const deleteProperties: INodeProperties[] = [
    {
        displayName: 'Label ID',
        required: true,
        name: 'id',
        type: 'string',
        default: '',
        description: 'ID of the label to delete',
    },
];

export const displayOptions = {
    show: {
        resource: ['labels'],
        operation: ['delete'],
    },
};

export const deleteDescription = updateDisplayOptions(displayOptions, deleteProperties);

export async function executeDelete(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await executeCommon.call(this, async (client: WasapiClient, item: any, i: number) => {
        const labelService = ServiceFactory.labelService(client);
        const id = LabelDTO.delete(this, i);
        return await labelService.delete(id);
    });
}
