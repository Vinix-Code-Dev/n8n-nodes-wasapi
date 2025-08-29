import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { getLabels } from '../helpers/getLabels.helper';
import { getCustomFields } from '../helpers/getCustomFields.helper';
import { getWhatsappNumbers } from '../helpers/getWhatsappNumbers.helper';
import { OperationFactory } from '../factories/OperationFactory';
import { allProperties } from './properties';
import { getLabelId } from '../helpers/getLabeI.helper';

export class Wasapi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wasapi',
		name: 'wasapi',
		icon: 'file:wasapi.svg',
		group: ['transform'],
		version: 1,
		description: 'Interact with Wasapi API - Manage contacts and send WhatsApp messages',
		defaults: {
			name: 'Wasapi',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'wasapiApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api-ws.wasapi.io/api/v1',
		},
		properties: allProperties,
	};

	methods = {
		loadOptions: {
			getLabels: getLabels,
			getCustomFields: getCustomFields,
			getWhatsappNumbers: getWhatsappNumbers,
			getLabelId: getLabelId,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const operationHandler = OperationFactory.getOperation(resource, operation);
		
		if (operationHandler) {
			return await operationHandler.execute.call(this);
		}

		throw new Error(`Resource "${resource}" with operation "${operation}" is not supported`);
	}
}
