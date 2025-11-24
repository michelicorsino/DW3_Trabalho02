funcionários view

<template>
  <v-container fluid>
    <v-row class="mb-4" align="center">
      <v-col>
        <h1 class="text-h4 font-weight-bold text-primary">Funcionários</h1>
        <span class="text-caption text-medium-emphasis">Gerencie a equipe, cargos e alocações</span>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" prepend-icon="mdi-plus" size="large" @click="$router.push('/funcionarios/novo')">
          Novo Funcionário
        </v-btn>
      </v-col>
    </v-row>

    <v-card elevation="2" class="rounded-lg">
      <v-data-table
        :headers="headers"
        :items="funcionarios"
        :loading="loading"
        hover
      >
        <template v-slot:item.ativo="{ item }">
          <v-chip :color="!item.deleted ? 'green' : 'red'" size="small" variant="flat" class="font-weight-bold">
            {{ !item.deleted ? 'Ativo' : 'Inativo' }}
          </v-chip>
        </template>

        <template v-slot:item.salario="{ item }">
          {{ formatCurrency(item.salario) }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="small" variant="text" color="blue" class="mr-2" 
            @click="$router.push(`/funcionarios/editar/${item.funcionarioid}`)">
          </v-btn>
          
          <v-btn icon="mdi-delete" size="small" variant="text" color="red" @click="confirmDelete(item)"></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Exclusão</v-card-title>
        <v-card-text>Tem certeza que deseja excluir o funcionário <strong>{{ itemToDelete?.nome }}</strong>?</v-card-text>
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
const funcionarios = ref([])
const dialogDelete = ref(false)
const itemToDelete = ref(null)

// Feedback visual
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const headers = [
  { title: 'Matrícula', key: 'matricula', align: 'start' },
  { title: 'Nome', key: 'nome' },
  { title: 'Cargo', key: 'cargo_descricao' },
  { title: 'Setor', key: 'setor_nome' },
  { title: 'Salário', key: 'salario', align: 'end' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' },
]

const formatCurrency = (value) => {
  if (!value) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const fetchFuncionarios = async () => {
  loading.value = true
  try {
    const response = await api.get('/getAllFuncionarios')
    funcionarios.value = response.data.registro || []
  } catch (error) {
    showSnackbar('Erro ao carregar funcionários.', 'error')
  } finally {
    loading.value = false
  }
}

// Abre o modal de confirmação
const confirmDelete = (item) => {
  itemToDelete.value = item
  dialogDelete.value = true
}

const closeDelete = () => {
  dialogDelete.value = false
  itemToDelete.value = null
}

// Executa a exclusão real
const deleteItemConfirm = async () => {
  if (!itemToDelete.value) return
  
  try {
    await api.post('/deleteFuncionario', { funcionarioid: itemToDelete.value.funcionarioid })
    await fetchFuncionarios()
    showSnackbar('Funcionário excluído com sucesso!', 'success')
  } catch (error) {
    showSnackbar('Erro ao excluir funcionário.', 'error')
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
  fetchFuncionarios()
})
</script>