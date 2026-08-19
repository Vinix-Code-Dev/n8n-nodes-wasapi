import { INodeProperties } from "n8n-workflow";

export const commonProperties: INodeProperties[] = [
    {
        displayName: 'Phone Wasapi Name or ID',
        name: 'fromId',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getWhatsappNumbers',
        },
        default: '',
        required: true,
        description: 'Pick the phone number of your wasapi account. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    },
    {
        displayName: 'Recipient',
        name: 'wa_id',
        type: 'string',
        default: '',
        required: true,
        description: 'Phone number, BSUID or WhatsApp username of the recipient. The phone number must include the country code and NO + sign or spaces (e.g. 573203294920 instead of +57 320 329-4920).',
    },
];
