import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { getLabels } from '../helpers/getLabels.helper';
import { getCustomFields } from '../helpers/getCustomFields.helper';
import { getWhatsappNumbers } from '../helpers/getWhatsappNumbers.helper';
import { OperationFactory } from '../factories/OperationFactory';
import { allProperties } from './properties';
import { getFlows } from '../helpers/getFlows.helper';
import { getScreens } from '../helpers/getScreens.helper';
import { getAgents } from '../helpers/getAgents.helper';
import { getTemplatesByPhone } from '../helpers/getTemplatesByPhone.helper';
import { getHeaderVariables, getBodyVariables, getCtaVariables, getFooterVariables } from '../helpers/getTemplateData.helper';


export class Wasapi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wasapi',
		name: 'wasapi',
		icon: 'file:icon.svg',
		group: ['transform'],
		version: 2,
		description: 'Integration oficial of Wasapi API for n8n',
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
			getHeaderVariables: getHeaderVariables,
			getBodyVariables: getBodyVariables,
			getCtaVariables: getCtaVariables,
			getFooterVariables: getFooterVariables,
		},
		listSearch: {
			getFlows: getFlows,
			getScreens: getScreens,
			getAgents: getAgents,
			getTemplatesByPhone: getTemplatesByPhone,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const operationHandler = OperationFactory.getOperation(resource, operation);

		if (operationHandler) {
			return await operationHandler.execute.call(this);
		}

		throw new NodeOperationError(this.getNode(), `Resource "${resource}" with operation "${operation}" is not supported`);
	}
}
