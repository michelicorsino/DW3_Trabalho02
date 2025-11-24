<template>
  <v-container fluid>
    <v-row class="mb-4" align="center">
      <v-col>
        <h1 class="text-h4 font-weight-bold text-primary">Projetos</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" prepend-icon="mdi-plus" size="large" @click="$router.push('/projetos/novo')">
          Novo Projeto
        </v-btn>
      </v-col>
    </v-row>

    <v-card elevation="2" class="rounded-lg">
      <v-data-table :headers="headers" :items="projetos" :loading="loading" hover>
        
        <template v-slot:item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" size="small" variant="flat" class="font-weight-bold">
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.datainicio="{ item }">
          {{ formatDateDisplay(item.datainicio) }}
        </template>
        <template v-slot:item.datafim="{ item }">
          {{ formatDateDisplay(item.datafim) }}
        </template>

        <template v-slot:item.orcamento="{ item }">
          {{ formatCurrency(item.orcamento) }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="small" variant="text" color="blue" class="mr-2"
            @click="$router.push(`/projetos/editar/${item.projetoid}`)">
          </v-btn>
          <v-btn icon="mdi-delete" size="small" variant="text" color="red" @click="confirmDelete(item)"></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Excluir Projeto</v-card-title>
        <v-card-text>Tem certeza que deseja remover o projeto <strong>{{ itemToDelete?.nome }}</strong>?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancelar</v-btn>
          <v-btn color="red-darken-1" variant="elevated" @click="deleteItemConfirm">Excluir</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar = false">Fechar</v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const loading = ref(false)
const projetos = ref([])
const dialogDelete = ref(false)
const itemToDelete = ref(null)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const headers = [
  { title: 'Cód.', key: 'codigo' },
  { title: 'Projeto', key: 'nome' },
  { title: 'Início', key: 'datainicio' },
  { title: 'Fim', key: 'datafim' },
  { title: 'Status', key: 'status' },
  { title: 'Orçamento', key: 'orcamento' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' },
]

function getStatusColor(status) {
  if (status === 'Concluído') return 'green'
  if (status === 'Em Andamento') return 'blue'
  if (status === 'Cancelado') return 'red'
  return 'grey'
}

function formatCurrency(val) {
  if (!val) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
}

function formatDateDisplay(dataStr) {
  if (!dataStr) return '-'
  const date = new Date(dataStr)
  return date.toLocaleDateString('pt-BR')
}

const fetchProjetos = async () => {
  loading.value = true
  try {
    const response = await api.get('/getAllProjetos')
    projetos.value = response.data.registro || []
  } catch (error) {
    showSnackbar('Erro ao carregar projetos.', 'error')
  } finally {
    loading.value = false
  }
}

const confirmDelete = (item) => {
  itemToDelete.value = item
  dialogDelete.value = true
}

const closeDelete = () => {
  dialogDelete.value = false
  itemToDelete.value = null
}

const deleteItemConfirm = async () => {
  if (!itemToDelete.value) return
  try {
    await api.post('/deleteProjeto', { projetoid: itemToDelete.value.projetoid })
    await fetchProjetos()
    showSnackbar('Projeto removido com sucesso!', 'success')
  } catch (error) {
    showSnackbar('Erro ao remover projeto.', 'error')
  } finally {
    closeDelete()
  }
}

const showSnackbar = (text, color) => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

onMounted(() => {
  fetchProjetos()
})
</script>