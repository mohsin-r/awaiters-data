import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from '@fortawesome/free-solid-svg-icons'
import env from './apiConfig'
import header from './headerConfig'
library.add(fas);
import { dom } from "@fortawesome/fontawesome-svg-core";
dom.watch();

const host = env.api_host
router.beforeEach((to, from, next) => {
    console.log(header)
    fetch(`${host}/check-session`, {
      credentials: "include",
      mode: "cors"
    })
    .then(res => {
        if (res.status === 200) {
          return res.json()
        }
        throw new Error()
    })
    .then(json => {
        console.log(json)
        if (json) {
          store.commit('setUser', json.username)
          store.commit('setTitle', json.title)
          if (to.name === "Login") {
            next({ name: "Dashboard" })
          }
          else {
            next()
          }
        }
    })
    .catch(error => {
        if (to.name !== "Login") {
          next({name: "Login"})
        }
        else {
          next()
        }
    })

})
createApp(App).component("font-awesome-icon", FontAwesomeIcon).use(store).use(router).mount("#app");
