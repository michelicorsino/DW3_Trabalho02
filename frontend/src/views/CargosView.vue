
<template>
  <v-container fluid>
    <v-row class="mb-4" align="center">
      <v-col>
        <h1 class="text-h4 font-weight-bold text-primary">Cargos</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="$router.push('/cargos/novo')">
          Novo Cargo
        </v-btn>
      </v-col>
    </v-row>

    <v-card elevation="2" class="rounded-lg">
      <v-data-table :headers="headers" :items="items" :loading="loading" hover>
        
        <template v-slot:item.salario_base="{ item }">
          {{ formatCurrency(item.salario_base) }}
        </template>

        <template v-slot:item.ativo="{ item }">
          <v-chip :color="item.ativo ? 'green' : 'red'" size="small" variant="flat">
            {{ item.ativo ? 'Ativo' : 'Inativo' }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="small" variant="text" color="blue" 
            @click="$router.push(`/cargos/editar/${item.cargoid}`)">
          </v-btn>
          <v-btn icon="mdi-delete" size="small" variant="text" color="red" @click="confirmDelete(item)"></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Excluir Cargo</v-card-title>
        <v-card-text>Tem certeza que deseja remover o cargo <strong>{{ itemToDelete?.descricao }}</strong>?</v-card-text>
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
const items = ref([])
const dialogDelete = ref(false)
const itemToDelete = ref(null)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const headers = [
  { title: 'Código', key: 'codigo', width: '15%' },
  { title: 'Descrição', key: 'descricao' },
  { title: 'Salário Base', key: 'salario_base' },
  { title: 'Status', key: 'ativo', align: 'center' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' },
]

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const fetchCargos = async () => {
  loading.value = true
  try {
    const response = await api.get('/getAllCargos')
    items.value = response.data.registro || []
  } catch (error) {
    showSnackbar('Erro ao carregar cargos.', 'error')
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
    await api.post('/deleteCargo', { cargoid: itemToDelete.value.cargoid })
    await fetchCargos()
    showSnackbar('Cargo removido com sucesso!', 'success')
  } catch (error) {
    showSnackbar('Erro ao remover cargo. Verifique se não está em uso.', 'error')
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
  fetchCargos()
})
</script>