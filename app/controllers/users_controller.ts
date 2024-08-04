import type { HttpContext } from '@adonisjs/core/http';
import User from '../models/user.js';

export default class UsersController {
    async signup({ request, response }: HttpContext) {
        const { email, password } = request.only(['email', 'password'])


        // Verifica se o usuário já existe
        const existingUser: User | null = await User.findBy('email', email)
        if (existingUser) {
            return response.badRequest({ message: 'User already exists' })
        }

        // Cria o novo usuário
        const user = new User()
        user.email = email
        user.password = password
        await user.save()

        return response.created({ message: 'User created successfully' })
    }
}