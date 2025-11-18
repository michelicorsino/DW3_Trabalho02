import CargosView from '@/views/CargosView.vue'
import DashboardView from '@/views/DashboardView.vue'
import FuncionariosView from '@/views/FuncionariosView.vue'
import LoginView from '@/views/LoginView.vue'
import ProjetosView from '@/views/ProjetosView.vue'
import SetoresView from '@/views/SetoresView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
{
      path: '/',
      name: 'login',
      component: LoginView,
      meta: { hideLayout: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/funcionarios',
      name: 'funcionarios',
      component: FuncionariosView,
    },
    {
      path: '/cargos',
      name: 'cargos',
      component: CargosView,
    },
    {
      path: '/setores',
      name: 'Setores',
      component: SetoresView,
    },
    {
      path: '/projetos',
      name: 'projetos',
      component: ProjetosView,
    },
  ],
})

export default router
