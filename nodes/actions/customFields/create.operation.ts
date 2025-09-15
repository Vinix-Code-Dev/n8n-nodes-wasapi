import { IExecuteFunctions, INodeExecutionData, INodeProperties, updateDisplayOptions } from "n8n-workflow";
import { WasapiClient } from "../../../wasapiClient";
import { executeCommon } from "../../helpers/executeCommon.helper";
import { ServiceFactory } from "../../factories/ServiceFactory";
import { CustomFieldDTO } from "../../dto/CustomFieldDTO";

export const createCustomFieldProperties: INodeProperties[] = [
    {
        displayName: 'Field Name',
        required: true,
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name of the custom field',
    }
];

export const displayOptions = {
    show: {
        resource: ['customFields'],
        operation: ['create'],
    },
};

export const createCustomFieldDescription = updateDisplayOptions(displayOptions, createCustomFieldProperties);

export async function executeCreateCustomField(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await executeCommon.call(this, async (client: WasapiClient, item: any, i: number) => {
        const customFieldService = ServiceFactory.customFieldService(client);
        const customFieldData = CustomFieldDTO.create(this, i);
        return await customFieldService.create(customFieldData);
    });
}
