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

const email = ref('')
const password = ref('')
const showPassword = ref(false) 
const isFormValid = ref(false)  
const isLoading = ref(false)    

//validacao
const emailRules = [
  value => !!value || 'O e-mail é obrigatório.',
  value => /.+@.+\..+/.test(value) || 'Insira um e-mail válido.'
]

const passwordRules = [
  value => !!value || 'A senha é obrigatória.',
  value => value.length >= 6 || 'A senha deve ter no mínimo 6 caracteres.'
]


const handleLogin = async () => {

  if (!isFormValid.value) return

  isLoading.value = true


  setTimeout(() => {
    isLoading.value = false
    //alert(`Login realizado com sucesso!\nEmail: ${email.value}`)
    router.push('/dashboard')
  }, 2000)
}
</script>