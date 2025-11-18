<template>
  <v-container fluid>
    <v-row class="mb-4" align="center">
      <v-col>
        <h1 class="text-h4 font-weight-bold text-primary">Projetos</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog()">
          Novo Projeto
        </v-btn>
      </v-col>
    </v-row>

    <v-card elevation="2" class="rounded-lg">
      <v-data-table :headers="headers" :items="items" :loading="loading">
        
        <template v-slot:item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" size="small" variant="flat" class="font-weight-bold">
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.orcamento="{ item }">
          {{ formatCurrency(item.orcamento) }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="small" variant="text" color="blue" @click="openDialog(item)"></v-btn>
          <v-btn icon="mdi-delete" size="small" variant="text" color="red" @click="deleteItem(item)"></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedItem.projetoid ? 'Editar Projeto' : 'Novo Projeto' }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="4">
                <v-text-field v-model="editedItem.codigo" label="Código" variant="outlined" density="compact"></v-text-field>
              </v-col>
              <v-col cols="12" sm="8">
                <v-text-field v-model="editedItem.nome" label="Nome do Projeto" variant="outlined" density="compact"></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.datainicio" label="Início" type="date" variant="outlined" density="compact"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.datafim" label="Fim Previsto" type="date" variant="outlined" density="compact"></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="editedItem.status"
                  :items="['Em Andamento', 'Concluído', 'Cancelado', 'Planejamento']"
                  label="Status"
                  variant="outlined"
                  density="compact"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field 
                  v-model="editedItem.orcamento" 
                  label="Orçamento" 
                  prefix="R$" 
                  type="number" 
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea v-model="editedItem.descricao" label="Descrição Detalhada" variant="outlined" rows="3"></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDialog">Cancelar</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="save">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const dialog = ref(false)
const loading = ref(false)

const headers = [
  { title: 'Cód.', key: 'codigo' },
  { title: 'Projeto', key: 'nome' },
  { title: 'Início', key: 'datainicio' },
  { title: 'Fim', key: 'datafim' },
  { title: 'Status', key: 'status' },
  { title: 'Orçamento', key: 'orcamento' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' },
]

const items = ref([])
const defaultItem = { 
  projetoid: null, 
  codigo: '', 
  nome: '', 
  descricao: '', 
  datainicio: '', 
  datafim: '', 
  status: 'Planejamento', 
  orcamento: 0 
}
const editedItem = reactive({ ...defaultItem })

function getStatusColor(status) {
  if (status === 'Concluído') return 'green'
  if (status === 'Em Andamento') return 'blue'
  if (status === 'Cancelado') return 'red'
  return 'grey'
}

function formatCurrency(val) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
}

function openDialog(item = null) {
  if (item) Object.assign(editedItem, item)
  else Object.assign(editedItem, defaultItem)
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
  setTimeout(() => Object.assign(editedItem, defaultItem), 300)
}

function save() {
  if (editedItem.projetoid) {
    const index = items.value.findIndex(i => i.projetoid === editedItem.projetoid)
    if (index !== -1) Object.assign(items.value[index], editedItem)
  } else {
    items.value.push({ ...editedItem, projetoid: Date.now() })
  }
  closeDialog()
}

function deleteItem(item) {
  if(confirm('Excluir projeto?')) items.value = items.value.filter(i => i.projetoid !== item.projetoid)
}

onMounted(() => {
  items.value = [
    { projetoid: 1, codigo: 'PROJ01', nome: 'Site Institucional', datainicio: '2024-01-01', datafim: '2024-03-01', status: 'Em Andamento', orcamento: 15000 },
    { projetoid: 2, codigo: 'PROJ02', nome: 'App Mobile', datainicio: '2024-02-01', datafim: '2024-08-01', status: 'Planejamento', orcamento: 50000 },
  ]
})
</script>