import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { executeContactCreate } from '../actions/contact/createContact.operation';
import { executeSendMessage } from '../actions/whatsapp/sendMessage.operation';
import { executeSendAttachment } from '../actions/whatsapp/sendAttachment.operation';
import { OPERATION_KEYS } from '../config/constants';
import { executeGetContact } from '../actions/contact/getContact.operation';
import { executeGetAllContacts } from '../actions/contact/getAll.operation';
import { executeGetSearchContacts } from '../actions/contact/getSearch.operation';
import { executeDeleteContact } from '../actions/contact/deleteContact.operation';
import { executeContactUpdate } from '../actions/contact/updateContact.operation';
import { executeToggleBot } from '../actions/contact/toggleBot.operation';
import { executeExportContacts } from '../actions/contact/export.operation';
import { executeGetAllLabels } from '../actions/labels/getLabels.operation';
import { executeGetSearchLabel } from '../actions/labels/getSearch.operation';
import { executeGetByIdLabel } from '../actions/labels/getById.operation';
import { executeCreateLabel } from '../actions/labels/create.operation';
import { executeUpdateLabel } from '../actions/labels/update.operation';
import { executeDeleteLabel } from '../actions/labels/delete.operation';
import { executeGetAllCustomFields } from '../actions/customFields/getAll.operation';
import { executeCreateCustomField } from '../actions/customFields/create.operation';
import { executeUpdateCustomField } from '../actions/customFields/update.operation';
import { executeDeleteCustomField } from '../actions/customFields/delete.operation';
import { executeGetAllCampaigns } from '../actions/campaigns/getAll.operation';
import { executeGetCampaignByUuid } from '../actions/campaigns/getById.operation';
import { executeSendFlow } from '../actions/whatsapp/sendFlow.operation';
import { executeGetUser } from '../actions/user/getUser.operation';
import { executeGetAgents } from '../actions/agents/getAgents.operation';
import { executeAssignAgent } from '../actions/agents/assignAgent.operation';
import { executeAddLabel } from '../actions/contact/addLabel.operation';
import { executeRemoveLabel } from '../actions/contact/removeLabel.operation';
import { executeSendTemplate } from '../actions/whatsapp/sendTemplate.operation';
import { executeDashboardTotalCampaigns } from '../actions/dashboard/totalCampaigns.operation';
import { executeDashboardConsolidatedConversations } from '../actions/dashboard/consolidatedConversations.operation';
import { executeDashboardAgentConversations } from '../actions/dashboard/agentConversations.operation';
import { executeDashboardContactsMetrics } from '../actions/dashboard/contactsMetrics.operation';
import { executeDashboardMessagesMetrics } from '../actions/dashboard/messagesMetrics.operation';
import { executeDashboardBotMessagesMetrics } from '../actions/dashboard/botMessagesMetrics.operation';
import { executeDashboardAgentMetrics } from '../actions/dashboard/agentMetrics.operation';
import { executeGetAllFunnels } from '../actions/funnels/getAll.operation';
import { executeSearchFunnelContact } from '../actions/funnels/searchContact.operation';
import { executeMoveFunnelContact } from '../actions/funnels/moveContact.operation';
import { executeReportPerformanceByAgent } from '../actions/reports/performanceByAgent.operation';
import { executeReportVolumeOfWorkflow } from '../actions/reports/volumeOfWorkflow.operation';
import { executeReportSatisfactionSurvey } from '../actions/reports/satisfactionSurvey.operation';
import { executeGetWorkflowStatuses } from '../actions/workflow/getStatuses.operation';

export interface OperationHandler {
	execute: (this: IExecuteFunctions) => Promise<INodeExecutionData[][]>;
}

