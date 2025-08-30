import { IExecuteFunctions, INodeExecutionData, INodeProperties, updateDisplayOptions } from "n8n-workflow";
import { WasapiClient } from "@laiyon/wasapi-sdk";
import { executeCommon } from "../../helpers/executeCommon.helper";
import { ServiceFactory } from "../../factories/ServiceFactory";
import { LabelDTO } from "../../dto/LabelDTO";

export const updateProperties: INodeProperties[] = [
    {
        displayName: 'Label ID',
        required: true,
        name: 'id',
        type: 'string',
        default: '',
        description: 'ID of the label to update',
    },
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
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the label',
    },
    {
        displayName: 'Color',
        required: true,
        name: 'color',
        type: 'color',
        default: '#000000',
        description: 'Color of the label (hex format)',
    },
];

export const displayOptions = {
    show: {
        resource: ['labels'],
        operation: ['update'],
    },
};

export const updateDescription = updateDisplayOptions(displayOptions, updateProperties);

export async function executeUpdate(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await executeCommon.call(this, async (client: WasapiClient, item: any, i: number) => {
        const labelService = ServiceFactory.labelService(client);
        const labelData = LabelDTO.update(this, i);
        return await labelService.update(labelData);
    });
}
