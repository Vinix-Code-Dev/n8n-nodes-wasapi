import { IExecuteFunctions, INodeExecutionData, INodeProperties, updateDisplayOptions } from "n8n-workflow";
import { WasapiClient } from "@laiyon/wasapi-sdk";
import { executeCommon } from "../../helpers/executeCommon.helper";
import { ServiceFactory } from "../../factories/ServiceFactory";
import { LabelDTO } from "../../dto/LabelDTO";

export const createProperties: INodeProperties[] = [
    {
        displayName: 'Title',
        required: true,
        name: 'title',
        type: 'string',
        default: '',
        description: 'Title of the label',
    },
    {
        displayName: 'Description',
        required: false,
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the label',
    },
    {
        displayName: 'Color',
        required: true,
        name: 'color',
        type: 'string',
        default: '#000000',
        description: 'Color of the label (hex format)',
    },
];

export const displayOptions = {
    show: {
        resource: ['labels'],
        operation: ['create'],
    },
};

export const createDescription = updateDisplayOptions(displayOptions, createProperties);

export async function executeCreate(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await executeCommon.call(this, async (client: WasapiClient, item: any, i: number) => {
        const labelService = ServiceFactory.labelService(client);
        const labelData = LabelDTO.create(this, i);
        return await labelService.create(labelData);
    });
}
