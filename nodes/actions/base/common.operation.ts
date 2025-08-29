import { INodeProperties } from "n8n-workflow";

export const commonProperties: INodeProperties[] = [
    {
        displayName: 'Sender Phone Number',
        name: 'fromId',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getWhatsappNumbers',
        },
        default: '',
        required: true,
        description: 'Pick the phone number of your wasapi account',
    },
    {
        displayName: 'WhatsApp ID',
        name: 'wa_id',
        type: 'string',
        default: '',
        required: true,
        description: 'Enter a phone number (including the country code without the + sign). For example instead of entering use 573203294920.',
    },
];
