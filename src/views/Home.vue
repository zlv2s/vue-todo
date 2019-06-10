<template>
  <v-container fill-height>
    <v-layout align-center justify-center>
      <v-flex md6 sm8 xs12>
        <v-form @submit.prevent="submitTodo">
          <v-layout>
            <v-text-field clearable label="Your new todo" required v-model="newTodo"></v-text-field>
            <v-btn
              :disabled="hasEptyText"
              :loading="newTodoLoading"
              @click="submitTodo"
              color="success"
            >
              Submit
              <v-icon right>send</v-icon>
            </v-btn>
          </v-layout>
        </v-form>
        <v-card class="mt-3">
          <v-toolbar color="light-green" dark>
            <v-toolbar-title class="text-xs-center">Todos</v-toolbar-title>
          </v-toolbar>
          <template v-if="getAllTodosLoading">
            <v-progress-linear :indeterminate="true"></v-progress-linear>
          </template>
          <template v-else>
            <v-list>
              <v-subheader class="headline">Completed</v-subheader>
              <template v-if="markedTodos.length">
                <v-list-tile :key="item.todoId" class="pl-2" v-for="(item,idx) in markedTodos">
                  <v-list-tile-action>
                    <v-btn :loading="deleteTodoLoading" @click="deleteOne(item,idx)" flat icon>
                      <v-icon>delete_outline</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.todo }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
              <template v-else>
                <v-list-tile class="pl-2">
                  <v-list-tile-content>
                    <v-alert :value="true" color="warning" icon="info" outline>No completed todos</v-alert>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
            <v-divider></v-divider>
            <v-list>
              <v-subheader class="headline">Recent</v-subheader>
              <template v-if="uncheckedTodos.length">
                <v-list-tile :key="item.todoId" class="pl-2" v-for="item in uncheckedTodos">
                  <v-list-tile-action>
                    <v-checkbox v-model="item.checked"></v-checkbox>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.todo }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
              <template v-else>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-alert :value="true" color="warning" icon="info" outline>No recent todos</v-alert>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
          </template>
          <v-card-actions>
            <v-btn
              :disabled="checkedTodos.length < 1"
              :loading="markTodosAsDoneLoading"
              @click="markAsDone"
              color="success"
            >Mark {{ checkedTodos.length > 0 ? checkedTodos.length: '' }} as done</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  created() {
    this.getAllTodosForUser()
  },
  data() {
    return {
      newTodo: '',
      active: null
    }
  },
  computed: {
    ...mapState({
      newTodoLoading: state => state.loadings.newTodo,
      getAllTodosLoading: state => state.loadings.allTodo,
      markTodosAsDoneLoading: state => state.loadings.markTodosAsDone,
      deleteTodoLoading: state => state.loadings.deletingTodo,
      markedTodos: state => state.todos.markedTodos,
      uncheckedTodos: state => state.todos.uncheckedTodos
    }),

    checkedTodos() {
      return this.uncheckedTodos.filter(todo => todo.checked)
    },
    hasEptyText() {
      return this.newTodo === '' || this.newTodo === null
    }
  },
  methods: {
    ...mapActions([
      'submitTodoToFirebase',
      'getAllTodosForUser',
      'markTodosAsDone',
      'deleteTodo'
    ]),
    submitTodo() {
      if (this.newTodo) {
        this.submitTodoToFirebase({
          todo: this.newTodo,
          checked: false
        })
          .then(() => (this.newTodo = ''))
          .catch(err => console.error(err))
      }
    },
    markAsDone() {
      this.markTodosAsDone(this.checkedTodos)
    },
    deleteOne(item, idx) {
      this.active = idx
      this.deleteTodo(item)
    }
  }
}
</script>