<template>
  <div
    class="min-h-screen min-w-screen flex items-center flex-col pt-12 bg-cover justify-between"
    :style="`background-image: url(${selectedBackground});`"
  >
    <div
      class="bg-white bg-opacity-80 backdrop-blur-sm px-20 py-4 rounded-lg max-w-[95%] max-h-[80%] lg:max-h-[1000px] lg:max-w-[500px] border-2 border-purple-700 shadow w-full h-full"
    >
      <router-view></router-view>
    </div>
    <div class="py-8 flex items-center space-x-3">
      <button
        @click="selectedBackground = background"
        v-for="background in backgrounds"
        class="w-24 h-16 rounded-lg object-cover overflow-hidden border-2 border-purple-700"
      >
        <img :src="background" class="w-full h-full object-cover" />
      </button>
    </div>
  </div>

  <div
    v-if="
      route.name === 'User' &&
      settings &&
      settings.Animation['Enable Animation'].selectedValue === true &&
      showSurprise !== null
    "
    class="absolute bottom-[40px] left-0 right-0"
  >
    <img
      :src="surprise[showSurprise]"
      class="relative w-[200px] slide-right hover:rotate-12"
    />
  </div>
</template>

<script setup>
  import { onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  import { loadSettings } from "./utilities";
  import background01 from "./assets/background_01.jpg";
  import background02 from "./assets/background_02.jpg";
  import background03 from "./assets/background_03.jpg";

  import surprise01 from "./assets/unicorn/star.png";
  import surprise02 from "./assets/unicorn/unicorn.png";
  import surprise03 from "./assets/unicorn/unicorn_mermaid.png";
  import surprise04 from "./assets/unicorn/cat.png";
  import surprise05 from "./assets/unicorn/dog.png";

  const route = useRoute();

  const selectedBackground = ref(background01);
  const backgrounds = ref([background01, background02, background03]);
  const surprise = ref([
    surprise01,
    surprise02,
    surprise03,
    surprise04,
    surprise05,
  ]);
  const settings = ref(null);

  const showSurprise = ref(null);

  const toggleSurprise = () => {
    if (Math.random() < 0.5) showSurprise.value = Math.floor(Math.random() * 5);
    else showSurprise.value = null;
  };

  onMounted(() => {
    settings.value = loadSettings();

    setInterval(() => toggleSurprise(), 10000);
  });
</script>

<style>
  @keyframes slideRight {
    from {
      left: 5%;
      visibility: visible;
    }
    to {
      left: calc(95% - 200px);
      visibility: hidden;
    }
  }

  .slide-right {
    animation: slideRight 5s forwards ease;
  }
</style>
