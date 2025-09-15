import { IExecuteFunctions } from 'n8n-workflow';
import { CreateLabel, UpdateLabel } from '../../wasapiClient';

export class LabelDTO {
	static getSearch(executeFunctions: IExecuteFunctions, index: number): string {
		return executeFunctions.getNodeParameter('name', index) as string;
	}

	static getById(executeFunctions: IExecuteFunctions, index: number): string {
		return executeFunctions.getNodeParameter('id', index) as string;
	}

	static create(executeFunctions: IExecuteFunctions, index: number): CreateLabel {
		return {
			title: executeFunctions.getNodeParameter('title', index) as string,
			description: executeFunctions.getNodeParameter('description', index) as string,
			color: executeFunctions.getNodeParameter('color', index) as string,
		};
	}

	static update(executeFunctions: IExecuteFunctions, index: number): UpdateLabel {
		return {
			id: executeFunctions.getNodeParameter('id', index) as string,
			data: {
				title: executeFunctions.getNodeParameter('title', index) as string,
				description: executeFunctions.getNodeParameter('description', index) as string,
				color: executeFunctions.getNodeParameter('color', index) as string,
			},
		};
	}

	static delete(executeFunctions: IExecuteFunctions, index: number): string {
		return executeFunctions.getNodeParameter('id', index) as string;
	}
}
