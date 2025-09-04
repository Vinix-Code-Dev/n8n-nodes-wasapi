export function handleLoadOptionsError(error: any): any[] {
    return [
        {
            name: `❌ Connection error: ${error.message || 'Unknown'}`,
            value: '',
        },
    ];
}

export function handleListSearchError(error: any): { results: any[] } {
    return {
        results: [
            {
                name: `❌ Connection error: ${error.message || 'Unknown'}`,
                value: '',
            },
        ],
    };
}
