import { createStore } from "vuex";

export default createStore({
  state: {
    user: null,
    title: null
  },
  getters: {},
  mutations: {
    setUser(state, username) {
      state.user = username;
    },
    setTitle(state, title) {
      state.title = title
    }
  },
  actions: {},
  modules: {},
});
