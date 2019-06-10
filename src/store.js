import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { avatar } from './config'
import { auth, db } from './firebaseConfig'

Vue.use(Vuex)

auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setUser', user)
  }
})

const store = new Vuex.Store({
  state: {
    name: '',
    email: '',
    loadings: {
      login: false,
      newTodo: false,
      allTodo: false,
      markTodosAsDone: false,
      deletingTodo: false
    },
    todos: {
      uncheckedTodos: [],
      markedTodos: []
    },
    user: null,
    isAuthenticated: false
  },

  getters: {
    loginLoading: state => state.loadings.login
  },

  mutations: {
    setNewTodoLoading(state, data) { state.loadings.newTodo = data },
    setAllTodosLoading(state, data) { state.loadings.allTodo = data },
    setMarkTodosAsDoneLoading(state, data) { state.loadings.markTodosAsDone = data },
    setDeleteTodoLoading(state, data) { state.loadings.deletingTodo = data },
    setLoginLoading(state, data) { state.loadings.login = data },

    setTodoList(state, data) {
      state.todos.uncheckedTodos = []
      state.todos.markedTodos = []
      Object.keys(data).forEach(todoId => {
        if (data[todoId].checked) {
          state.todos.markedTodos.push({
            todoId,
            ...data[todoId]
          })
        } else {
          state.todos.uncheckedTodos.push({
            todoId,
            ...data[todoId]
          })
        }
      })
    },

    setUser(state, payload) { state.user = payload },

    setIsAuthenticated(state, payload) { state.isAuthenticated = payload }

  },

  actions: {
    createNewUser({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('setLoginLoading', true)
        auth.createUserWithEmailAndPassword(payload.email, payload.password)
          .then((res) => {
            db.ref().child('users').push({
              uid: res.user.uid,
              avatar,
              ...payload
            })
            commit('setLoginLoading', false)
            commit('setUser', res.user)
            commit('setIsAuthenticated', true)
            resolve()
          }).catch(error => {
            commit('setLoginLoading', false)
            reject(error.message)
          })
      })
    },

    signIn({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('setLoginLoading', true)
        auth.signInWithEmailAndPassword(payload.email, payload.password)
          .then((res) => {
            commit('setLoginLoading', false)
            commit('setUser', res.user)
            commit('setIsAuthenticated', true)
            resolve()
          }).catch(error => {
            commit('setLoginLoading', false)
            reject(error.message)
          })
      })
    },

    userSignOut({ commit }) {
      return new Promise((resolve, reject) => {
        firebase.auth().signOut()
          .then(() => {
            commit('setUser', null)
            commit('setIsAuthenticated', false)
            resolve()
          })
      })
    },

    submitTodoToFirebase({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        commit('setNewTodoLoading', true)
        db.ref().child(state.user.uid).push(payload).then(() => {
          commit('setNewTodoLoading', false)
          resolve()
        })
      })
    },

    getAllTodosForUser({ commit, state }) {
      commit('setAllTodosLoading', true)
      if (state.user.uid) {
        const todoList = db.ref().child(state.user.uid)
        todoList.on('value', data => {
          if (data.val()) commit('setTodoList', data.val())
          commit('setAllTodosLoading', false)
        })
      }
    },

    markTodosAsDone({ commit, state }, payload) {
      commit('setMarkTodosAsDoneLoading', true)
      const updates = {}
      payload.forEach((item) => {
        updates[`/${item.todoId}/checked`] = true
      })
      db.ref().child(state.user.uid)
        .update(updates)
        .then(() => commit('setMarkTodosAsDoneLoading', false))
    },

    deleteTodo({ commit, state }, payload) {
      commit('setDeleteTodoLoading', true)
      const updates = {}
      updates[`/${payload.todoId}/`] = null
      db.ref().child(state.user.uid)
        .update(updates)
        .then(() => commit('setDeleteTodoLoading', false))
    }
  }
})

export default store