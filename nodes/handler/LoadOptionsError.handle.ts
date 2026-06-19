import { INodeListSearchResult, INodePropertyOptions } from "n8n-workflow";

export function handleLoadOptionsError(error: unknown): INodePropertyOptions[] {
    return [
        {
            name: `Connection error: ${(error as Error).message || 'Unknown'}`,
            value: '',
        },
    ];
}

export function handleListSearchError(error: unknown): INodeListSearchResult {
    return {
        results: [
            {
                name: `Connection error: ${(error as Error).message || 'Unknown'}`,
                value: '',
            },
        ],
    };
}
