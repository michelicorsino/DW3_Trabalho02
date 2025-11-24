<template>
  <v-container fluid>
    <v-row class="mb-4" align="center">
      <v-col>
        <h1 class="text-h4 font-weight-bold text-primary">Cargos</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog()">
          Novo Cargo
        </v-btn>
      </v-col>
    </v-row>

    <v-card elevation="2" class="rounded-lg">
      <v-data-table :headers="headers" :items="items" :loading="loading">
        <template v-slot:item.salario_base="{ item }">
          {{ formatCurrency(item.salario_base) }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="small" variant="text" color="blue" @click="openDialog(item)"></v-btn>
          <v-btn icon="mdi-delete" size="small" variant="text" color="red" @click="deleteItem(item)"></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedItem.cargoid ? 'Editar Cargo' : 'Novo Cargo' }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.codigo" label="Código" variant="outlined"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.salario_base" label="Salário Base" prefix="R$" type="number" variant="outlined"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.descricao" label="Descrição" variant="outlined"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-switch v-model="editedItem.ativo" label="Ativo" color="success"></v-switch>
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

const loading = ref(false)
const dialog = ref(false)
const headers = [
  { title: 'Código', key: 'codigo' },
  { title: 'Descrição', key: 'descricao' },
  { title: 'Salário Base', key: 'salario_base' },
  { title: 'Ativo', key: 'ativo' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' },
]

const items = ref([])
const defaultItem = { cargoid: null, codigo: '', descricao: '', salario_base: 0, ativo: true }
// Usamos reactive para o item em edição
const editedItem = reactive({ ...defaultItem })

// --- Funções ---

function openDialog(item = null) {
  if (item) {
    Object.assign(editedItem, item) // Copia os dados para o form
  } else {
    Object.assign(editedItem, defaultItem) // Limpa o form
  }
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
  setTimeout(() => Object.assign(editedItem, defaultItem), 300)
}

function save() {
  if (editedItem.cargoid) {
    // Lógica de EDITAR (PUT)
    const index = items.value.findIndex(i => i.cargoid === editedItem.cargoid)
    if (index !== -1) Object.assign(items.value[index], editedItem)
  } else {
    // Lógica de CRIAR (POST)
    // Simulando ID gerado pelo banco
    items.value.push({ ...editedItem, cargoid: Date.now() }) 
  }
  closeDialog()
}

function deleteItem(item) {
  if (confirm('Tem certeza que deseja excluir este cargo?')) {
    items.value = items.value.filter(i => i.cargoid !== item.cargoid)
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

// Simulando carregamento
onMounted(() => {
  items.value = [
    { cargoid: 1, codigo: 'DEV', descricao: 'Desenvolvedor', salario_base: 5000, ativo: true },
    { cargoid: 2, codigo: 'GER', descricao: 'Gerente', salario_base: 10000, ativo: true },
  ]
})
</script>