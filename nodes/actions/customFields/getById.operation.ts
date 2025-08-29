import { IExecuteFunctions, INodeExecutionData, INodeProperties, updateDisplayOptions } from "n8n-workflow";
import { WasapiClient } from "@laiyon/wasapi-sdk";
import { executeCommon } from "../../helpers/executeCommon.helper";
import { ServiceFactory } from "../../factories/ServiceFactory";
import { CustomFieldDTO } from "../../dto/CustomFieldDTO";

export const getByIdCustomFieldProperties: INodeProperties[] = [
    {
        displayName: 'Custom Field ID',
        required: true,
        name: 'id',
        type: 'string',
        default: '',
        description: 'ID of the custom field to retrieve',
    },
];

export const displayOptions = {
    show: {
        resource: ['customFields'],
        operation: ['getById'],
    },
};

export const getByIdCustomFieldDescription = updateDisplayOptions(displayOptions, getByIdCustomFieldProperties);

export async function executeGetByIdCustomField(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await executeCommon.call(this, async (client: WasapiClient, item: any, i: number) => {
        const customFieldService = ServiceFactory.customFieldService(client);
        const customFieldId = CustomFieldDTO.getById(this, i);
    
        return await customFieldService.getById(customFieldId);
    });
}
