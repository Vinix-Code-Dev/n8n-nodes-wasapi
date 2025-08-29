import { IExecuteFunctions } from 'n8n-workflow';
import { CreateCustomField, UpdateCustomField } from '../services/CustomFieldService';

export class CustomFieldDTO {
	static create(executeFunctions: IExecuteFunctions, index: number): CreateCustomField {
		return {
			name: executeFunctions.getNodeParameter('name', index) as string,
		};
	}

	static update(executeFunctions: IExecuteFunctions, index: number): UpdateCustomField {
		return {
			id: executeFunctions.getNodeParameter('id', index) as string,
			data: {
				name: executeFunctions.getNodeParameter('name', index) as string,
			},
		};
	}

	static getById(executeFunctions: IExecuteFunctions, index: number): string {
		return executeFunctions.getNodeParameter('id', index) as string;
	}

	static delete(executeFunctions: IExecuteFunctions, index: number): string {
		return executeFunctions.getNodeParameter('id', index) as string;
	}
}
