import { createApp } from 'vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import 'vuetify/dist/vuetify.css';

import App from './App.vue'

import axios from 'axios';
import router from './router'

const vuetify = createVuetify({
    components,
    directives,
  })
  

const app = createApp(App);

axios.defaults.baseURL = 'https://localhost:44380';

app.use(router);
app.use(vuetify);

app.mount('#app');
