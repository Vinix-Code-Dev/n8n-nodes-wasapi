import { IExecuteFunctions, INodeExecutionData, INodeProperties, updateDisplayOptions } from "n8n-workflow";
import { WasapiClient } from "@wasapi/js-sdk";
import { executeCommon } from "../../helpers/executeCommon.helper";
import { ServiceFactory } from "../../factories/ServiceFactory";
import { CustomFieldDTO } from "../../dto/CustomFieldDTO";

export const updateCustomFieldProperties: INodeProperties[] = [
    {
        displayName: 'Custom Field ID',
        required: true,
        name: 'id',
        type: 'string',
        default: '',
        description: 'ID of the custom field to update',
    },
    {
        displayName: 'Field Name',
        required: true,
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name of the custom field',
    },
];

export const displayOptions = {
    show: {
        resource: ['customFields'],
        operation: ['update'],
    },
};

export const updateCustomFieldDescription = updateDisplayOptions(displayOptions, updateCustomFieldProperties);

export async function executeUpdateCustomField(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await executeCommon.call(this, async (client: WasapiClient, item: any, i: number) => {
        const customFieldService = ServiceFactory.customFieldService(client);
        const customFieldData = CustomFieldDTO.update(this, i);

        return await customFieldService.update(customFieldData);
    });
}
