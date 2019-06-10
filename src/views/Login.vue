<template>
  <v-container fill-height>
    <v-layout align-center justify-center>
      <v-flex md6 sm8 xs12>
        <v-toolbar color="light-green" dark>
          <v-toolbar-title>Login form</v-toolbar-title>
        </v-toolbar>
        <v-alert dismissible type="error" v-model="error">{{ error }}</v-alert>
        <v-card>
          <v-card-text>
            <v-form @submit.prevent="loginOrRegister" method="post" v-model="valid">
              <v-checkbox color="green" label="Register new user ?" v-model="newUser"></v-checkbox>
              <v-text-field
                :counter="10"
                :rules="nameRules"
                label="Name"
                required
                v-if="newUser"
                v-model="name"
              ></v-text-field>
              <v-text-field :rules="emailRules" label="E-mail" required v-model="email"></v-text-field>
              <v-text-field
                :append-icon="passwordVisible ? 'visibility' : 'visibility_off'"
                :rules="passwordRules"
                :type="passwordVisible ? 'text' : 'password'"
                @click:append="() => (passwordVisible = !passwordVisible)"
                label="Enter your password"
                name="input-10-1"
                required
                v-model="password"
              ></v-text-field>
              <v-btn
                :disabled="!valid"
                :loading="loginLoading"
                @click="loginOrRegister"
                color="success"
                type="submit"
              >{{ newUser? 'Register' : 'Login' }}</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      valid: false,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        // @TODO: store the length
        v => v.length <= 20 || 'Name must be less than 20 characters'
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          'E-mail must be valid'
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 8 || 'Password must be atleast 8 characters'
      ],
      passwordVisible: false,
      // by default we show the login screen
      newUser: false,
      error: ''
    }
  },
  computed: {
    ...mapGetters(['loginLoading'])
  },
  methods: {
    ...mapActions({
      login: 'signIn',
      register: 'createNewUser'
    }),
    loginOrRegister() {
      let promise
      const loginPayload = {
        email: this.email,
        password: this.password
      }

      promise = this.newUser
        ? this.register({ name: this.name, ...loginPayload })
        : this.login(loginPayload)

      promise
        .then(() => this.$router.push({ name: 'home' }))
        .catch(err => (this.error = err))
    }
  }
}
</script>