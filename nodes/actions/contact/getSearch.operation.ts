import {
    IExecuteFunctions,
    IDisplayOptions,
    INodeExecutionData,
    INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';
import { executeCommon } from '../../helpers/executeCommon.helper';
import { ServiceFactory } from '../../factories/ServiceFactory';
import { ContactDTO } from '../../dto/ContactDTO';

export const getSearchContactsProperties: INodeProperties[] = [
    {
        displayName: 'Search by Name',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search contacts by name',
    },
    {
        displayName: 'Page',
        name: 'page',
        type: 'number',
        default: 1,
        description: 'Page number for pagination',

    },
    {   //eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
        displayName: 'Labels Names or IDs',
        name: 'labels',
        type: 'multiOptions',
        typeOptions: {
            loadOptionsMethod: 'getLabelId',
        },
        default: [],
        description: 'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    },
];

const displayOptions: IDisplayOptions = {
    show: {
        resource: ['contact'],
        operation: ['getSearch'],
    },
};

export const getSearchContactsDescription = updateDisplayOptions(displayOptions, getSearchContactsProperties);

export async function executeGetSearchContacts(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await executeCommon.call(this, async (client: any, item: any, i: number) => {
        const contactService = ServiceFactory.contactService(client);
        const params = ContactDTO.getSearch(this, i);

        return await contactService.getSearch(params);
    });
}
