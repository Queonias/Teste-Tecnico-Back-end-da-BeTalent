import type { HttpContext } from '@adonisjs/core/http';
import User from '../models/user.js';

export default class UsersController {
    async signup({ request, response }: HttpContext) {
        const { email, password } = request.all()


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

    async login({ request, response, auth }: HttpContext) {
        const { email, password } = request.all()
        // Verifica se as credenciais estão corretas
        const user: User = await User.verifyCredentials(email, password)

        // Gera o token JWT
        const token = await auth.use('jwt').generate(user)

        return response.ok({ token })
    }
}