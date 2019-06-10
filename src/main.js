import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vutify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { auth } from './firebaseConfig'

Vue.use(Vutify)

Vue.config.productionTip = false

// auth.onAuthStateChanged(user => {
//   console.log(user)
//   if (user) {
//     store.commit('setUser', user)
//   }
// })

let app
auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App)
    })
  }
})
// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')
