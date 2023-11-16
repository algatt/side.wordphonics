<template>
  <div class="flex flex-col space-y-4 items-center">
    <div v-if="isLoading" class="flex justify-center">
      <LoadingSpinner></LoadingSpinner>
    </div>

    <template v-if="!isLoading">
      <span
        class="flex lg:max-w-[400px] max-w-[200px] max-h-[200px] w-full h-full min-w-[200px] lg:min-w-[400px] min-h-[200px]"
      >
        <img
          :src="preLoadedImages[sequence[currentPosition]].src"
          class="object-contain w-[100%]"
        />
      </span>

      <span class="flex h-10 items-center relative w-[300px]">
        <span class="w-full h-1 bg-purple-200 left-0 top-0 absolute"></span>

        <span
          class="h-1 bg-purple-500 left-0 top-0 w-20 absolute"
          :style="`width: ${((currentPosition + 1) / totalSelection) * 100}%`"
        ></span>
        <img
          :src="happy"
          class="w-6 h-6 absolute top-[-9px]"
          :style="`left : ${
            ((currentPosition + 1) / totalSelection) * 100 - 5
          }%;`"
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
      </span>

      <span class="text-purple-500 text-sm mt-2"
        >{{ totalSelection }} cards</span
      >
    </template>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from "vue";
  import LoadingSpinner from "./LoadingSpinner.vue";
  import happy from "../assets/happy.png";

  const props = defineProps(["images", "totalCards"]);
  const currentPosition = ref(0);
  const preLoadedImages = ref([]);
  const isLoading = ref(true);
  const totalSelection = ref(0);

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
    const sequence = createRandomOrderArray(totalSelection.value);
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

      if (props.totalCards) {
        if (props.totalCards > links.length)
          totalSelection.value = links.length;
        else totalSelection.value = props.totalCards;
      } else {
        totalSelection.value = props.images.length;
      }

      const picks = createRandomOrderArray(props.images.length);

      const tempLinks = [];
      picks.forEach((val) => {
        tempLinks.push(links[val]);
      });

      preLoadedImages.value = await preloadImages(tempLinks);

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
