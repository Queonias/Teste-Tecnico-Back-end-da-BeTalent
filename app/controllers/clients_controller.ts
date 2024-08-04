import type { HttpContext } from '@adonisjs/core/http'

// Models
import Client from '../models/client.js'
import Sale from '../models/sale.js'

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

    // Método para exibir detalhes de um cliente e suas vendas
    async show({ params, request, response }: HttpContext) {
        const clientId = params.id

        // Obtém os parâmetros de mês e ano da query string (para filtragem)
        const { month, year } = request.qs()

        try {
            const client: Client = await Client.findOrFail(clientId)

            // Cria uma query para buscar as vendas do cliente, ordenadas pela data de venda em ordem decrescente
            let salesQuery = Sale.query().where('client_id', clientId).orderBy('sale_date', 'desc')

            // Se os parâmetros de mês e ano estão presentes, adiciona filtros para eles na query
            if (month && year) {
                salesQuery = salesQuery
                    .whereRaw('MONTH(sale_date) = ?', [month]) // Filtra pelo mês da venda
                    .andWhereRaw('YEAR(sale_date) = ?', [year]) // Filtra pelo ano da venda
            }

            // Executa a query e obtém as vendas
            const sales = await salesQuery.exec()

            return response.status(200).json({
                client: {
                    id: client.id,
                    name: client.name,
                    cpf: client.cpf,
                    createdAt: client.createdAt,
                    updatedAt: client.updatedAt
                },
                sales
            })
        } catch (error) {
            return response.status(400).json({ message: 'Error fetching client details', error })
        }
    }
}