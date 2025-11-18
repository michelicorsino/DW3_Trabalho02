<template>
  <v-app theme="dark">
    <!-- pegando -->
    <template v-if="showLayout">
      <v-navigation-drawer v-model="drawer" elevation="2">
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          title="Samuel Cardoso"
          subtitle="Admin"
          class="py-4"
        ></v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <template v-for="(item, i) in items" :key="i">
            <v-list-subheader v-if="item.header" :title="item.header"></v-list-subheader>
            
            <v-list-item
              v-else
              :value="item"
              color="primary"
              :prepend-icon="item.icon"
              :title="item.text"
              :to="item.route"
            ></v-list-item>
          </template>
        </v-list>

        <template v-slot:append>
          <div class="pa-2">
            <v-btn block color="error" variant="tonal" prepend-icon="mdi-logout" @click="logout">
              Sair
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>

      <v-app-bar elevation="1">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-app-bar-title>Painel de Controle</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-bell-outline</v-icon>
        </v-btn>
      </v-app-bar>
    </template>

    <v-main>
      <v-container :fluid="showLayout" :class="{'pa-0': !showLayout, 'fill-height': !showLayout}">
        
        <router-view />
        
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const drawer = ref(true)

// Lógica para esconder/mostrar o layout
// Se a rota tiver 'hideLayout: true', showLayout será falso
const showLayout = computed(() => !route.meta.hideLayout)

const items = [
  { text: 'Visão Geral', icon: 'mdi-chart-pie', route: '/dashboard' },
  { header: 'Gestão' },
  { text: 'Funcionários', icon: 'mdi-account-tie', route: '/funcionarios' },
  { text: 'Projetos', icon: 'mdi-rocket-launch', route: '/projetos' },
  { header: 'Cadastros' },
  { text: 'Cargos', icon: 'mdi-badge-account', route: '/cargos' },
  { text: 'Setores', icon: 'mdi-domain', route: '/setores' },
]

const kpis = [
  { title: 'Funcionários', value: '142', icon: 'mdi-account-group', color: 'blue-accent-3', trend: 'Total Ativo' },
  { title: 'Projetos', value: '8', icon: 'mdi-clock-outline', color: 'orange-accent-3', trend: 'Fase de Execução' },
  { title: 'Orçamento', value: 'R$ 450k', icon: 'mdi-cash-multiple', color: 'green-accent-3', trend: 'Comprometido' },
  { title: 'Setores', value: '4', icon: 'mdi-domain', color: 'purple-accent-3', trend: 'Departamentos' },
]

function logout() {
  // Lógica de logout aqui
  router.push('/login')
}
</script>