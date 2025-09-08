import {
    IExecuteFunctions,
    IDisplayOptions,
    INodeExecutionData,
    INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';
import { executeCommon } from '../../helpers/executeCommon.helper';
import { ServiceFactory } from '../../factories/ServiceFactory';

export const getAgentsProperties: INodeProperties[] = [];

const displayOptions: IDisplayOptions = {
    show: {
        resource: ['agents'],
        operation: ['get'],
    },
};

export const getAgentsDescription = updateDisplayOptions(displayOptions, getAgentsProperties);

export async function executeGetAgents(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await executeCommon.call(this, async (client: any, item: any, i: number) => {
        const agentsService = ServiceFactory.agentsService(client);
        return await agentsService.getOnlineAgents();
    });
}
