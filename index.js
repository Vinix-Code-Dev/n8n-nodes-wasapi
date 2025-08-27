'use strict';

import { WasapiSendMessage } from './nodes/WasapiSendMessage/WasapiSendMessage.node.js';
import { WasapiSendAttachment } from './nodes/WasapiSendAttachment/WasapiSendAttachment.node.js';
import { WasapiCreateContact } from './nodes/WasapiCreateContact/WasapiCreateContact.node.js';

export default {
	nodes: [
		WasapiSendMessage,
		WasapiSendAttachment,
		WasapiCreateContact,
	],
};
