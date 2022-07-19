import { createStore } from 'vuex'
import getters from './getters'
import editor from './modules/editor'
import user from './modules/user'

const store = createStore({
  getters,
  modules: {
    user,
    editor
  }
})

export default store
