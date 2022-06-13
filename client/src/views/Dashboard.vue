<template>
  <div id="dashboard">
    <Sidebar active="dashboard" />
    <div id="header">
      <h1> Current Records </h1>
    </div>
    <div id="body">
      {{ entries}}
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import env from '../apiConfig'
import { useStore } from 'vuex'
export default {
    components: {Sidebar},
    setup() {
      const host = env.api_host
      const entries = ref([])
      const store = useStore()
      fetch(`${host}/get_record_by_name/${store.state.user}`, {
        credentials: "include",
        mode: "cors"
      })
      .then(res => {
        return res.json()
      })
      .then(json => {
        if (json.status === 200) {
          entries.value = json.result
        }
      })

      return {entries}
    }

}
</script>

<style scoped>
  #dashboard {
    background-color: white;
    height: 100vh;
  }

  #header {
    margin-left: 250px;
    padding: 2rem 1rem;
    text-align: center;
  }

  #header h1 {
    margin: 0;
    font-size: 2rem;
  }

  #body {
    margin-left: 250px;
  }
</style>