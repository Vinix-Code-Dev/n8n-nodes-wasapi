import {
	IExecuteFunctions,
	IDisplayOptions,
	INodeExecutionData,
	INodeProperties,
	updateDisplayOptions,
} from 'n8n-workflow';
import { executeCommon } from '../../helpers/executeCommon.helper';
import { WasapiClient } from '../../../wasapiClient';
import { ServiceFactory } from '../../factories/ServiceFactory';
import { ContactDTO } from '../../dto/ContactDTO';

export const removeLabelProperties: INodeProperties[] = [
	{
		displayName: 'WhatsApp ID',
		name: 'contact_uuid',
		type: 'string',
		default: '',
		required: true,
		description: 'Enter a phone number (including the country code without the + sign). For example instead of entering use 573203294920.',
	},
	{
		displayName: 'Labels Names or IDs',
		name: 'labels',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getLabels',
		},
		default: [],
		required: true,
		description: 'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
];

const displayOptions: IDisplayOptions = {
	show: {
		resource: ['contact'],
		operation: ['removeLabel'],
	},
};

export const removeLabelDescription = updateDisplayOptions(displayOptions, removeLabelProperties);

export async function executeRemoveLabel(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	return await executeCommon.call(this, async (client: WasapiClient, item: any, i: number) => {
		const contactService = ServiceFactory.contactService(client);
		const data = ContactDTO.removeLabel(this, i);
		return await contactService.removeLabel(data);
	});
}
