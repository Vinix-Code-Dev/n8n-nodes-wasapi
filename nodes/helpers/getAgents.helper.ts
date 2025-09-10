import { ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult } from 'n8n-workflow';
import { createClient } from '../client/createClient';
import { OnlineAgentsResponse } from '@wasapi/js-sdk/dist/types/wasapi/models/response/metrics.model';
import { OnlineAgent } from '@wasapi/js-sdk/dist/types/wasapi/models/shared/metrics.model';

export async function getAgents(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const client = await createClient(this as unknown as ILoadOptionsFunctions);

	if (!client) {
		return { results: [{ name: '⚠️ First Configure Credentials', value: '' }] };
	}
	const response = await client.metrics.getOnlineAgents() as OnlineAgentsResponse;

	const agents: INodeListSearchItems[] = (response as OnlineAgentsResponse).users.map((agent: OnlineAgent) => ({
		name: `${agent.name} (${agent.email})`,
		value: agent.id,
		url: '',
	}));

	// Filter agents if search term is provided
	const filteredAgents = filter
		? agents.filter((agent) => agent.name.toLowerCase().includes(filter.toLowerCase()))
		: agents;

	return {
		results: filteredAgents,
	};
}
