
<template>
  <v-container fluid>
    <v-row class="mb-4" align="center">
      <v-col>
        <h1 class="text-h4 font-weight-bold text-primary">
          {{ isEditMode ? 'Editar Funcionário' : 'Novo Funcionário' }}
        </h1>
      </v-col>
    </v-row>

    <v-card elevation="2" class="rounded-lg pa-4">
      <v-form v-model="isValid" @submit.prevent="save">
        <v-container>
          <v-row>
            <v-col cols="12"><span class="text-subtitle-2 text-medium-emphasis">Dados Pessoais</span><v-divider class="mb-3"></v-divider></v-col>
            <v-col cols="12" sm="3"><v-text-field v-model="form.matricula" label="Matrícula" variant="outlined" density="compact" :rules="[rules.required]"></v-text-field></v-col>
            <v-col cols="12" sm="9"><v-text-field v-model="form.nome" label="Nome Completo" variant="outlined" density="compact" :rules="[rules.required]"></v-text-field></v-col>
            <v-col cols="12" sm="6"><v-text-field v-model="form.cpf" label="CPF" variant="outlined" density="compact" :rules="[rules.required]"></v-text-field></v-col>
            <v-col cols="12" sm="6"><v-text-field v-model="form.datanascimento" label="Data Nasc." type="date" variant="outlined" density="compact"></v-text-field></v-col>
            <v-col cols="12" sm="6"><v-text-field v-model="form.email" label="E-mail" type="email" variant="outlined" density="compact"></v-text-field></v-col>
            <v-col cols="12" sm="6"><v-text-field v-model="form.telefone" label="Telefone" variant="outlined" density="compact"></v-text-field></v-col>

            <v-col cols="12" class="mt-2">
              <span class="text-subtitle-2 text-medium-emphasis">Dados Contratuais</span>
              <v-divider class="mb-3"></v-divider>
            </v-col>

            <v-col cols="12" sm="6">
              <v-autocomplete
                v-model="form.cargoid"
                :items="listaCargos"
                item-title="descricao"
                item-value="cargoid"
                label="Cargo"
                variant="outlined"
                density="compact"
                :rules="[rules.required]"
                @update:model-value="handleCargoChange"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                v-model="form.setorid"
                :items="setoresFiltrados"
                item-title="nome"
                item-value="setorid"
                label="Setor"
                variant="outlined"
                density="compact"
                :disabled="!form.cargoid"
                :hint="!form.cargoid ? 'Selecione um cargo primeiro' : (setoresFiltrados.length === 0 ? 'Este cargo não tem setores vinculados' : '')"
                persistent-hint
                :rules="[rules.required]"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6"><v-text-field v-model="form.salario" label="Salário" prefix="R$" type="number" variant="outlined" density="compact"></v-text-field></v-col>
            <v-col cols="12" sm="6"><v-text-field v-model="form.dataadmissao" label="Data Admissão" type="date" variant="outlined" density="compact"></v-text-field></v-col>
          </v-row>
        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="$router.push('/funcionarios')">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" type="submit" :loading="loading">Salvar</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="top right">
      {{ snackbarText }}
      <template v-slot:actions><v-btn variant="text" @click="snackbar = false">Fechar</v-btn></template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const isValid = ref(false)
const loading = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const listaCargos = ref([])
const listaSetores = ref([])

const isEditMode = computed(() => !!route.params.id)

const form = reactive({
  funcionarioid: null,
  matricula: '',
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
  datanascimento: '',
  dataadmissao: '',
  salario: 0,
  cargoid: null,
  setorid: null,
  ativo: true
})

const rules = {
  required: value => !!value || 'Campo obrigatório.',
}

// --- CORREÇÃO AQUI: Lógica de filtro segura para tipos ---
const setoresFiltrados = computed(() => {
  if (!form.cargoid) return []
  
  const cargoSelecionado = listaCargos.value.find(c => c.cargoid === form.cargoid)
  
  if (cargoSelecionado && cargoSelecionado.setores_ids && cargoSelecionado.setores_ids.length > 0) {
    // Converte tudo para String antes de comparar
    // O backend manda números [1, 2], mas o select pode ter strings ["1", "2"]
    const setoresPermitidosString = cargoSelecionado.setores_ids.map(id => String(id))
    
    return listaSetores.value.filter(s => setoresPermitidosString.includes(String(s.setorid)))
  }
  
  // Se o cargo não tiver setores definidos no cadastro, retorna lista vazia (regra estrita)
  return [] 
})

const handleCargoChange = () => {
  // Verifica se o setor selecionado ainda é válido para o novo cargo
  // Se não for, limpa o campo
  if (form.setorid) {
    const setorAindaValido = setoresFiltrados.value.some(s => s.setorid === form.setorid)
    if (!setorAindaValido) {
      form.setorid = null
    }
  }
}

const showSnackbar = (text, color) => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

const formatDate = (dataBanco) => {
  if (!dataBanco) return null;
  if (typeof dataBanco === 'string') return dataBanco.split('T')[0];
  return dataBanco;
};

onMounted(async () => {
  try {
    const [cargosRes, setoresRes] = await Promise.all([
      api.get('/getAllCargos'),
      api.get('/getAllSetores')
    ])
    
    listaCargos.value = cargosRes.data.registro || []
    listaSetores.value = setoresRes.data.registro || []

    if (isEditMode.value) {
      const response = await api.post('/getFuncionarioByID', { 
        funcionarioid: route.params.id 
      })
      
      if (response.data.registro && response.data.registro.length > 0) {
        const dados = response.data.registro[0]
        dados.datanascimento = formatDate(dados.datanascimento)
        dados.dataadmissao = formatDate(dados.dataadmissao)
        
        Object.assign(form, dados)
      }
    }
  } catch (error) {
    console.error(error)
    showSnackbar('Erro ao carregar dados.', 'error')
  }
})

async function save() {
  if (!isValid.value) return

  loading.value = true
  try {
    if (isEditMode.value) {
      await api.post('/updateFuncionario', form)
    } else {
      const { funcionarioid, ...novoFuncionario } = form
      await api.post('/insertFuncionario', novoFuncionario)
    }
    showSnackbar('Salvo com sucesso!', 'success')
    setTimeout(() => router.push('/funcionarios'), 1000)
  } catch (error) {
    console.error(error)
    const msg = error.response?.data?.message || 'Erro ao salvar.'
    showSnackbar(msg, 'error')
  } finally {
    loading.value = false
  }
}
</script>