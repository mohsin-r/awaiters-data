<template>
  <div id="dashboard">
    <Sidebar active="dashboard" />
    <div id="header" v-if="loaded">
      <h1> Current Records </h1>
      <h2> Number of records present: {{ entries.length }}</h2>
    </div>
    <div id="body" v-if="loaded">
      <div v-for="(entry, index) in entries" :key="index" class="banner">
        <div class="section">
          <strong>Date</strong>
          <label>{{ entry.date }}</label>
        </div>
        <div class="section">
          <strong>Time</strong>
          <label>{{ entry.class.startTime }} to {{ entry.class.endTime }}</label>
        </div>
        <div class="section button">
          <button @click="router.push({path: `/data/${entry.date}`})"><i class="fas fa-pen-to-square"></i>Edit</button>
        </div>
        <div class="section button end">
          <button @click="handleDelete(index)"><i class="fas fa-trash-can"></i>Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import env from '../apiConfig'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
    components: {Sidebar},
    setup() {
      const host = env.api_host
      const loaded = ref(false)
      const entries: any = ref([])
      const store = useStore()
      const router = useRouter()
      fetch(`${host}/get_record_by_name/${store.state.user}`, {
        credentials: "include",
        mode: "cors"
      })
      .then(res => {
        return res.json()
      })
      .then(json => {
        if (json.status === 200) {
          json.result.forEach((data: any) => {
            data.date = data.date.split('T')[0]
            entries.value.push(data)
          })
          loaded.value = true
        }
      })

      const handleDelete = (index: number) => {
        const request = new Request(`${host}/delete_record`, {
          method: "delete",
          body: JSON.stringify({name: store.state.user, date: entries.value[index].date}),
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
          entries.value.splice(index, 1)
        })
        .catch(error => {
          alert('An error occurred and your record could not be deleted.')
        })
      }

      return { router, entries, handleDelete, loaded }
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
    width: calc(100vw -250px - 4rem);
    padding: 2rem;
    text-align: center;
  }

  #header h1 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-size: 2rem;
  }

  #header h2 {
    margin-top: 0;
    font-size: 1.3rem;
  }

  #body {
    margin-left: 250px;
    width: calc(100vw - 250px - 4rem);
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding-left: 2rem;
  }

  .banner {
    display: flex;
    align-items: center;
    margin-right: 2rem;
    margin-bottom: 2rem;
    border: 2px solid #AD974F;
    border-radius: 0.25rem;
    padding: 1rem;
  }

  .section {
    display: inline-block;
    height: 100%;
    margin-right: 2rem;
  }

  strong {
    display: block;
    margin-bottom: 0.3rem;
    text-decoration: underline;
  }

  button {
    background-color: #AD974F;
    border: none;
    cursor: pointer;
    border-radius: 0.25rem;
    padding: 0.5rem;
    box-sizing: content-box;
  }
  button svg {
    margin-right: 0.2rem;
  }

  button:hover {
    transform: perspective(1px) scale(1.05);
  }

  .button {
    display: flex;
    align-items: center;
    margin-right: 1rem;
  }

  .end {
    margin-right: 0;
  }
</style>