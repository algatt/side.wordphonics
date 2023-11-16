<template>
  <div class="flex flex-col space-y-4 items-center" v-if="sequence.length > 0">
    <span
      class="flex lg:max-w-[400px] max-w-[200px] max-h-[200px] w-full h-full min-w-[200px] lg:min-w-[400px] min-h-[200px]"
    >
      <img
        :src="images[sequence[currentPosition]].src"
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

    <span class="text-purple-500 text-sm mt-2">{{ totalSelection }} cards</span>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import happy from "../assets/happy.png";
  import { createRandomOrderArray } from "../utilities";

  const props = defineProps(["images"]);
  const currentPosition = ref(0);
  const totalSelection = ref(props.images.length);
  const sequence = ref([]);

  onMounted(async () => {
    sequence.value = createRandomOrderArray(props.images.length);
    currentPosition.value = 0;
  });
</script>
