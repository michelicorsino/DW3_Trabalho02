<template>
  <v-container fluid>
    <v-row class="mb-4" align="center">
      <v-col>
        <h1 class="text-h4 font-weight-bold text-primary">Setores</h1>
        <span class="text-caption text-medium-emphasis">Gerencie os departamentos e localização física</span>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog()">
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
          <v-btn icon="mdi-pencil" size="small" variant="text" color="blue" @click="openDialog(item)"></v-btn>
          <v-btn icon="mdi-delete" size="small" variant="text" color="red" @click="deleteItem(item)"></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="pa-4 bg-primary">
          <span class="text-h5 text-white">{{ editedItem.setorid ? 'Editar Setor' : 'Novo Setor' }}</span>
        </v-card-title>

        <v-card-text class="pt-4">
          <v-container>
            <v-row>
              <v-col cols="12" sm="4">
                <v-text-field 
                  v-model="editedItem.codigo" 
                  label="Sigla/Cód." 
                  variant="outlined"
                  placeholder="Ex: TI"
                  density="compact"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="8">
                <v-text-field 
                  v-model="editedItem.nome" 
                  label="Nome do Setor" 
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field 
                  v-model="editedItem.andar" 
                  label="Andar" 
                  type="number" 
                  variant="outlined"
                  prepend-inner-icon="mdi-stairs"
                  density="compact"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" class="d-flex align-center">
                <v-switch 
                  v-model="editedItem.ativo" 
                  label="Setor Ativo" 
                  color="success"
                  hide-details
                  inset
                ></v-switch>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" @click="save">Salvar</v-btn>
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
  { title: 'Código', key: 'codigo', width: '10%' },
  { title: 'Nome do Setor', key: 'nome' },
  { title: 'Andar', key: 'andar', align: 'center' },
  { title: 'Status', key: 'ativo', align: 'center' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' },
]

const items = ref([])
const defaultItem = { setorid: null, codigo: '', nome: '', andar: null, ativo: true }
const editedItem = reactive({ ...defaultItem })

// --- Lógica CRUD ---

function openDialog(item = null) {
  if (item) {
    Object.assign(editedItem, item)
  } else {
    Object.assign(editedItem, defaultItem)
  }
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
  setTimeout(() => Object.assign(editedItem, defaultItem), 300)
}

function save() {
  if (editedItem.setorid) {
    // Atualizar
    const index = items.value.findIndex(i => i.setorid === editedItem.setorid)
    if (index !== -1) Object.assign(items.value[index], editedItem)
  } else {
    // Criar Novo
    items.value.push({ ...editedItem, setorid: Date.now() })
  }
  closeDialog()
}

function deleteItem(item) {
  if (confirm(`Tem certeza que deseja remover o setor ${item.nome}?`)) {
    items.value = items.value.filter(i => i.setorid !== item.setorid)
  }
}

// --- Dados Iniciais (Mock do SQL) ---
onMounted(() => {
  loading.value = true
  setTimeout(() => {
    items.value = [
      { setorid: 1, codigo: 'TI', nome: 'Tecnologia da Informação', andar: 3, ativo: true },
      { setorid: 2, codigo: 'RH', nome: 'Recursos Humanos', andar: 2, ativo: true },
      { setorid: 3, codigo: 'FIN', nome: 'Financeiro', andar: 4, ativo: true },
      { setorid: 4, codigo: 'COM', nome: 'Comercial', andar: 1, ativo: true },
    ]
    loading.value = false
  }, 800)
})
</script>