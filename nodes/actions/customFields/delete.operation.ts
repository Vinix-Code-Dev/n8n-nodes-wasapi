import { IExecuteFunctions, INodeExecutionData, INodeProperties, updateDisplayOptions } from "n8n-workflow";
import { WasapiClient } from "@wasapi/js-sdk";
import { executeCommon } from "../../helpers/executeCommon.helper";
import { ServiceFactory } from "../../factories/ServiceFactory";
import { CustomFieldDTO } from "../../dto/CustomFieldDTO";

export const deleteCustomFieldProperties: INodeProperties[] = [
    {
        displayName: 'Custom Field ID',
        required: true,
        name: 'id',
        type: 'string',
        default: '',
        description: 'ID of the custom field to delete',
    },
];

export const displayOptions = {
    show: {
        resource: ['customFields'],
        operation: ['delete'],
    },
};

export const deleteCustomFieldDescription = updateDisplayOptions(displayOptions, deleteCustomFieldProperties);

export async function executeDeleteCustomField(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await executeCommon.call(this, async (client: WasapiClient, item: any, i: number) => {
        const customFieldService = ServiceFactory.customFieldService(client);
        const id = CustomFieldDTO.delete(this, i);
        return await customFieldService.delete(id);
    });
}
