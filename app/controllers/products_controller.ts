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
}