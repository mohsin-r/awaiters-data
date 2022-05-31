<template>
  <h1>Dashboard</h1>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { onBeforeMount } from 'vue'
export default {
    setup() {
        const store = useStore()
        const router = useRouter()
        onBeforeMount(() => {
          if(!store.state.user) {
            router.push({name: 'Login'})
          }
        })
    }

}
</script>

<style>

</style>