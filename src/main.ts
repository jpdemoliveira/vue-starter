import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Adding Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import {
  VBtn,
  VCol,
  VCombobox,
  VContainer,
  VDivider,
  VList,
  VListItem,
  VListItemSubtitle,
  VListItemTitle,
  VProgressCircular,
  VPagination,
  VRow,
  VSelect,
  VTextField,
} from 'vuetify/components'
import { Ripple } from 'vuetify/directives'

const vuetify = createVuetify({
  components: {
    VBtn,
    VCol,
    VCombobox,
    VContainer,
    VDivider,
    VList,
    VListItem,
    VListItemSubtitle,
    VListItemTitle,
    VProgressCircular,
    VPagination,
    VRow,
    VSelect,
    VTextField,
  },
  directives: {
    Ripple,
  },
  icons: {
    defaultSet: 'mdi', // Default, but including for clarity
  },
  theme:{
    defaultTheme: 'light'
  }
})

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.mount('#app')
