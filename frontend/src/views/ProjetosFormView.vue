<template>
  <v-container fluid>
    <v-row class="mb-4" align="center">
      <v-col>
        <h1 class="text-h4 font-weight-bold text-primary">
          {{ isEditMode ? 'Editar Projeto' : 'Novo Projeto' }}
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
                v-model="form.nome" 
                label="Nome do Projeto" 
                variant="outlined" 
                density="compact"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" sm="6">
              <v-text-field 
                v-model="form.datainicio" 
                label="Data Início" 
                type="date" 
                variant="outlined" 
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field 
                v-model="form.datafim" 
                label="Data Fim Previsto" 
                type="date" 
                variant="outlined" 
                density="compact"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                v-model="form.status"
                :items="['Planejamento', 'Em Andamento', 'Concluído', 'Cancelado']"
                label="Status"
                variant="outlined"
                density="compact"
                :rules="[rules.required]"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field 
                v-model="form.orcamento" 
                label="Orçamento" 
                prefix="R$" 
                type="number" 
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea 
                v-model="form.descricao" 
                label="Descrição Detalhada" 
                variant="outlined" 
                rows="3"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="$router.push('/projetos')">Cancelar</v-btn>
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
  projetoid: null,
  codigo: '',
  nome: '',
  descricao: '',
  datainicio: '',
  datafim: '',
  status: 'Planejamento',
  orcamento: 0
})

const rules = {
  required: value => !!value || 'Campo obrigatório.',
}

const showSnackbar = (text, color) => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

// Função auxiliar para datas
const formatDate = (dataBanco) => {
  if (!dataBanco) return null;
  if (typeof dataBanco === 'string') return dataBanco.split('T')[0];
  return dataBanco;
};

onMounted(async () => {
  if (isEditMode.value) {
    try {
      const response = await api.post('/getProjetoByID', { 
        projetoid: route.params.id 
      })
      
      if (response.data.registro && response.data.registro.length > 0) {
        const dados = response.data.registro[0]
        
        // Formatar datas
        dados.datainicio = formatDate(dados.datainicio)
        dados.datafim = formatDate(dados.datafim)

        Object.assign(form, dados)
      }
    } catch (error) {
      console.error(error)
      showSnackbar('Erro ao carregar projeto.', 'error')
    }
  }
})

async function save() {
  if (!isValid.value) return

  loading.value = true
  try {
    if (isEditMode.value) {
      await api.post('/updateProjeto', form)
    } else {
      // Remove ID para insert
      const { projetoid, ...novoProjeto } = form
      await api.post('/insertProjeto', novoProjeto)
    }
    
    showSnackbar('Projeto salvo com sucesso!', 'success')
    setTimeout(() => router.push('/projetos'), 1000)
    
  } catch (error) {
    console.error(error)
    showSnackbar('Erro ao salvar.', 'error')
  } finally {
    loading.value = false
  }
}
</script>