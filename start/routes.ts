import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller');
const ClientsController = () => import('#controllers/clients_controller');

router.post('/api/users/signup', [UsersController, 'signup']);
router.post('/api/users/login', [UsersController, 'login']);

router.get('/api/clients/list', [ClientsController, 'index']);
