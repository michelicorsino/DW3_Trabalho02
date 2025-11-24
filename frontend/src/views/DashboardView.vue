

<template>
  <v-container fluid>
    <v-row>
      <v-col v-if="loading" cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>

      <template v-else>
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
      </template>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
         <v-card title="Resumo do Sistema" subtitle="Dados atualizados em tempo real" elevation="2">
            <v-card-text>
              O sistema está operando normalmente. As métricas acima refletem os dados cadastrados no banco de dados.
            </v-card-text>
         </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const loading = ref(true)

// Estrutura inicial dos KPIs
const kpis = ref([
  { 
    title: 'Funcionários', 
    value: '0', 
    icon: 'mdi-account-group', 
    color: 'blue-accent-3', 
    trend: 'Total Ativo' 
  },
  { 
    title: 'Projetos em Andamento', 
    value: '0', 
    icon: 'mdi-clock-outline', 
    color: 'orange-accent-3', 
    trend: 'Fase de Execução' 
  },
  { 
    title: 'Orçamento Projetos', 
    value: 'R$ 0,00', 
    icon: 'mdi-cash-multiple', 
    color: 'green-accent-3', 
    trend: 'Total Comprometido' 
  },
  { 
    title: 'Setores', 
    value: '0', 
    icon: 'mdi-domain', 
    color: 'purple-accent-3', 
    trend: 'Departamentos' 
  },
])

// Função para formatar moeda
const formatCurrency = (val) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
}

// Carregar e Calcular Dados
const fetchDashboardData = async () => {
  loading.value = true
  try {
    // Fazemos as 3 requisições em paralelo para ser mais rápido
    const [funcionariosRes, projetosRes, setoresRes] = await Promise.all([
      api.get('/getAllFuncionarios'),
      api.get('/getAllProjetos'),
      api.get('/getAllSetores')
    ])

    // 1. Processar Funcionários
    const totalFuncionarios = funcionariosRes.data.registro ? funcionariosRes.data.registro.length : 0
    
    // 2. Processar Projetos (Filtrar apenas 'Em Andamento' e somar orçamento)
    const projetos = projetosRes.data.registro || []
    const projetosAndamento = projetos.filter(p => p.status === 'Em Andamento')
    const totalOrcamento = projetosAndamento.reduce((acc, curr) => acc + Number(curr.orcamento || 0), 0)

    // 3. Processar Setores
    const totalSetores = setoresRes.data.registro ? setoresRes.data.registro.length : 0

    // Atualizar os valores na tela
    kpis.value[0].value = totalFuncionarios.toString()
    kpis.value[1].value = projetosAndamento.length.toString()
    kpis.value[2].value = formatCurrency(totalOrcamento)
    kpis.value[3].value = totalSetores.toString()

  } catch (error) {
    console.error('Erro ao carregar dashboard:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>