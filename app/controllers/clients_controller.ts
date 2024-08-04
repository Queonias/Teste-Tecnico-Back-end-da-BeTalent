import type { HttpContext } from '@adonisjs/core/http'

// Models
import Client from '../models/client.js'

export default class ClientsController {
    // Método para listar todos os clientes
    async index({ response }: HttpContext) {
        try {
            const clients: Client[] = await Client.query().select('id', 'name', 'cpf').orderBy('id', 'asc')
            return response.status(200).json(clients)
        } catch (error) {
            return response.status(400).json({ message: 'Error fetching clients', error })
        }
    }
}