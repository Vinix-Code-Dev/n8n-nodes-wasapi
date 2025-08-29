import {
    IExecuteFunctions,
    IDisplayOptions,
    INodeExecutionData,
    INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';
import { executeCommon } from '../../helpers/executeCommon.helper';
import { ServiceFactory } from '../../factories/ServiceFactory';

export const getAllContactsProperties: INodeProperties[] = [];

const displayOptions: IDisplayOptions = {
    show: {
        resource: ['contact'],
        operation: ['getAll'],
    },
};

export const getAllContactsDescription = updateDisplayOptions(displayOptions, getAllContactsProperties);

export async function executeGetAllContacts(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await executeCommon.call(this, async (client: any, item: any, i: number) => {
        const contactService = ServiceFactory.contactService(client);
        return await contactService.getAll();
    });
}
