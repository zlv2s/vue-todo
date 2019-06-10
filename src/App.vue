<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title>Vue Todo</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat v-if="!isAuthenticated">SIGNIN</v-btn>
        <v-btn @click="logout" flat v-if="isAuthenticated">LOGOUT</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
export default {
  methods: {
    logout() {
      this.$store
        .dispatch('userSignOut')
        .then(() => this.$router.push({ name: 'login' }))
    }
  },
  computed: {
    ...mapState(['isAuthenticated'])
  }
}
</script>