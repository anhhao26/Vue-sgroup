import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import HomeView from './Views/HomeView.vue'
import PokemonDetail from './components/PokemonDetail/PokemonDetail.vue'

const routes = [
  { path: '/', component: HomeView },
  { 
    path: '/:pokemonName', 
    name: 'PokemonDetail', 
    component: PokemonDetail, 
    props: true 
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
