import { IDisplayOptions, IExecuteFunctions, INodeExecutionData, INodeProperties, updateDisplayOptions } from "n8n-workflow";
import { commonProperties } from "../base/common.operation";
import { WhatsAppDTO } from "../../dto/WhatsAppDTO";
import { executeCommon } from "../../helpers/executeCommon.helper";
import { ServiceFactory } from "../../factories/ServiceFactory";
import { WasapiClient } from "@laiyon/wasapi-sdk";
import { validateFlowCompatibility } from "../../validators/validateFlowCompatibility.helper";

export const sendFlowProperties: INodeProperties[] = [

	...commonProperties,
	{
		displayName: 'Flow Name or ID',
		name: 'flowId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getFlows',
				},
			},
		],
		required: true,
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>. Click to search flows.',
	},
	{
		displayName: 'Screen Principal Name or ID',
		name: 'screen',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getScreens',
				},
			},
		],
		required: true,
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>. Click to search screens.',
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		default: '',
		required: true,
	},
	{
		displayName: 'Call to Action',
		name: 'cta',
		type: 'string',
		default: '',
		required: true,
	},
];

const displayOptions: IDisplayOptions = {
	show: {
		resource: ['whatsapp'],
		operation: ['sendFlow'],
	},
};

export const sendFlowDescription = updateDisplayOptions(displayOptions, sendFlowProperties);

export async function executeSendFlow(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	return await executeCommon.call(this, async (client: WasapiClient, item: any, i: number) => {
		const flowData = WhatsAppDTO.flowFromExecuteFunctions(this, i);
		// verify compatibility BEFORE executing
		await validateFlowCompatibility.call(this, client, flowData.phone_id?.toString() || '', flowData.flow_id?.toString() || '', flowData.screen?.toString() || '', i);

		// ✅ If all validations pass, execute normally
		const whatsAppService = ServiceFactory.whatsAppService(client);
		return await whatsAppService.sendFlow(flowData);
	});
}
