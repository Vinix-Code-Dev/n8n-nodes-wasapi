import { ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult, IDataObject } from 'n8n-workflow';
import { API_URL } from '../config/constants';
import { handleListSearchError } from '../handler/LoadOptionsError.handle';

export async function getAgents(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {

	try {

	const response = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'wasapiApi',
		{
			method: 'GET',
			url: `${API_URL}/dashboard/metrics/online-agents`,
		}
	);

	const agents: INodeListSearchItems[] = response.users.map((agent: IDataObject) => ({
		name: `${agent.name as string} (${agent.email as string})`,
		value: agent.id as string,
		url: '',
	}));

	// Filter agents if search term is provided
	const filteredAgents = filter
		? agents.filter((agent) => agent.name.toLowerCase().includes(filter.toLowerCase()))
		: agents;

	return {
		results: filteredAgents,
	};
} catch (error) {
	return handleListSearchError(error);
}
}
