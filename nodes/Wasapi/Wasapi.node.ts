import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeApiError,
	NodeConnectionTypes,
	JsonObject,
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
import { getAllTemplateVariables } from '../helpers/getTemplateData.helper';


export class Wasapi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wasapi',
		name: 'wasapi',
		icon: 'file:icon.svg',
		group: ['transform'],
		version: 2,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Integration oficial of Wasapi API for n8n',
		defaults: {
			name: 'Wasapi',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'wasapiApi',
				required: true,
			},
		],
		properties: allProperties,
		usableAsTool: true,
	};

	methods = {
		loadOptions: {
			getLabels: getLabels,
			getCustomFields: getCustomFields,
			getWhatsappNumbers: getWhatsappNumbers,
			getAllTemplateVariables: getAllTemplateVariables,
		},
		listSearch: {
			getFlows: getFlows,
			getScreens: getScreens,
			getAgents: getAgents,
			getTemplatesByPhone: getTemplatesByPhone,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const operationHandler = OperationFactory.getOperation(resource, operation);
		try {
			if (operationHandler) {
				return await operationHandler.execute.call(this);
			}
			throw new NodeOperationError(this.getNode(), `Resource "${resource}" with operation "${operation}" is not supported`);
		} catch (error) {
			if (this.continueOnFail()) {
				for (let i = 0; i < items.length; i++) {
					returnData.push({ json: this.getInputData(i)[0]?.json ?? {}, pairedItem: { item: i }, error: error as NodeApiError });
				}
				return [returnData];
			}
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}
	}
}
