import { IExecuteFunctions, INodeExecutionData, INodeProperties, updateDisplayOptions } from "n8n-workflow";
import { ContactDTO } from "../../dto/ContactDTO";
import { executeCommon } from "../../helpers/executeCommon.helper";
import { ServiceFactory } from "../../factories/ServiceFactory";

export const deleteContactProperties: INodeProperties[] = [
    {
        displayName: 'Phone Number',
        required: true,
        name: 'wa_id',
        type: 'string',
        default: '',
        description: 'Remember that the phone number must have the country code and NO SPACES. (eg: 573102938401 instead of +57 310 293 8401).',
    },
];

export const displayOptions = {
    show: {
        resource: ['contact'],
        operation: ['delete'],
    },
};

export const deleteContactDescription = updateDisplayOptions(displayOptions, deleteContactProperties);


export async function executeDeleteContact(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await executeCommon.call(this, async (client: any, item: any, i: number) => {
        const contactService = ServiceFactory.contactService(client);
        const contactData = ContactDTO.delete(this, i);
        return await contactService.deleteContact(contactData);
    });
}