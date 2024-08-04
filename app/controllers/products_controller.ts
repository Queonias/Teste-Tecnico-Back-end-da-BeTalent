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
}