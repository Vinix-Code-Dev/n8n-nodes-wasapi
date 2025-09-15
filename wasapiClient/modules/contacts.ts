import { CreateContact, IN8nHttpClient, SearchContactParams, UpdateContactParams, AssingAgentContact } from '../types';
import { AddLabelContact, RemoveLabelContact } from '../types';
import { ExportContactsRequest, isValidExportContactsRequest } from '../validator/exportContacts';

export class ContactsModule {
	constructor(private client: IN8nHttpClient) { }
	protected enableMake: number = 1;
	// GET https://api-ws.wasapi.io/api/v1/contacts consulta todos los contactos
	async getAll(): Promise<any> {
		const response = await this.client.get('/contacts');
		return response.data;
	}

	// GET https://api-ws.wasapi.io/api/v1/contacts?page={page}&search={search}&labels={labels} consulta los contactos por nombre, email, telefono, etiquetas o paginacion
	async getSearch({ search, labels, page }: SearchContactParams): Promise<any> {
		const paramsSearch = new URLSearchParams();
		if (search) paramsSearch.append('search', search);
		if (labels) paramsSearch.append('labels', labels.toString());
		if (page) paramsSearch.append('page', page.toString());
		const response = await this.client.get(`/contacts?${paramsSearch.toString()}`);
		return response.data;
	}

	// GET https://api-ws.wasapi.io/api/v1/contacts/{wa_id} consulta un contacto por su wa_id
	async getById(wa_id: string): Promise<any> {
		const response = await this.client.get(`/contacts/${wa_id}`);
		return response.data;

	}

	// POST https://api-ws.wasapi.io/api/v1/contacts crea un nuevo contacto
	async create({ first_name, last_name, email, country_code, phone, ...options }: CreateContact): Promise<any> {
		const data = { first_name, last_name, email, country_code, phone, ...options }
		const response = await this.client.post('/contacts', data);
		return response.data;
	}

	// PUT https://api-ws.wasapi.io/api/v1/contacts/{wa_id} actualiza un contacto existente
	async update({ wa_id, data }: UpdateContactParams): Promise<any> {
		const response = await this.client.put(`/contacts/${wa_id}`, data);
		return response.data;
	}

	// DELETE https://api-ws.wasapi.io/api/v1/contacts/{wa_id} elimina un contacto existente
	async delete(wa_id: string): Promise<any> {
		const response = await this.client.delete(`/contacts/${wa_id}`);
		return response.data;
	}
	// POST https://api-ws.wasapi.io/api/v1/contacts/{wa_id}/add-labels agrega etiquetas a un contacto
	async addLabel({ contact_uuid, label_id }: AddLabelContact): Promise<any> {
		const data = { labels: label_id, from_make: this.enableMake }
		const response = await this.client.post(`/contacts/${contact_uuid}/add-labels`, data);
		return response.data;
	}
	// POST https://api-ws.wasapi.io/api/v1/contacts/{wa_id}/remove-labels elimina etiquetas de un contacto
	async removeLabel({ contact_uuid, label_id }: RemoveLabelContact): Promise<any> {
		const data = { labels: label_id, from_make: this.enableMake }
		const response = await this.client.post(`/contacts/${contact_uuid}/remove-labels`, data);
		return response.data;
	}
	// POST https://api-ws.wasapi.io/api/v1/contacts/{wa_id}/assing-agent asigna un agente a un contacto en automatico
	async assingAgentAutomatic({ contact_uuid }: AssingAgentContact): Promise<any> {
		const response = await this.client.post(`/contacts/${contact_uuid}/assing-agent?from_make=${this.enableMake}`);
		return response.data;
	}

	/**
	 * Exporta los contactos del sistema y los envía por correo electrónico
	 * @param data - Datos de exportación con emails de destino
	 * @returns Promise<void>
	 */
	async export(data: ExportContactsRequest): Promise<any> {
		// Validar la solicitud antes de enviarla
		if (!isValidExportContactsRequest(data)) {
			throw new Error('Invalid export request: maximum 5 valid emails allowed');
		}

		const response = await this.client.post('/export-contacts', data);
		return response.data;
	}
}
