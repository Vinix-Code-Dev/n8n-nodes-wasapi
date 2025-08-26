'use strict';

const { WasapiSendMessage } = require('./nodes/WasapiSendMessage/WasapiSendMessage.node');
const { WasapiSendTemplate } = require('./nodes/WasapiSendTemplate/WasapiSendTemplate.node');
const { WasapiSendAttachment } = require('./nodes/WasapiSendAttachment/WasapiSendAttachment.node');


module.exports = {
	nodes: [
		WasapiSendMessage,
		WasapiSendTemplate,
		WasapiSendAttachment,
	],
};
