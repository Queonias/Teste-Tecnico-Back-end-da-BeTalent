import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller');
const ClientsController = () => import('#controllers/clients_controller');
const ProductsController = () => import('#controllers/products_controller');

router.post('/api/users/signup', [UsersController, 'signup']);
router.post('/api/users/login', [UsersController, 'login']);

router.get('/api/clients/list', [ClientsController, 'index']);
router.get('/api/clients/:id', [ClientsController, 'show']);
router.post('/api/clients/save', [ClientsController, 'store']);
router.put('/api/clients/:id', [ClientsController, 'update']);
router.delete('/api/clients/:id', [ClientsController, 'destroy']);

router.get('/api/products/list', [ProductsController, 'index']);
router.get('/api/products/:id', [ProductsController, 'show']);
router.post('/api/products/save', [ProductsController, 'store']);
router.put('/api/products/:id', [ProductsController, 'update']);