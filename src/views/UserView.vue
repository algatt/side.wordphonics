<template>
  <div class="user-section">
    <h1>Word Fun Time!</h1>
    <div v-if="currentWord" class="word-display">{{ currentWord }}</div>
    <button class="word-button" @click="showPreviousWord">Previous</button>
    <button class="word-button" @click="showNextWord">Next</button>
  </div>
</template>

<script>
  import { useStore } from "../store";
  import { ref, computed } from "vue";

  export default {
    setup() {
      const { words } = useStore();
      const currentWordIndex = ref(0);

      const currentWord = computed(() => words.value[currentWordIndex.value]);

      function showNextWord() {
        if (currentWordIndex.value < words.value.length - 1) {
          currentWordIndex.value += 1;
        }
      }

      function showPreviousWord() {
        if (currentWordIndex.value > 0) {
          currentWordIndex.value -= 1;
        }
      }

      return {
        currentWord,
        showNextWord,
        showPreviousWord,
      };
    },
  };
</script>

<style scoped>
  .user-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    text-align: center;
  }

  .word-display {
    font-size: 2em; /* Large text for easy reading */
    margin: 20px 0;
    padding: 10px;
    background-color: #a2d2ff; /* Light blue background */
    border-radius: 10px;
    min-height: 100px; /* Ensures the div retains its shape even if empty */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .word-button {
    background-color: #ffb703; /* Bright, kid-friendly button color */
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 1.5em;
    margin: 10px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .word-button:hover {
    background-color: #ff9f1c; /* Slightly darker on hover */
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .word-display {
      font-size: 1.5em; /* Smaller font on smaller devices */
    }
  }
</style>
