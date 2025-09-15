import { N8nHttpClient } from './client';
import { WasapiConfig } from './types';
import { BotModule } from './modules/bot';
import { CampaignsModule } from './modules/campaigns';
import { ContactsModule } from './modules/contacts';
import { CustomFieldsModule } from './modules/customFields';
import { LabelsModule } from './modules/labels';
import { MetricsModule } from './modules/metrics';
import { UserModule } from './modules/user';
import { WhatsappModule } from './modules/whatsapp';

export class WasapiClient {
    private client: N8nHttpClient;
    private config: WasapiConfig;

    public campaigns: CampaignsModule;
    public contacts: ContactsModule;
    public customFields: CustomFieldsModule;
    public bot: BotModule;
    public labels: LabelsModule;
    public metrics: MetricsModule;
    public user: UserModule;
    public whatsapp: WhatsappModule;

    constructor(config: WasapiConfig | string, executeFunctions?: any) {
        if (typeof config === 'string') {
            this.config = { apiKey: config };
        } else {
            this.config = config;
        }

        this.client = new N8nHttpClient(this.config.apiKey, this.config.baseURL, executeFunctions);
        this.campaigns = new CampaignsModule(this.client);
        this.contacts = new ContactsModule(this.client);
        this.customFields = new CustomFieldsModule(this.client);
        this.bot = new BotModule(this.client);
        this.labels = new LabelsModule(this.client);
        this.metrics = new MetricsModule(this.client);
        this.user = new UserModule(this.client);
        this.whatsapp = new WhatsappModule(this.client);
    }

    // Method to get client instance
    public getClient(): N8nHttpClient {
        return this.client;
    }

    public getConfig(): WasapiConfig {
        return this.config;
    }

    // Method to set execute context for HTTP requests
    public setExecuteContext(executeFunctions: any): void {
        (this.client as any).executeFunctions = executeFunctions;
    }

    // Method to validate connection
    public async validateConnection(): Promise<boolean> {
        return await this.client.validateConnection();
    }
}

// Export all types and classes
export * from './types';
export { N8nHttpClient } from './client';
