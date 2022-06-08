<template>
  <div id="login">
    <div id="header">
      <h1>Awaiters Classes - Data Input System </h1>
      <h2> Please login below to get started with using the system.</h2>
    </div>
    <div id="body" @keydown.enter.prevent="login()">
      <label class="normalLabel"> Username</label>
      <input type="text" v-model="username" :class="{invalidInput: invalid, normalInput: !invalid}" @input="reset">
      <label class="normalLabel"> Password</label>
      <input type="password" v-model="password" :class="{invalidInput: invalid, normalInput: !invalid}" @input="reset">
      <label :class="{invalidLabel: invalid, normalLabel: !invalid}">{{ message }}</label>
      <button @click="login()">Login</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import env from '../apiConfig'
import header from '../headerConfig'
export default {
  setup() {
    const host = env.api_host
    const router = useRouter()
    const store = useStore()
    const username = ref('')
    const password = ref('')
    const invalid = ref(false)
    const message = ref('')
    const login = () => {
      console.log(`${host}/login`)
      const request = new Request(`${host}/login`, {
        method: "post",
        body: JSON.stringify({username: username.value, password: password.value}),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
			  }
      })
      fetch(request, {
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
        message.value = "Your username and password is correct! Redirecting you to the dashboard..."
        store.commit('setUser', json.username)
        store.commit('setTitle', json.title)
        setTimeout(() => router.push({name: "Dashboard"}), 2000)
      })
      .catch(error => {
        console.log(error)
        invalid.value = true
        message.value = "Your username or password is incorrect."
      })
      // const usernames: string[] = ["aw1", "aw2", "aw3", "aw4", "aw5"]
      // if((u + "-password") === p && usernames.includes(u)) {
      //   message.value = "Your username and password is correct! Redirecting you to the dashboard..."
      //   store.commit('setUser', u)
      //   setTimeout(() => router.push({name: "Dashboard"}), 2000)
      // }
      // else {
      //   invalid.value = true
      //   message.value = "Your username or password is incorrect."
      // }
    }
    const reset = () => {
      invalid.value = false;
      message.value = ""
    }
    return { username, password, invalid, login, message, reset}
  }
}
</script>

<style scoped>
  #login {
    background-color: #231F20;
    height: 100vh;
  }

  #header {
    padding: 2rem 1rem;
    text-align: center;
  }

  #header h1 {
    margin: 0;
    font-size: 2rem;
    color: white;
  }

  #header h2 {
    font-size: 1.2rem;
    color: white;
  }

  #body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
  }

  #body button {
    width: 30%;
    background-color: #AD974F;
    border: none;
    font-weight: 500;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    line-height: 1.15;
    margin-top: 0.25rem;
    padding: 0.75rem 1rem;
    border-radius: 500px;
    transition: transform .2s ease;
  }

  #body button:hover {
    transform: perspective(1px) scale(1.05);
  }

  #body label {
    width: 30%;
    display: block;
    height: fit-content;
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 1.2rem;
  }

  #body input {
    box-sizing: border-box;
    width: 30%;
    border-radius: 0.25rem;
    padding: 0.5rem;
    resize: none;
    margin-bottom: 0.75rem;;
  }

  .normalInput {
    border: 2.5px solid #AD974F
  }

  .invalidInput {
    border: 2.5px solid red;
  }

  .normalLabel {
    color: white;
  }

  .invalidLabel {
    color: red;
  }

  @media only screen and (max-width: 1024px) {
    #body {
      height: 50vh;
    }
    #body button, #body label, #body input {
        width: 60vw;
    }
  }
</style>