<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        
        <v-card class="elevation-12 pa-6" rounded="lg">
          <div class="text-center mb-6">
            <h2 class="text-h5 font-weight-bold text-primary">Bem-vindo</h2>
            <p class="text-subtitle-2 text-medium-emphasis">Faça login para continuar</p>
          </div>

          <v-form v-model="isFormValid" @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              label="E-mail"
              prepend-inner-icon="mdi-email-outline"
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

          <!-- <div class="text-center mt-4">
            <a href="#" class="text-caption text-decoration-none text-primary">
              Esqueceu sua senha?
            </a>
          </div> -->

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
const error = ref(false)    

//validacao
const emailRules = [
  value => !!value || 'O e-mail é obrigatório.',
]

const passwordRules = [
  value => !!value || 'A senha é obrigatória.',
]


const handleLogin = async () => {

  if (!isFormValid.value) return

  isLoading.value = true

  // setTimeout(() => {
  //   isLoading.value = false
  //   //alert(`Login realizado com sucesso!\nEmail: ${email.value}`)
  //   router.push('/dashboard')
  // }, 2000)

    try {
    const response = await api.post('/login', {
      username: email.value,
      password: password.value
    });

    if (response.data.auth) {
      const tokenValue = response.data.token;
      
      // Salva o token no localStorage para usar em outras páginas
      localStorage.setItem('token', tokenValue);
      
      // Salva dados para feedback (opcional)
      loggedInUser.value = response.data.username;
      token.value = tokenValue;

      // Redireciona para a página principal após o login
      router.push('/dashboard'); 
    }

  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message;
    } else {
      error.value = 'Erro de rede. O backend está rodando?';
    }
  } finally {
    isLoading.value = false;
  }
  console.log(error.value)
}
</script>