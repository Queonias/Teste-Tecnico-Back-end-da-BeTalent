import router from '@adonisjs/core/services/router';
import { middleware } from './kernel.js';

const UsersController = () => import('#controllers/users_controller');
const ClientsController = () => import('#controllers/clients_controller');
const ProductsController = () => import('#controllers/products_controller');
const SalesController = () => import('#controllers/sales_controller');

// Rotas de autenticação
router.post('/api/users/signup', [UsersController, 'signup']);
router.post('/api/users/login', [UsersController, 'login']);

router.group(() => {
    // Rotas de clientes
    router.get('/api/clients/list', [ClientsController, 'index']);
    router.get('/api/clients/:id', [ClientsController, 'show']);
    router.post('/api/clients/save', [ClientsController, 'store']);
    router.put('/api/clients/:id', [ClientsController, 'update']);
    router.delete('/api/clients/:id', [ClientsController, 'destroy']);

    // Rotas de produtos
    router.get('/api/products/list', [ProductsController, 'index']);
    router.get('/api/products/:id', [ProductsController, 'show']);
    router.post('/api/products/save', [ProductsController, 'store']);
    router.put('/api/products/:id', [ProductsController, 'update']);
    router.delete('/api/products/:id', [ProductsController, 'destroy']);

    // Rotas de vendas
    router.post('/api/sales/save', [SalesController, 'store']);
}).use(middleware.auth()); // Middleware de autenticação

