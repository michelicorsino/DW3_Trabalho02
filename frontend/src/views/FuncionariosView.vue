<template>
  <v-container fluid>
    <v-row class="mb-4" align="center">
      <v-col>
        <h1 class="text-h4 font-weight-bold text-primary">Funcionários</h1>
        <span class="text-caption text-medium-emphasis">Gerencie a equipe, cargos e alocações</span>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" prepend-icon="mdi-plus" size="large" @click="openDialog()">
          Novo Funcionário
        </v-btn>
      </v-col>
    </v-row>

    <v-card elevation="2" class="rounded-lg">
      <v-card-title class="d-flex align-center py-4 px-4">
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar por nome, cargo ou CPF"
          variant="outlined"
          density="compact"
          hide-details
          style="max-width: 400px;"
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="funcionarios"
        :search="search"
        :loading="loading"
        hover
      >
        <template v-slot:item.ativo="{ item }">
          <v-chip :color="item.ativo ? 'green' : 'grey'" size="small" variant="flat" class="font-weight-bold">
            {{ item.ativo ? 'Ativo' : 'Inativo' }}
          </v-chip>
        </template>

        <template v-slot:item.salario="{ item }">
          {{ formatCurrency(item.salario) }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="small" variant="text" color="blue" class="mr-2" @click="openDialog(item)"></v-btn>
          <v-btn icon="mdi-delete" size="small" variant="text" color="red" @click="deleteItem(item)"></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title class="pa-4 bg-primary">
          <span class="text-h5 text-white">{{ editedItem.funcionarioid ? 'Editar Funcionário' : 'Novo Funcionário' }}</span>
        </v-card-title>

        <v-card-text class="pt-4">
          <v-container>
            <v-row>
              <v-col cols="12">
                <span class="text-subtitle-2 text-medium-emphasis">Dados Pessoais</span>
                <v-divider class="mb-3"></v-divider>
              </v-col>

              <v-col cols="12" sm="3">
                <v-text-field v-model="editedItem.matricula" label="Matrícula" variant="outlined" density="compact"></v-text-field>
              </v-col>
              <v-col cols="12" sm="9">
                <v-text-field v-model="editedItem.nome" label="Nome Completo" variant="outlined" density="compact"></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.cpf" label="CPF" variant="outlined" density="compact" placeholder="000.000.000-00"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.datanascimento" label="Data Nasc." type="date" variant="outlined" density="compact"></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.email" label="E-mail" type="email" variant="outlined" density="compact" prepend-inner-icon="mdi-email-outline"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.telefone" label="Telefone" variant="outlined" density="compact" prepend-inner-icon="mdi-phone"></v-text-field>
              </v-col>

              <v-col cols="12" class="mt-2">
                <span class="text-subtitle-2 text-medium-emphasis">Dados Contratuais</span>
                <v-divider class="mb-3"></v-divider>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="editedItem.cargoid"
                  :items="listaCargos"
                  item-title="descricao"
                  item-value="cargoid"
                  label="Cargo"
                  variant="outlined"
                  density="compact"
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="editedItem.setorid"
                  :items="listaSetores"
                  item-title="nome"
                  item-value="setorid"
                  label="Setor"
                  variant="outlined"
                  density="compact"
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.salario" label="Salário" prefix="R$" type="number" variant="outlined" density="compact"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.dataadmissao" label="Data Admissão" type="date" variant="outlined" density="compact"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" @click="save">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const search = ref('')
const loading = ref(false)
const dialog = ref(false)

const headers = [
  { title: 'Matrícula', key: 'matricula', align: 'start' },
  { title: 'Nome', key: 'nome' },
  { title: 'Cargo', key: 'cargo_nome' },
  { title: 'Setor', key: 'setor_nome' },
  { title: 'Admissão', key: 'dataadmissao' },
  { title: 'Salário', key: 'salario', align: 'end' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' },
]

// Estado dos dados
const funcionarios = ref([])

// Mock de dados para preencher os Selects (simulando tabelas auxiliares)
const listaCargos = ref([
  { cargoid: 1, descricao: 'Desenvolvedor' },
  { cargoid: 2, descricao: 'Analista de Sistemas' },
  { cargoid: 3, descricao: 'Gerente de Projetos' },
  { cargoid: 4, descricao: 'Analista de Testes' },
])

const listaSetores = ref([
  { setorid: 1, nome: 'Tecnologia da Informação' },
  { setorid: 2, nome: 'Recursos Humanos' },
  { setorid: 3, nome: 'Financeiro' },
  { setorid: 4, nome: 'Comercial' },
])

// Objeto de Edição
const defaultItem = {
  funcionarioid: null,
  matricula: '',
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
  datanascimento: '',
  dataadmissao: '',
  salario: null,
  cargoid: null,
  setorid: null,
  ativo: true
}
const editedItem = reactive({ ...defaultItem })

// --- Funções Auxiliares ---
const formatCurrency = (value) => {
  if (!value) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

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
  // Lógica para encontrar o nome do cargo/setor baseado no ID selecionado (apenas visual para o frontend mockado)
  const cargoSelecionado = listaCargos.value.find(c => c.cargoid === editedItem.cargoid)
  const setorSelecionado = listaSetores.value.find(s => s.setorid === editedItem.setorid)

  const itemParaSalvar = {
    ...editedItem,
    cargo_nome: cargoSelecionado ? cargoSelecionado.descricao : '',
    setor_nome: setorSelecionado ? setorSelecionado.nome : ''
  }

  if (editedItem.funcionarioid) {
    // EDITAR
    const index = funcionarios.value.findIndex(f => f.funcionarioid === editedItem.funcionarioid)
    if (index !== -1) Object.assign(funcionarios.value[index], itemParaSalvar)
  } else {
    // CRIAR
    funcionarios.value.push({ ...itemParaSalvar, funcionarioid: Date.now(), ativo: true })
  }
  closeDialog()
}

function deleteItem(item) {
  if (confirm(`Remover ${item.nome}?`)) {
    funcionarios.value = funcionarios.value.filter(f => f.funcionarioid !== item.funcionarioid)
  }
}

// --- Carregamento Inicial ---
onMounted(() => {
  loading.value = true
  
  setTimeout(() => {
    funcionarios.value = [
      {
        funcionarioid: 1,
        matricula: 'FUNC001',
        nome: 'João Silva',
        cpf: '111.222.333-44',
        email: 'joao.silva@empresa.com',
        telefone: '(17) 98888-1111',
        datanascimento: '1990-05-15',
        dataadmissao: '2020-01-10',
        salario: 5500.00,
        cargoid: 1,
        setorid: 1,
        cargo_nome: 'Desenvolvedor', 
        setor_nome: 'Tecnologia da Informação',
        ativo: true
      },
      {
        funcionarioid: 2,
        matricula: 'FUNC002',
        nome: 'Maria Santos',
        cpf: '222.333.444-55',
        email: 'maria.santos@empresa.com',
        telefone: '(17) 98888-2222',
        datanascimento: '1988-08-20',
        dataadmissao: '2019-03-15',
        salario: 7500.00,
        cargoid: 2,
        setorid: 1,
        cargo_nome: 'Analista de Sistemas',
        setor_nome: 'Tecnologia da Informação',
        ativo: true
      },
      {
        funcionarioid: 3,
        matricula: 'FUNC003',
        nome: 'Pedro Oliveira',
        cpf: '333.444.555-66',
        email: 'pedro.oliveira@empresa.com',
        telefone: '(17) 98888-3333',
        datanascimento: '1985-12-10',
        dataadmissao: '2018-06-20',
        salario: 10500.00,
        cargoid: 3,
        setorid: 1,
        cargo_nome: 'Gerente de Projetos',
        setor_nome: 'Tecnologia da Informação',
        ativo: true
      }
    ]
    loading.value = false
  }, 800)
})
</script>