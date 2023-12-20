<template>
  <div class="flex flex-col items-center">
    <LoadingSpinner v-if="isLoading"></LoadingSpinner>
    <div v-else class="flex flex-col items-center space-y-4">
      <img :src="logo" class="w-[400px]" />

      <select
        v-model="selectedFolder"
        @change="selectedFolderChange"
        class="max-width-[300px] text-xl w-full focus:outline-none focus:ring-0 py-2 px-2 rounded-lg border-2 border-purple-700 bg-purple-100"
        style="font-family: Montserrat"
      >
        <option :value="null" disabled>Select Folder</option>
        <option value="all">All Folders</option>
        <option v-for="folder in allFolders" :value="folder.id">
          {{ folder.formattedName }}
        </option>
      </select>

      <div>
        <LoadingSpinner v-if="isFlashCardLoading"></LoadingSpinner>
        <div v-else>
          <ImageDisplay
            :key="refreshKey"
            :images="displayImages"
            v-if="displayImages"
          ></ImageDisplay>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref } from "vue";
  import ImageDisplay from "../components/ImageDisplay.vue";
  import LoadingSpinner from "../components/LoadingSpinner.vue";
  import logo from "../assets/logo.png";
  import {
    getAllFolders,
    renameFolders,
    getImageFiles,
    loadSettings,
    getRandomFolders,
    getImageFilesFromMultipleFolders,
    getRandomImages,
    preloadImages,
  } from "../utilities";

  const isLoading = ref(true);
  const isFlashCardLoading = ref(false);
  const selectedFolder = ref(null);
  const images = ref(null);
  const refreshKey = ref(0);
  const settings = ref(null);
  const displayImages = ref(null);

  const allFolders = ref([]);

  const selectedFolderChange = async () => {
    displayImages.value = null;
    isFlashCardLoading.value = true;
    if (selectedFolder.value === "all") {
      try {
        let folderCount = Math.round(allFolders.value.length / 3);
        const selectedFolders = getRandomFolders(allFolders.value, folderCount);
        const allImages = await getImageFilesFromMultipleFolders(
          selectedFolders
        );
        let imageCount =
          settings.value["Questions"]["Question Count (All)"].selectedValue;
        images.value = await getRandomImages(allImages, imageCount);
      } catch (error) {
        console.log(error);
      }
    } else images.value = await getImageFiles(selectedFolder.value);

    const links = images.value.map((el) => {
      return el.webContentLink;
    });
    displayImages.value = await preloadImages(links);
    refreshKey.value++;
    isFlashCardLoading.value = false;
  };

  onMounted(async () => {
    settings.value = loadSettings();

    allFolders.value = await getAllFolders(
      null,
      settings.value["Sorting"]["Sort By"].selectedValue,
      settings.value["Sorting"]["Direction"].selectedValue
    );

    allFolders.value = renameFolders(
      allFolders.value,
      settings.value["Folder"]["Folder Naming"].selectedValue
    );
    isLoading.value = false;
  });
</script>
