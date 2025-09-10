# Development Guide - Adding New Actions

This guide provides step-by-step examples for adding new actions to the Wasapi N8N node.

## Example: Adding a "Delete Contact" Operation

### 1. Update Constants

```typescript
// nodes/config/constants.ts
export const OPERATIONS = {
  CONTACT: {
    CREATE: 'create',
    DELETE: 'delete',  // New operation
  },
  // ... existing operations
};

export const OPERATION_KEYS = {
  CONTACT_CREATE: `${RESOURCES.CONTACT}:${OPERATIONS.CONTACT.CREATE}`,
  CONTACT_DELETE: `${RESOURCES.CONTACT}:${OPERATIONS.CONTACT.DELETE}`,  // New key
  // ... existing keys
};
```

### 2. Create Operation File

```typescript
// nodes/actions/contact/deleteContact.operation.ts
import {
    IExecuteFunctions,
    IDisplayOptions,
    INodeProperties,
    updateDisplayOptions,
} from 'n8n-workflow';
import { executeCommon } from '../../helpers/executeCommon.helper';
import { WasapiClient } from '@wasapi/js-sdk';
import { ServiceFactory } from '../../factories/ServiceFactory';

export const contactDeleteProperties: INodeProperties[] = [
    {
        displayName: 'Contact ID',
        name: 'contact_id',
        type: 'string',
        required: true,
        default: '',
        description: 'ID of the contact to delete',
        displayOptions: {
            show: {
                resource: ['contact'],
                operation: ['delete'],
            },
        },
    },
    {
        displayName: 'Force Delete',
        name: 'force_delete',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Force deletion even if contact has associated data',
        displayOptions: {
            show: {
                resource: ['contact'],
                operation: ['delete'],
            },
        },
    },
];

const displayOptions: IDisplayOptions = {
    show: {
        resource: ['contact'],
        operation: ['delete'],
    },
};

export const deleteContactDescription = updateDisplayOptions(displayOptions, contactDeleteProperties);

export async function executeContactDelete(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await executeCommon.call(this, async (client: WasapiClient, item: any, i: number) => {
        const contactService = ServiceFactory.createContactService(client);
        
        const contactId = this.getNodeParameter('contact_id', i) as string;
        const forceDelete = this.getNodeParameter('force_delete', i, false) as boolean;
        
        return await contactService.deleteContact(contactId, forceDelete);
    });
}
```