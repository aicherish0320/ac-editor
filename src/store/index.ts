import { createStore } from 'vuex'
import getters from './getters'
import templates, { TemplatesProps } from './modules/templates'
import user, { UserProps } from './modules/user'

export interface GlobalDataProps {
  user: UserProps
  templates: TemplatesProps
}

const store = createStore<GlobalDataProps>({
  getters,
  modules: {
    user,
    templates
  }
})

export default store
