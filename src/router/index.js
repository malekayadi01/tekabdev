import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/LoginPage.vue';
import Dashboard from '../components/DashboradPage.vue';
import UserPage from '@/components/UserPage.vue';
const routes = [
  { path: '/', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/UserPage', component: UserPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
