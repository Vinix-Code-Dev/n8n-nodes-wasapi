import {
    IExecuteFunctions,
    IDisplayOptions,
    INodeExecutionData,
    INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';
import { API_URL } from '../../config/constants';

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
        operation: ['getByUuid'],
    },
};

export const getCampaignByIdDescription = updateDisplayOptions(displayOptions, getCampaignByIdProperties);

export async function executeGetCampaignByUuid(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const campaign_uuid = this.getNodeParameter('campaign_uuid', 0, '') as string;
    try {
        const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'wasapiApi',
            {
                method: 'GET',
                url: `${API_URL}/campaigns/${campaign_uuid}`,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return [this.helpers.returnJsonArray(response)];
    } catch (error) {
        if (this.continueOnFail()) {
            return [this.helpers.returnJsonArray({ error: error.message })];
        }
        throw new Error(`Error getting campaign by uuid: ${error.message}`);
    }
}