export class OperationFactory {
	private static operations: Map<string, OperationHandler> = new Map([
		[OPERATION_KEYS.CONTACT_CREATE, { execute: executeContactCreate }],
		[OPERATION_KEYS.CONTACT_GET, { execute: executeGetContact }],
		[OPERATION_KEYS.CONTACT_GET_ALL, { execute: executeGetAllContacts }],
		[OPERATION_KEYS.CONTACT_GET_SEARCH, { execute: executeGetSearchContacts }],
		[OPERATION_KEYS.CONTACT_DELETE, { execute: executeDeleteContact }],
		[OPERATION_KEYS.CONTACT_UPDATE, { execute: executeContactUpdate }],
		[OPERATION_KEYS.CONTACT_TOGGLE_BOT, { execute: executeToggleBot }],
		[OPERATION_KEYS.CONTACT_EXPORT, { execute: executeExportContacts }],
		[OPERATION_KEYS.WHATSAPP_SEND_MESSAGE, { execute: executeSendMessage }],
		[OPERATION_KEYS.WHATSAPP_SEND_ATTACHMENT, { execute: executeSendAttachment }],
		[OPERATION_KEYS.WHATSAPP_SEND_FLOW, { execute: executeSendFlow }],
		[OPERATION_KEYS.WHATSAPP_SEND_TEMPLATE, { execute: executeSendTemplate }],
		[OPERATION_KEYS.LABELS_GET_ALL, { execute: executeGetAllLabels }],
		[OPERATION_KEYS.LABELS_GET_SEARCH, { execute: executeGetSearchLabel }],
		[OPERATION_KEYS.LABELS_GET_BY_ID, { execute: executeGetByIdLabel }],
		[OPERATION_KEYS.LABELS_CREATE, { execute: executeCreateLabel }],
		[OPERATION_KEYS.LABELS_UPDATE, { execute: executeUpdateLabel }],
		[OPERATION_KEYS.LABELS_DELETE, { execute: executeDeleteLabel }],
		[OPERATION_KEYS.CUSTOM_FIELDS_GET_ALL, { execute: executeGetAllCustomFields }],
		[OPERATION_KEYS.CUSTOM_FIELDS_CREATE, { execute: executeCreateCustomField }],
		[OPERATION_KEYS.CUSTOM_FIELDS_UPDATE, { execute: executeUpdateCustomField }],
		[OPERATION_KEYS.CUSTOM_FIELDS_DELETE, { execute: executeDeleteCustomField }],
		[OPERATION_KEYS.CAMPAIGNS_GET_ALL, { execute: executeGetAllCampaigns }],
		[OPERATION_KEYS.CAMPAIGNS_GET_BY_UUID, { execute: executeGetCampaignByUuid }],
		[OPERATION_KEYS.USER_GET, { execute: executeGetUser }],
		[OPERATION_KEYS.AGENTS_GET, { execute: executeGetAgents }],
		[OPERATION_KEYS.AGENTS_ASSIGN_AGENT, { execute: executeAssignAgent }],
		[OPERATION_KEYS.CONTACT_ADD_LABEL, { execute: executeAddLabel }],
		[OPERATION_KEYS.CONTACT_REMOVE_LABEL, { execute: executeRemoveLabel }],
		[OPERATION_KEYS.DASHBOARD_TOTAL_CAMPAIGNS, { execute: executeDashboardTotalCampaigns }],
		[OPERATION_KEYS.DASHBOARD_CONSOLIDATED_CONVERSATIONS, { execute: executeDashboardConsolidatedConversations }],
		[OPERATION_KEYS.DASHBOARD_AGENT_CONVERSATIONS, { execute: executeDashboardAgentConversations }],
		[OPERATION_KEYS.DASHBOARD_CONTACTS_METRICS, { execute: executeDashboardContactsMetrics }],
		[OPERATION_KEYS.DASHBOARD_MESSAGES_METRICS, { execute: executeDashboardMessagesMetrics }],
		[OPERATION_KEYS.DASHBOARD_BOT_MESSAGES_METRICS, { execute: executeDashboardBotMessagesMetrics }],
		[OPERATION_KEYS.DASHBOARD_AGENT_METRICS, { execute: executeDashboardAgentMetrics }],
		[OPERATION_KEYS.FUNNELS_GET_ALL, { execute: executeGetAllFunnels }],
		[OPERATION_KEYS.FUNNELS_SEARCH_CONTACT, { execute: executeSearchFunnelContact }],
		[OPERATION_KEYS.FUNNELS_MOVE_CONTACT, { execute: executeMoveFunnelContact }],
		[OPERATION_KEYS.REPORTS_PERFORMANCE_BY_AGENT, { execute: executeReportPerformanceByAgent }],
		[OPERATION_KEYS.REPORTS_VOLUME_OF_WORKFLOW, { execute: executeReportVolumeOfWorkflow }],
		[OPERATION_KEYS.REPORTS_SATISFACTION_SURVEY, { execute: executeReportSatisfactionSurvey }],
		[OPERATION_KEYS.WORKFLOW_GET_STATUSES, { execute: executeGetWorkflowStatuses }],
	]);

	static getOperation(resource: string, operation: string): OperationHandler | null {
		const key = `${resource}:${operation}`;
		return this.operations.get(key) || null;
	}

	static registerOperation(key: string, handler: OperationHandler): void {
		this.operations.set(key, handler);
	}

	static getAllOperations(): Map<string, OperationHandler> {
		return new Map(this.operations);
	}
}
