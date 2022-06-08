<template>
    <div id="data">
        <Sidebar active="data" />
        <div id="header">
            <h1>Data Entry Form</h1>
            <h2> This page is currently a work in progress. Please check back later.</h2>
        </div>
        <div id="body">
          <!--form>
            <div id="date">
              <label> Date </label>
              <label class="subheading"> Format: YYYY-MM-DD </label>
              <input type="text" v-model="date">
            </div>
          </form-->
        </div>
    </div>
</template>

<script lang="ts">
import Sidebar from "../components/Sidebar.vue"
import { ref } from "vue"
export default {
  components: {Sidebar},
  props: [],
  setup(props: any) {
    const date = ref('')
    return { date }
  }
}
</script>

<style scoped>
  #data {
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
    padding-left: 1rem;
  }
</style>