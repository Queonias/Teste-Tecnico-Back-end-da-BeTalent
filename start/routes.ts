import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller');

router.post('/api/users/signup', [UsersController, 'signup']);
