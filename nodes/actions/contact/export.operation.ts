import {
    IExecuteFunctions,
    IDisplayOptions,
    INodeExecutionData,
    INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';
import { executeCommon } from '../../helpers/executeCommon.helper';
import { ServiceFactory } from '../../factories/ServiceFactory';
import { ContactValidator } from '../../validators/ContactValidator';
import { ContactDTO } from '../../dto/ContactDTO';

export const exportContactsProperties: INodeProperties[] = [
    {
        displayName: 'Email URLs',
        name: 'email_urls',
        type: 'string',
        description: 'Email addresses to send the export to (maximum 5)',
        typeOptions: {
            multipleValues: true,
        },
        default: [],
        placeholder: 'email@example.com',
    },
];

const displayOptions: IDisplayOptions = {
    show: {
        resource: ['contact'],
        operation: ['export'],
    },
};

export const exportContactsDescription = updateDisplayOptions(displayOptions, exportContactsProperties);

export async function executeExportContacts(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await executeCommon.call(this, async (client: any, item: any, i: number) => {
        const contactService = ServiceFactory.contactService(client);
        const emailUrlsData = ContactDTO.export(this, i);
        ContactValidator.validateExportContacts(emailUrlsData);
        return await contactService.export(emailUrlsData);
    });
}
