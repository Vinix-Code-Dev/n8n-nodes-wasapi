import {
    IExecuteFunctions,
    IDisplayOptions,
    INodeExecutionData,
    INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';
import { executeCommon } from '../../helpers/executeCommon.helper';
import { ServiceFactory } from '../../factories/ServiceFactory';

export const getUserProperties: INodeProperties[] = [];

const displayOptions: IDisplayOptions = {
    show: {
        resource: ['user'],
        operation: ['get'],
    },
};

export const getUserDescription = updateDisplayOptions(displayOptions, getUserProperties);

export async function executeGetUser(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await executeCommon.call(this, async (client: any, item: any, i: number) => {
        const userService = ServiceFactory.userService(client);
        return await userService.getUser();
    });
}
