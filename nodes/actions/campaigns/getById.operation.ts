import {
    IExecuteFunctions,
    IDisplayOptions,
    INodeExecutionData,
    INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';
import { executeCommon } from '../../helpers/executeCommon.helper';
import { ServiceFactory } from '../../factories/ServiceFactory';

export const getCampaignByIdProperties: INodeProperties[] = [
    {
        displayName: 'Campaign UUID',
        required: true,
        name: 'campaign_uuid',
        type: 'string',
        default: '',
        description: 'The UUID of the campaign to retrieve',
    },
];

const displayOptions: IDisplayOptions = {
    show: {
        resource: ['campaigns'],
        operation: ['getById'],
    },
};

export const getCampaignByIdDescription = updateDisplayOptions(displayOptions, getCampaignByIdProperties);

export async function executeGetCampaignByUuid(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await executeCommon.call(this, async (client: any, item: any, i: number) => {
        const campaignService = ServiceFactory.campaignService(client);
        const campaign_uuid = this.getNodeParameter('campaign_uuid', i) as string;
        return await campaignService.getById(campaign_uuid);
    });
}
