<template>
  <v-container fluid>
    <v-row class="mb-4" align="center">
      <v-col>
        <h1 class="text-h4 font-weight-bold text-primary">Setores</h1>
        <span class="text-caption text-medium-emphasis">Gerencie os departamentos e localização física</span>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="$router.push('/setores/novo')">
          Novo Setor
        </v-btn>
      </v-col>
    </v-row>

    <v-card elevation="2" class="rounded-lg">
      <v-data-table 
        :headers="headers" 
        :items="items" 
        :loading="loading"
        hover
      >
        <template v-slot:item.ativo="{ item }">
          <v-chip
            :color="item.ativo ? 'green' : 'red'"
            size="small"
            variant="flat"
            class="font-weight-bold"
          >
            {{ item.ativo ? 'Ativo' : 'Inativo' }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="small" variant="text" color="blue" 
            @click="$router.push(`/setores/editar/${item.setorid}`)">
          </v-btn>
          <v-btn icon="mdi-delete" size="small" variant="text" color="red" @click="confirmDelete(item)"></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Excluir Setor</v-card-title>
        <v-card-text>Tem certeza que deseja remover o setor <strong>{{ itemToDelete?.nome }}</strong>?</v-card-text>
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
  { title: 'Código', key: 'codigo', width: '10%' },
  { title: 'Nome do Setor', key: 'nome' },
  { title: 'Andar', key: 'andar', align: 'center' },
  { title: 'Status', key: 'ativo', align: 'center' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' },
]

const fetchSetores = async () => {
  loading.value = true
  try {
    const response = await api.get('/getAllSetores')
    items.value = response.data.registro || []
  } catch (error) {
    showSnackbar('Erro ao carregar setores.', 'error')
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
    await api.post('/deleteSetor', { setorid: itemToDelete.value.setorid })
    await fetchSetores()
    showSnackbar('Setor removido com sucesso!', 'success')
  } catch (error) {
    showSnackbar('Erro ao remover setor. Verifique dependências.', 'error')
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
  fetchSetores()
})
</script>