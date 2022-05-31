import { createStore } from "vuex";

export default createStore({
  state: {
    user: null,
  },
  getters: {},
  mutations: {
    setUser(state, username) {
      state.user = username;
    },
  },
  actions: {},
  modules: {},
});
