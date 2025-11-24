<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        
        <v-card class="elevation-12 pa-6" rounded="lg">
          <div class="text-center mb-6">
            <h2 class="text-h5 font-weight-bold text-primary">Bem-vindo</h2>
            <p class="text-subtitle-2 text-medium-emphasis">Faça login para continuar</p>
          </div>

          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            class="mb-4"
            closable
            @click:close="error = ''"
          >
            {{ error }}
          </v-alert>

          <v-form v-model="isFormValid" @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              label="Usuário" 
              prepend-inner-icon="mdi-account"
              variant="outlined"
              color="primary"
              :rules="emailRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="password"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              label="Senha"
              prepend-inner-icon="mdi-lock-outline"
              variant="outlined"
              color="primary"
              :rules="passwordRules"
              @click:append-inner="showPassword = !showPassword"
              required
              class="mt-2"
            ></v-text-field>

            <v-btn
              block
              size="large"
              color="primary"
              type="submit"
              :loading="isLoading"
              :disabled="!isFormValid"
              class="mt-4 font-weight-bold"
            >
              Entrar
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import router from '@/router'
import api from '@/services/api'

const email = ref('')
const password = ref('')
const showPassword = ref(false) 
const isFormValid = ref(false)  
const isLoading = ref(false)    
const error = ref('') // Mudei para string vazia para facilitar

const emailRules = [
  value => !!value || 'O usuário é obrigatório.',
]

const passwordRules = [
  value => !!value || 'A senha é obrigatória.',
]

const handleLogin = async () => {
  if (!isFormValid.value) return

  isLoading.value = true
  error.value = '' // Limpa erro anterior

  try {
    // Ajustei para /Login (Maiúsculo) igual ao seu router.js
    const response = await api.post('/Login', {
      username: email.value,
      password: password.value
    });

    // O backend retorna auth: true se deu certo
    if (response.data.auth) {
      const tokenValue = response.data.token;
      
      localStorage.setItem('token', tokenValue);
      
      // REMOVIDO: loggedInUser e token (causavam erro pois não existiam)

      // Redireciona
      router.push('/dashboard'); 
    } else {
      // Se auth for false (ex: senha errada), mostra a mensagem do backend
      error.value = response.data.message || 'Login inválido';
    }

  } catch (err) {
    console.error(err);
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message;
    } else {
      error.value = 'Erro ao conectar. O backend está rodando na porta 40000?';
    }
  } finally {
    isLoading.value = false;
  }
}
</script>