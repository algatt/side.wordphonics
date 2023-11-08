<template>
  <div class="flex flex-col space-y-4">
    <div v-if="isLoading" class="flex justify-center">
      <LoadingSpinner></LoadingSpinner>
    </div>
    <template v-if="!isLoading">
      <span>
        <img
          :src="preLoadedImages[sequence[currentPosition]].src"
          width="400"
        />
      </span>
      <span class="flex justify-center space-x-3">
        <button
          :disabled="currentPosition === 0"
          @click="currentPosition > 0 ? currentPosition-- : null"
          class="btn-main"
        >
          Previous
        </button>
        <button
          :disabled="currentPosition === sequence.length - 1"
          class="btn-main"
          @click="
            currentPosition < sequence.length - 1 ? currentPosition++ : null
          "
        >
          Next
        </button>
      </span></template
    >
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from "vue";
  import LoadingSpinner from "./LoadingSpinner.vue";
  const props = defineProps(["images"]);
  const currentPosition = ref(0);
  const preLoadedImages = ref([]);
  const isLoading = ref(true);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const createRandomOrderArray = (length) => {
    const array = Array.from({ length }, (_, i) => i);
    return shuffleArray(array);
  };

  const sequence = computed(() => {
    if (!props.images) return null;
    const sequence = createRandomOrderArray(props.images.length);
    return shuffleArray(sequence);
  });

  const preloadImages = async (links) => {
    const promises = links.map(
      (link) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.src = link;
          img.onload = () => resolve(img);
          img.onerror = reject;
        })
    );

    try {
      return await Promise.all(promises);
    } catch (error) {
      console.error("Error preloading images:", error);
      throw error;
    }
  };

  onMounted(async () => {
    if (props.images) {
      const links = props.images.map((el) => {
        return el.webContentLink;
      });
      preLoadedImages.value = await preloadImages(links);
      currentPosition.value = 0;
      isLoading.value = false;
    }
  });
</script>

<style scoped>
  .btn-main {
    @apply bg-purple-600 text-2xl w-32 py-4 text-purple-100 font-semibold flex justify-center items-center rounded-lg disabled:bg-purple-800 disabled:cursor-not-allowed;
    font-family: Montserrat;
  }
</style>
