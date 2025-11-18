<template>
  <v-app theme="dark">


    <v-main>
      <v-container fluid>
        
        <v-row>
          <v-col cols="12" sm="6" md="3" v-for="kpi in kpis" :key="kpi.title">
            <v-card class="mx-auto" elevation="2">
              <v-card-item :title="kpi.title">
                <template v-slot:subtitle>
                  <v-icon :color="kpi.color" size="small" class="me-1">{{ kpi.icon }}</v-icon>
                  {{ kpi.trend }}
                </template>
              </v-card-item>
              <v-card-text class="py-0">
                <div class="text-h4 font-weight-bold">{{ kpi.value }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-4">
          <v-col cols="12">
             <v-card title="Últimas Atividades" text="Dados da tabela entrariam aqui..."></v-card>
          </v-col>
        </v-row>

      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import router from '@/router'
const drawer = ref(true)

const items = [
  { text: 'Visão Geral', icon: 'mdi-chart-pie', route: '/dashboard' },
  { header: 'Gestão' }, // Separador visual
  { text: 'Funcionários', icon: 'mdi-account-tie', route: '/funcionarios' },
  { text: 'Projetos', icon: 'mdi-rocket-launch', route: '/projetos' },
  { header: 'Cadastros' },
  { text: 'Cargos', icon: 'mdi-badge-account', route: '/cargos' },
  { text: 'Setores', icon: 'mdi-domain', route: '/setores' },
]

const kpis = [
  { title: 'Funcionários', value: '142', icon: 'mdi-account-group', color: 'blue-accent-3', trend: 'Total Ativo' },
  { title: 'Projetos em Andamento', value: '8', icon: 'mdi-clock-outline', color: 'orange-accent-3', trend: 'Fase de Execução' },
  { title: 'Orçamento Projetos', value: 'R$ 450k', icon: 'mdi-cash-multiple', color: 'green-accent-3', trend: 'Total Comprometido' },
  { title: 'Setores', value: '4', icon: 'mdi-domain', color: 'purple-accent-3', trend: 'Departamentos' },
]

// function navigate(route) {
//   console.log('Navegando para:', route)
// }
</script>