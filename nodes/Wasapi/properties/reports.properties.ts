import { INodeProperties } from 'n8n-workflow';
import { performanceByAgentDescription } from '../../actions/reports/performanceByAgent.operation';
import { volumeOfWorkflowDescription } from '../../actions/reports/volumeOfWorkflow.operation';
import { satisfactionSurveyDescription } from '../../actions/reports/satisfactionSurvey.operation';

export const reportsOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['reports'],
		},
	},
	options: [
		{
			name: 'Performance by Agent',
			value: 'performanceByAgent',
			description: 'Get detailed performance metrics per agent in a date range',
			action: 'Get performance by agent',
		},
		{
			name: 'Volume of Workflow',
			value: 'volumeOfWorkflow',
			description: 'Get the volume of work by date and hour',
			action: 'Get volume of workflow',
		},
		{
			name: 'Satisfaction Survey',
			value: 'satisfactionSurvey',
			description: 'Get the satisfaction survey report',
			action: 'Get satisfaction survey report',
		},
	],
	default: 'performanceByAgent',
};

export const reportsProperties: INodeProperties[] = [
	reportsOperations,
	...performanceByAgentDescription,
	...volumeOfWorkflowDescription,
	...satisfactionSurveyDescription,
];
