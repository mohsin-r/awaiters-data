<template>
  <div id="dashboard">
    <Sidebar active="dashboard" />
    <div id="header">
      <h1> Current Records </h1>
    </div>
    <div id="body">

    </div>
  </div>
</template>

<script lang="ts">
import Sidebar from '../components/Sidebar.vue'
export default {
    components: {Sidebar},
    setup() {
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