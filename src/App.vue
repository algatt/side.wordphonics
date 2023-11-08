<template>
  <div
    class="min-h-screen min-w-screen flex items-center flex-col pt-12 bg-cover justify-between"
    :style="`background-image: url(${selectedBackground});`"
  >
    <div
      class="bg-white bg-opacity-70 backdrop-blur-sm px-20 py-4 rounded-lg max-w-[95%] max-h-[80%] lg:max-h-[1000px] lg:max-w-[500px] border-2 border-purple-700 shadow w-full h-full"
    >
      <router-view></router-view>
    </div>
    <div class="py-8 flex items-center space-x-3">
      <button
        class="w-24 h-16 rounded-lg object-cover overflow-hidden border-2 border-purple-700"
        @click="selectedBackground = background01"
      >
        <img :src="background01" class="w-full h-full object-cover" />
      </button>
      <button
        class="w-24 h-16 rounded-lg object-cover overflow-hidden border-2 border-purple-700"
        @click="selectedBackground = background02"
      >
        <img :src="background02" class="w-full h-full object-cover" />
      </button>
      <button
        class="w-24 h-16 rounded-lg object-cover overflow-hidden border-2 border-purple-700"
        @click="selectedBackground = background03"
      >
        <img :src="background03" class="w-full h-full object-cover" />
      </button>
    </div>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import background01 from "./assets/background_01.jpg";
  import background02 from "./assets/background_02.jpg";
  import background03 from "./assets/background_03.jpg";

  const selectedBackground = ref(background01);
</script>
