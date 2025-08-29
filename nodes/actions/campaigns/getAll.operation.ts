import {
    IExecuteFunctions,
    IDisplayOptions,
    INodeExecutionData,
    INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';
import { executeCommon } from '../../helpers/executeCommon.helper';
import { ServiceFactory } from '../../factories/ServiceFactory';

export const getAllCampaignsProperties: INodeProperties[] = [];

const displayOptions: IDisplayOptions = {
    show: {
        resource: ['campaigns'],
        operation: ['getAll'],
    },
};

export const getAllCampaignsDescription = updateDisplayOptions(displayOptions, getAllCampaignsProperties);

export async function executeGetAllCampaigns(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await executeCommon.call(this, async (client: any, item: any, i: number) => {
        const campaignService = ServiceFactory.campaignService(client);
        return await campaignService.getAll();
    });
}
