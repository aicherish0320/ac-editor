import { createStore } from 'vuex'
import templates, { TemplatesProps } from './modules/templates'
import user, { UserProps } from './modules/user'

export interface GlobalDataProps {
  user: UserProps
  templates: TemplatesProps
}

const store = createStore<GlobalDataProps>({
  modules: {
    user,
    templates
  }
})

export default store
