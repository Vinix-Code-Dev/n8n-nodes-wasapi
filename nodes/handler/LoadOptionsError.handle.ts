export function handleLoadOptionsError(error: any): any[] {
    return [
        {
            name: `❌ Connection error: ${error.message || 'Unknown'}`,
            value: '',
        },
    ];
}