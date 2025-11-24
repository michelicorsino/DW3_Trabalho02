cargosform

<template>
  <v-container fluid>
    <v-row class="mb-4" align="center">
      <v-col>
        <h1 class="text-h4 font-weight-bold text-primary">
          {{ isEditMode ? 'Editar Cargo' : 'Novo Cargo' }}
        </h1>
      </v-col>
    </v-row>

    <v-card elevation="2" class="rounded-lg pa-4">
      <v-form v-model="isValid" @submit.prevent="save">
        <v-container>
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field 
                v-model="form.codigo" 
                label="Código" 
                variant="outlined" 
                density="compact"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" sm="8">
              <v-text-field 
                v-model="form.descricao" 
                label="Descrição do Cargo" 
                variant="outlined" 
                density="compact"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field 
                v-model="form.salario_base" 
                label="Salário Base" 
                prefix="R$" 
                type="number" 
                variant="outlined" 
                density="compact"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-autocomplete
                v-model="form.setoresIds"
                :items="listaSetores"
                item-title="nome"
                item-value="setorid"
                label="Setores Permitidos"
                variant="outlined"
                density="compact"
                multiple
                chips
                closable-chips
                :rules="[rules.requiredArray]"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" class="d-flex align-center">
              <v-switch 
                v-model="form.ativo" 
                label="Cargo Ativo" 
                color="success"
                hide-details
                inset
              ></v-switch>
            </v-col>
          </v-row>
        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="$router.push('/cargos')">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" type="submit" :loading="loading">Salvar</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="top right">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar = false">Fechar</v-btn>
      </template>
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
const listaSetores = ref([]) // Lista para preencher o combo

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const isEditMode = computed(() => !!route.params.id)

const form = reactive({
  cargoid: null,
  codigo: '',
  descricao: '',
  salario_base: 0,
  ativo: true,
  setoresIds: [] // Array para múltiplos setores
})

const rules = {
  required: value => !!value || 'Campo obrigatório.',
  requiredArray: value => (value && value.length > 0) || 'Selecione pelo menos um setor.'
}

const showSnackbar = (text, color) => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

// ... imports e setup ...

onMounted(async () => {
  try {
    // 1. Carregar todos os setores disponíveis
    const setoresRes = await api.get('/getAllSetores')
    listaSetores.value = setoresRes.data.registro || []

    // 2. Se for edição, carregar dados do cargo
    if (isEditMode.value) {
      const response = await api.post('/getCargoByID', { 
        cargoid: route.params.id 
      })
      
      if (response.data.registro && response.data.registro.length > 0) {
        const dados = response.data.registro[0]
        
        // --- A CORREÇÃO ESTÁ AQUI ---
        // Convertemos cada ID para String para bater com a lista de setores
        dados.setoresIds = (dados.setores_ids || []).map(id => String(id))
        
        Object.assign(form, dados)
      }
    }
  } catch (error) {
    console.error(error)
    showSnackbar('Erro ao carregar dados.', 'error')
  }
})

// ... restante do código ...

async function save() {
  if (!isValid.value) return

  loading.value = true
  try {
    if (isEditMode.value) {
      await api.post('/updateCargo', form)
    } else {
      const { cargoid, ...novoCargo } = form
      await api.post('/insertCargo', novoCargo)
    }
    
    showSnackbar('Cargo salvo com sucesso!', 'success')
    setTimeout(() => router.push('/cargos'), 1000)
    
  } catch (error) {
    console.error(error)
    showSnackbar('Erro ao salvar.', 'error')
  } finally {
    loading.value = false
  }
}
</script>