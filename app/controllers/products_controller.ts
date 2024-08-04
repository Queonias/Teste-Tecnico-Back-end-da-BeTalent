import type { HttpContext } from '@adonisjs/core/http'
import Product from '../models/product.js'

export default class ProductsController {
    // Método para listar todos os produtos
    async index({ response }: HttpContext) {
        try {
            const products: Product[] = await Product.query().where('is_deleted', false).select('id', 'name', 'price').orderBy('name', 'asc')
            return response.status(200).json(products)
        } catch (error) {
            return response.status(400).json({ message: 'Error fetching products', error })
        }
    }

    // Método para exibir detalhes de um produto
    async show({ params, response }: HttpContext) {
        try {
            const product: Product = await Product.query().where('id', params.id).andWhere('is_deleted', false).firstOrFail()
            return response.status(200).json(product)
        } catch (error) {
            return response.status(404).json({ message: 'Product not found', error })
        }
    }

    // Método para criar um novo produto
    async store({ request, response }: HttpContext) {
        try {
            const data = request.only(['name', 'price', 'description'])
            const product: Product = await Product.create(data)
            return response.status(201).json(product)
        } catch (error) {
            return response.status(400).json({ message: 'Error creating product', error })
        }
    }

    // Método para atualizar um produto
    async update({ params, request, response }: HttpContext) {
        try {
            const product: Product = await Product.findOrFail(params.id)
            const data = request.only(['name', 'price', 'description'])

            product.merge(data)
            await product.save()

            return response.status(200).json(product)
        } catch (error) {
            return response.status(400).json({ message: 'Error updating product', error })
        }
    }
}