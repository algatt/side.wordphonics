import { ref } from "vue";
import axios from "axios";

export const useStore = () => {
  const words = ref([]);

  async function loadWords() {
    const url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vTueyDIx9fofnqHGpi_jffL_xsHwJZ4G0LLrJmcKAEU482aj9J5D3YfPHkZJbHF3Vu7A6hnzoVoq4Gd/pub?gid=0&single=true&output=csv`;

    try {
      const response = await axios.get(url);
      words.value = response.data.split("\n").filter(Boolean);
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  }

  // Load words immediately if the store is used
  loadWords();

  return {
    words,
    loadWords,
  };
};
