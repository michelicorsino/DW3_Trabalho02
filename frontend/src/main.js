import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
// 2. Criar a instância do Vuetify
const vuetify = createVuetify({
  components,
  directives,
})

//

// 3. Adicionar o Vuetify à instância do Vue
const app = createApp(App)

app.use(vuetify)
app.use(router)

app.mount('#app')
