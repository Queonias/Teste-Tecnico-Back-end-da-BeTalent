import type { HttpContext } from '@adonisjs/core/http'
import Database from '@adonisjs/lucid/services/db'

// Models
import Client from '../models/client.js'
import Sale from '../models/sale.js'
import Address from '../models/address.js'
import Phone from '../models/phone.js'

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

            // Cria uma query para busca no banco de dados
            let salesQuery = Sale.query().where('client_id', clientId).orderBy('sale_date', 'desc')
            let addressesQuery = Address.query().where('client_id', clientId)
            let phonesQuery = Phone.query().where('client_id', clientId)

            // Se os parâmetros de mês e ano estão presentes, adiciona filtros para eles na query
            if (month && year) {
                salesQuery = salesQuery
                    .whereRaw('MONTH(sale_date) = ?', [month]) // Filtra pelo mês da venda
                    .andWhereRaw('YEAR(sale_date) = ?', [year]) // Filtra pelo ano da venda
            }

            // Executa as query e retorna os resultados
            const sales: Sale[] = await salesQuery.exec()
            const address: Address[] = await addressesQuery.exec()
            const phones: Phone[] = await phonesQuery.exec()

            return response.status(200).json({
                id: client.id,
                name: client.name,
                cpf: client.cpf,
                addresses: address,
                phones: phones,
                sales: sales
            })
        } catch (error) {
            return response.status(400).json({ message: 'Error fetching client details', error })
        }
    }

    // Método para criar um novo cliente
    async store({ request, response }: HttpContext) {
        const trx = await Database.transaction()
        try {
            // Cria e salva um novo cliente usando a transação
            const { name, cpf, addresses, phones } = request.all();
            const client = new Client()
            client.name = name
            client.cpf = cpf
            client.useTransaction(trx)
            await client.save()

            // Salva os endereços, telefones e vendas do cliente
            if (addresses && addresses.length > 0) {
                for (const addressData of addresses) {
                    const address = new Address()
                    address.street = addressData.street
                    address.number = addressData.number
                    address.neighborhood = addressData.neighborhood
                    address.city = addressData.city
                    address.state = addressData.state
                    address.cep = addressData.cep
                    address.client_id = client.id
                    address.useTransaction(trx)
                    await address.save()
                }
            }

            // Salva os telefones do cliente
            if (phones && phones.length > 0) {
                for (const phoneData of phones) {
                    const phone = new Phone()
                    phone.number = phoneData.number
                    phone.client_id = client.id
                    phone.useTransaction(trx)
                    await phone.save()
                }
            }

            // Commit da transação se tudo der certo
            await trx.commit()
            return response.status(201).json(client)

        } catch (error) {
            await trx.rollback()
            return response.status(400).json({ message: 'Error saving client', error })
        }
    }

    // Método para atualizar um cliente e seus endereços e telefones relacionados
    async update({ params, request, response }: HttpContext) {
        const clientId = params.id
        const { name, cpf, addresses, phones } = request.all();

        // Início da transação
        const trx = await Database.transaction()

        try {
            // Obtém o cliente
            const client: Client = await Client.findOrFail(clientId)
            client.name = name
            client.cpf = cpf
            client.useTransaction(trx)
            await client.save()

            // Atualiza os endereços do cliente
            if (addresses && addresses.length > 0) {
                await Address.query({ client: trx }).where('client_id', clientId).delete()
                for (const addressData of addresses) {
                    const address = new Address()
                    address.street = addressData.street
                    address.number = addressData.number
                    address.neighborhood = addressData.neighborhood
                    address.city = addressData.city
                    address.state = addressData.state
                    address.cep = addressData.cep
                    address.client_id = client.id
                    address.useTransaction(trx)
                    await address.save()
                }
            }

            // Atualiza os telefones do cliente
            if (phones && phones.length > 0) {
                await Phone.query({ client: trx }).where('client_id', clientId).delete()
                for (const phoneData of phones) {
                    const phone = new Phone()
                    phone.number = phoneData.number
                    phone.client_id = client.id
                    phone.useTransaction(trx)
                    await phone.save()
                }
            }

            await trx.commit()
            return response.status(200).json(client)
        } catch (error) {
            await trx.rollback()
            return response.status(400).json({ message: 'Erro ao atualizar o cliente', error })
        }
    }

    // Método para deletar um cliente e suas vendas, endereços e telefones relacionados
    async destroy({ params, response }: HttpContext) {
        const clientId = params.id

        const trx = await Database.transaction()

        try {
            const client: Client = await Client.findOrFail(clientId)

            await Sale.query({ client: trx }).where('client_id', clientId).delete()
            await Address.query({ client: trx }).where('client_id', clientId).delete()
            await Phone.query({ client: trx }).where('client_id', clientId).delete()

            await client.useTransaction(trx).delete()
            await trx.commit()

            return response.status(200).json({ message: 'Clientes e vendas relacionadas, endereços e telefones excluídos com sucesso' })
        } catch (error) {
            await trx.rollback()
            return response.status(400).json({ message: 'Erro ao excluir cliente e vendas relacionadas', error })
        }
    }
}