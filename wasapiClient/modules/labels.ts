import { IN8nHttpClient } from '../types';
import { CreateLabel } from '../types';

export class LabelsModule {
    constructor(private client: IN8nHttpClient) {}

    // Get https://api-ws.wasapi.io/api/v1/labels consultar todas las etiquetas
    async getAll(): Promise<any> {
			const response = await this.client.get('/labels');
			return response.data;
	}

	// POST https://api-ws.wasapi.io/api/v1/labels/search Buscar etiquetas por nombre

	async getSearch(name: string): Promise<any> {
			const response = await this.client.post('/labels/search', { name });
			return response.data;
	}
	// POST https://api-ws.wasapi.io/api/v1/labels/{id} Obtener una etiqueta por id

	async getById(id: string): Promise<any> {
			const response = await this.client.get(`/labels/${id}`);
			return response.data;
	}

	// POST https://api-ws.wasapi.io/api/v1/labels Crear una etiqueta
	async create({ title, description, color }: CreateLabel): Promise<any> {
			const data = { title, description, color }
			const response = await this.client.post('/labels', data);
			return response.data;
	}
	// PUT https://api-ws.wasapi.io/api/v1/labels/{id} Actualizar una etiqueta
	async update(data: { id: string, data: CreateLabel }): Promise<any> {
			const response = await this.client.put(`/labels/${data.id}`, data.data);
			return response.data;
	}

	// DELETE https://api-ws.wasapi.io/api/v1/labels/{id} Eliminar una etiqueta
	async delete(id: string): Promise<any> {
			const response = await this.client.delete(`/labels/${id}`);
			return response.data;
	}

}
