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
        displayName: 'Search by name',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search contacts by name',
        required: false,
    },
    {
        displayName: 'Page',
        name: 'page',
        type: 'number',
        default: 1,
        description: 'Page number for pagination',
        required: false,
    },
    {
        displayName: 'Labels',
        name: 'labels',
        required: false,
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getLabels',
        },
        default: '',
        description: 'Label of the contact',
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
