import CargosFormView from '@/views/CargosFormView.vue'
import CargosView from '@/views/CargosView.vue'
import DashboardView from '@/views/DashboardView.vue'
import FuncionariosFormView from '@/views/FuncionariosFormView.vue'
import FuncionariosView from '@/views/FuncionariosView.vue'
import LoginView from '@/views/LoginView.vue'
import ProjetosFormView from '@/views/ProjetosFormView.vue'
import ProjetosView from '@/views/ProjetosView.vue'
import SetoresFormView from '@/views/SetoresFormView.vue'
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
      path: '/funcionarios/novo', // Rota para criar
      name: 'funcionarios-novo',
      component: FuncionariosFormView,
    },
    {
      path: '/funcionarios/editar/:id', // Rota para editar (recebe ID)
      name: 'funcionarios-editar',
      component: FuncionariosFormView,
    },
    {
      path: '/cargos',
      name: 'cargos',
      component: CargosView,
    },
    {
      path: '/cargos/novo',
      name: 'cargos-novo',
      component: CargosFormView,
    },
    {
      path: '/cargos/editar/:id',
      name: 'cargos-editar',
      component: CargosFormView,
    },
    {
      path: '/setores',
      name: 'Setores',
      component: SetoresView,
    },
    {
      path: '/setores/novo',
      name: 'setores-novo',
      component: SetoresFormView,
    },
    {
      path: '/setores/editar/:id',
      name: 'setores-editar',
      component: SetoresFormView,
    },
    {
      path: '/projetos',
      name: 'projetos',
      component: ProjetosView,
    },
    {
      path: '/projetos/novo',
      name: 'projetos-novo',
      component: ProjetosFormView,
    },
    {
      path: '/projetos/editar/:id',
      name: 'projetos-editar',
      component: ProjetosFormView,
    },
  ],
})

// ... importações e definição das rotas ...

// --- BLOQUEIO DE ROTAS (Navigation Guard) ---
router.beforeEach((to, from, next) => {
  // 1. Lista de rotas públicas (que não precisam de login)
  const publicPages = ['/', '/login']; 
  const authRequired = !publicPages.includes(to.path);
  
  // 2. Verifica se tem o token no localStorage
  const loggedIn = localStorage.getItem('token');

  // 3. Se a rota precisa de auth e não tem token -> Manda pro Login
  if (authRequired && !loggedIn) {
    return next('/');
  }

  // 4. Se o usuário já está logado e tenta ir pro login -> Manda pro Dashboard
  if (to.path === '/' && loggedIn) {
    return next('/dashboard');
  }

  next(); // Deixa passar
});

export default router
