import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { executeContactCreate } from '../actions/contact/createContact.operation';
import { executeSendMessage } from '../actions/whatsapp/sendMessage.operation';
import { executeSendAttachment } from '../actions/whatsapp/sendAttachment.operation';
import { OPERATION_KEYS } from '../config/constants';
import { executeGetContact } from '../actions/contact/getContact.operation';
import { executeDeleteContact } from '../actions/contact/deleteContact.operation';
import { executeContactUpdate } from '../actions/contact/updateContact.operation';
import { executeGetAllLabels } from '../actions/labels/getLabels.operation';
import { executeGetSearch } from '../actions/labels/getSearch.operation';
import { executeGetById } from '../actions/labels/getById.operation';
import { executeCreate } from '../actions/labels/create.operation';
import { executeUpdate } from '../actions/labels/update.operation';
import { executeDelete } from '../actions/labels/delete.operation';

export interface OperationHandler {
	execute: (this: IExecuteFunctions) => Promise<INodeExecutionData[][]>;
}

export class OperationFactory {
	private static operations: Map<string, OperationHandler> = new Map([
		[OPERATION_KEYS.CONTACT_CREATE, { execute: executeContactCreate }],
		[OPERATION_KEYS.CONTACT_GET, { execute: executeGetContact }],
		[OPERATION_KEYS.CONTACT_DELETE, { execute: executeDeleteContact }],
		[OPERATION_KEYS.CONTACT_UPDATE, { execute: executeContactUpdate }],
		[OPERATION_KEYS.WHATSAPP_SEND_MESSAGE, { execute: executeSendMessage }],
		[OPERATION_KEYS.WHATSAPP_SEND_ATTACHMENT, { execute: executeSendAttachment }],
		[OPERATION_KEYS.LABELS_GET_ALL, { execute: executeGetAllLabels }],
		[OPERATION_KEYS.LABELS_GET_SEARCH, { execute: executeGetSearch }],
		[OPERATION_KEYS.LABELS_GET_BY_ID, { execute: executeGetById }],
		[OPERATION_KEYS.LABELS_CREATE, { execute: executeCreate }],
		[OPERATION_KEYS.LABELS_UPDATE, { execute: executeUpdate }],
		[OPERATION_KEYS.LABELS_DELETE, { execute: executeDelete }],
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
