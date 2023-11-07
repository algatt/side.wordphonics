<template>
  <div class="admin-section">
    <h1>Words List</h1>
    <ul>
      <li v-for="(word, index) in words" :key="index">{{ word }}</li>
    </ul>
  </div>
</template>

<script>
  import { useStore } from "../store";

  export default {
    setup() {
      const { words } = useStore();

      return {
        words,
      };
    },
  };
</script>

<style scoped>
  /* Your styles here */
</style>
