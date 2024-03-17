import { createRouter, createWebHistory } from "vue-router";

import Clients from '@/views/Clients.vue';
import Services from '@/views/Services.vue';
import Orders from '@/views/Orders.vue';

const routes = [
    {
        path: '/clients',
        name: 'Clients',
        component: Clients
    },
    {
        path: '/services',
        name: 'Services',
        component: Services
    },
    {
        path: '/orders',
        name: 'Orders',
        component: Orders
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;