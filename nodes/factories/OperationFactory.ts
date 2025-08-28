import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { executeContactCreate } from '../actions/contact/createContact.operation';
import { executeSendMessage } from '../actions/whatsapp/sendMessage.operation';
import { executeSendAttachment } from '../actions/whatsapp/sendAttachment.operation';
import { OPERATION_KEYS } from '../config/constants';

export interface OperationHandler {
	execute: (this: IExecuteFunctions) => Promise<INodeExecutionData[][]>;
}

export class OperationFactory {
	private static operations: Map<string, OperationHandler> = new Map([
		[OPERATION_KEYS.CONTACT_CREATE, { execute: executeContactCreate }],
		[OPERATION_KEYS.WHATSAPP_SEND_MESSAGE, { execute: executeSendMessage }],
		[OPERATION_KEYS.WHATSAPP_SEND_ATTACHMENT, { execute: executeSendAttachment }],
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
