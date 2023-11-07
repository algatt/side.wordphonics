<template>
  <div
    class="min-h-screen min-w-screen flex items-center flex-col pt-12 bg-cover"
    :style="`background-image: url(${background});`"
  >
    <div
      class="bg-white bg-opacity-70 backdrop-blur-sm px-20 py-4 rounded-lg max-w-[500px] border-2 border-purple-700 shadow"
    >
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
  import background from "./assets/background.jpg";
</script>
