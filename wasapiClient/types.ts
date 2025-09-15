// ===== CORE TYPES =====
export interface WasapiConfig {
	apiKey: string;
	baseURL?: string;
}

// ===== WHATSAPP TYPES =====
export interface SendMessage {
	wa_id: string;
	from_id: number;
	message: string;
}

export interface SendAttachment {
	from_id: number;
	wa_id: string;
	file: 'image_url' | 'video_url' | 'document_url' | 'audio_url';
	image_url?: string;
	video_url?: string;
	document_url?: string;
	audio_url?: string;
	caption?: string;
	filename?: string;
}

export interface SendAttachmentParams {
	from_id: number;
	wa_id: string;
	filePath: string;
	caption?: string;
	filename?: string;
}

// ===== FLOW TYPES =====
export interface SendFlow {
	wa_id: string;
	message: string;
	phone_id: number;
	cta: string;
	screen: string;
	flow_id: string;
	action?: 'navigate' | 'data_exchange';
}

export interface GetFlowAssets {
	flow_id: string;
	phone_id: number;
}
// ===== TEMPLATE TYPES =====
export interface TemplateVariable {
	text: string;
	val: string | number;
}

export interface SendTemplate {
	recipients: string;
	template_id: string;
	contact_type: 'phone' | 'contact';
	from_id?: number;
	file?: 'document' | 'video' | 'image' | 'audio';
	url_file?: string;
	file_name?: string;
	body_vars?: TemplateVariable[];
	header_var?: TemplateVariable[];
	cta_var?: TemplateVariable[];
	chatbot_status?: 'enable' | 'disable' | 'disable_permanently';
	conversation_status?: 'open' | 'hold' | 'closed' | 'unchanged';
	agent_id?: number;
	origin?: 'n8m' | 'make';
}

export interface ChangeStatusParams {
	wa_id: string;
	from_id: number;
	status: 'open' | 'hold' | 'closed';
	message: string;
	agent_id: number;
	origin: 'n8n';
}

// ===== CONTACT TYPES =====

export interface BaseContact {
  first_name: string;
  last_name?: string;
  email?: string;
  country_code?: string;
  phone: string;
  notes?: string;
  blocked?: boolean | number;
  unsubscribed?: boolean | number;
}

export interface CreateContact extends BaseContact {
	blocked?: boolean;
	unsubscribed?: boolean;
	labels?: number[];
	custom_fields?: Record<string, unknown>;
}

export interface AddLabelContact {
	contact_uuid: string;
	label_id: number[];
}
export interface UpdateContactParams { wa_id: string; data: CreateContact }
export interface SearchContactParams { search?: string; labels?: number; page?: number; }

export interface RemoveLabelContact  extends AddLabelContact{
}

export interface AssingAgentContact {
	contact_uuid: string;
}

export interface ContactSearchParams {
	search?: string;
	labels?: number;
	page?: number;
}

export interface ContactExportRequest {
	email_urls?: string[];
}
// ===== BOT TYPES =====
export interface BotStatusRequest {
	from_id: number;
	action: 'enable' | 'disable' | 'disable_permanently';
}

export interface BotStatusParams {
	wa_id: string;
	data: BotStatusRequest;
}

// ===== LABEL TYPES =====
export interface CreateLabel {
	title: string;
	description?: string;
	color: string;
}

export interface UpdateLabel {
	id: string;
	data: CreateLabel;
}

// ===== CUSTOM FIELD TYPES =====
export interface CreateCustomField {
	name: string;
}

export interface UpdateCustomField {
	id: string;
	data: CreateCustomField;
}


// ===== HTTP CLIENT INTERFACE =====
export interface IN8nHttpClient {
	get(url: string, config?: any): Promise<any>;
	post(url: string, data?: any, config?: any): Promise<any>;
	put(url: string, data?: any, config?: any): Promise<any>;
	delete(url: string, config?: any): Promise<any>;
	validateConnection(): Promise<boolean>;
}
