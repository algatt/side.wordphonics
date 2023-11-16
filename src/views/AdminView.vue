<template>
  <div class="flex flex-col space-y-4">
    <div class="flex flex-col items-center space-y-6" v-if="!isValid">
      <span class="text-3xl text-purple-600 font-medium">Password</span>
      <input
        v-model="password"
        class="w-[150px] text-xl focus:outline-none focus:ring-0 py-2 px-2 rounded-lg border-2 border-purple-700 bg-purple-100"
        type="password"
      />
    </div>
    <div v-else class="flex flex-col space-y-6">
      <span class="text-3xl text-purple-600 font-medium">Settings</span>
      <span
        v-for="title of Object.keys(settings)"
        class="flex flex-col space-y-2"
      >
        <span class="font-medium text-xl">{{ title }}</span>
        <span
          v-for="subtitle of Object.keys(settings[title])"
          class="flex-col space-y-2"
        >
          <span class="text-lg">{{ subtitle }}</span>
          <select
            v-model="settings[title][subtitle].selectedValue"
            class="max-width-[300px] text-xl w-full focus:outline-none focus:ring-0 py-2 px-2 rounded-lg border-2 border-purple-700 bg-purple-100"
          >
            <option
              v-for="option of settings[title][subtitle].availableValues"
              :value="option.value"
            >
              {{ option.display }}
            </option>
          </select>
        </span>
      </span>
    </div>
    <router-link
      :to="{ name: 'User' }"
      class="bg-purple-600 text-purple-100 text-xl p-4 rounded-lg self-center"
      >Back to App</router-link
    >
  </div>
</template>

<script setup>
  import { onMounted, ref, watch } from "vue";
  import { loadSettings, saveSettings } from "../utilities";

  const password = ref("");
  const isValid = ref(false);
  const settings = ref(null);

  watch(password, (val) => {
    if (val === "robert") {
      settings.value = loadSettings();
      isValid.value = true;
    }
  });

  watch(
    settings,
    (val) => {
      saveSettings(val);
    },
    { deep: true }
  );

  onMounted(() => {
    isValid.value = false;
  });
</script>
