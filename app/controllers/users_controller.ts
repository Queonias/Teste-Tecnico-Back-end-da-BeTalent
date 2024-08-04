import type { HttpContext } from '@adonisjs/core/http';
import User from '../models/user.js';
import hash from '@adonisjs/core/services/hash'

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

    async login({ request, response, auth }: HttpContext) {
        const { email, password } = request.all()
        // Verifica se o usuário existe
        const user = await User.verifyCredentials(email, password)
        if (!user) {
            return response.badRequest({ message: 'Invalid email or password' })
        }

        // Verifica a senha
        const isSame = await hash.verify(user.password, password)
        if (!isSame) {
            return response.badRequest({ message: 'Invalid email or password' })
        }

        // Gera o token JWT
        const token = await auth.use('jwt').generate(user)

        return response.ok({ token })
    }
}