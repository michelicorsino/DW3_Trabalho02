<template>
  <v-container fluid>
    <v-row class="mb-4" align="center">
      <v-col>
        <h1 class="text-h4 font-weight-bold text-primary">
          {{ isEditMode ? 'Editar Setor' : 'Novo Setor' }}
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
                label="Sigla/Cód." 
                variant="outlined" 
                placeholder="Ex: TI"
                density="compact"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" sm="8">
              <v-text-field 
                v-model="form.nome" 
                label="Nome do Setor" 
                variant="outlined" 
                density="compact"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field 
                v-model="form.andar" 
                label="Andar" 
                type="number" 
                variant="outlined"
                prepend-inner-icon="mdi-stairs"
                density="compact"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" class="d-flex align-center">
              <v-switch 
                v-model="form.ativo" 
                label="Setor Ativo" 
                color="success"
                hide-details
                inset
              ></v-switch>
            </v-col>
          </v-row>
        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="$router.push('/setores')">Cancelar</v-btn>
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

// Feedback
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const isEditMode = computed(() => !!route.params.id)

const form = reactive({
  setorid: null,
  codigo: '',
  nome: '',
  andar: null,
  ativo: true
})

const rules = {
  required: value => !!value || 'Campo obrigatório.',
}

const showSnackbar = (text, color) => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

onMounted(async () => {
  if (isEditMode.value) {
    try {
      const response = await api.post('/getSetorByID', { 
        setorid: route.params.id 
      })
      
      if (response.data.registro && response.data.registro.length > 0) {
        Object.assign(form, response.data.registro[0])
      }
    } catch (error) {
      console.error(error)
      showSnackbar('Erro ao carregar setor.', 'error')
    }
  }
})

async function save() {
  if (!isValid.value) return

  loading.value = true
  try {
    if (isEditMode.value) {
      await api.post('/updateSetor', form)
    } else {
      const { setorid, ...novoSetor } = form
      await api.post('/insertSetor', novoSetor)
    }
    
    showSnackbar('Setor salvo com sucesso!', 'success')
    setTimeout(() => router.push('/setores'), 1000)
    
  } catch (error) {
    console.error(error)
    showSnackbar('Erro ao salvar.', 'error')
  } finally {
    loading.value = false
  }
}
</script>