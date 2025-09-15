import { ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult } from 'n8n-workflow';
import { createClient } from '../client/createClient';

export async function getAgents(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const client = await createClient(this as unknown as ILoadOptionsFunctions);

	if (!client) {
		return { results: [{ name: '⚠️ First Configure Credentials', value: '' }] };
	}
	client.setExecuteContext(this as any);

	const response = await client.metrics.getOnlineAgents() as any;

	const agents: INodeListSearchItems[] = (response as any).users.map((agent: any) => ({
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
