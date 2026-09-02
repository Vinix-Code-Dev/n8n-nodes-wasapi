import { INodeProperties } from 'n8n-workflow';
import { totalCampaignsDescription } from '../../actions/dashboard/totalCampaigns.operation';
import { consolidatedConversationsDescription } from '../../actions/dashboard/consolidatedConversations.operation';
import { agentConversationsDescription } from '../../actions/dashboard/agentConversations.operation';
import { contactsMetricsDescription } from '../../actions/dashboard/contactsMetrics.operation';
import { messagesMetricsDescription } from '../../actions/dashboard/messagesMetrics.operation';
import { botMessagesMetricsDescription } from '../../actions/dashboard/botMessagesMetrics.operation';
import { agentMetricsDescription } from '../../actions/dashboard/agentMetrics.operation';

export const dashboardOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['dashboard'],
		},
	},
	options: [
		{
			name: 'Get Agent Conversations',
			value: 'agentConversations',
			description: 'Get conversations grouped by agent and status',
			action: 'Get agent conversations',
		},
		{
			name: 'Get Agent Metrics',
			value: 'agentMetrics',
			description: 'Get a specific agent metric by type',
			action: 'Get agent metrics',
		},
		{
			name: 'Get Bot Messages Metrics',
			value: 'botMessagesMetrics',
			description: 'Get the count of chatbot messages grouped by phone number',
			action: 'Get bot messages metrics',
		},
		{
			name: 'Get Consolidated Conversations',
			value: 'consolidatedConversations',
			description: 'Get the count of conversations grouped by status',
			action: 'Get consolidated conversations',
		},
		{
			name: 'Get Contacts Metrics',
			value: 'contactsMetrics',
			description: 'Get the count of contacts by status (enabled, blocked, active)',
			action: 'Get contacts metrics',
		},
		{
			name: 'Get Messages Metrics',
			value: 'messagesMetrics',
			description: 'Get the count of messages by type (incoming/outgoing)',
			action: 'Get messages metrics',
		},
		{
			name: 'Get Total Campaigns',
			value: 'totalCampaigns',
			description: 'Get the total number of campaigns in a date range',
			action: 'Get total campaigns',
		},
	],
	default: 'contactsMetrics',
};

export const dashboardProperties: INodeProperties[] = [
	dashboardOperations,
	...totalCampaignsDescription,
	...consolidatedConversationsDescription,
	...agentConversationsDescription,
	...contactsMetricsDescription,
	...messagesMetricsDescription,
	...botMessagesMetricsDescription,
	...agentMetricsDescription,
];
