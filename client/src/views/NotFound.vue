<template>
    <div id="notfound">
        <Sidebar />
        <div id="header">
            <h1>404 Error</h1>
            <h2> You have navigated to a page that does not exist. Use the menu to go back to a page that exists.</h2>
        </div>
        <div id="body">
        </div>
    </div>
</template>

<script lang="ts">
import Sidebar from "../components/Sidebar.vue"
export default {
  components: {Sidebar},
  setup() {
  }
}
</script>

<style scoped>
  #notfound {
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

  #header h2 {
    font-size: 1.2rem;
  }

  #body {
    margin-left: 250px;
  }
</style>