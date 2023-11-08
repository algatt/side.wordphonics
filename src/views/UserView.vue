<template>
  <div
    class="text-3xl font-semibold text-purple-700 pt-6"
    style="font-family: Montserrat"
  >
    Robert Phonics
  </div>
  <div v-if="isLoading" class="flex justify-center">
    <LoadingSpinner></LoadingSpinner>
  </div>
  <div v-else class="py-8">
    <select
      v-model="selectedFolder"
      @change="updateImages"
      class="text-xl w-full focus:outline-none focus:ring-0 py-2 px-2 rounded-lg border-2 border-purple-700 bg-purple-100"
      style="font-family: Montserrat"
    >
      <option :value="null">Select a Date</option>
      <option
        v-for="folder in prettyFolderNames"
        :key="folder.id"
        :value="folder.id"
      >
        {{ folder.formattedDate }}
      </option>
    </select>

    <ImageDisplay
      :key="refreshKey"
      class="py-8"
      v-if="selectedFolder && images"
      :images="images"
    ></ImageDisplay>
  </div>
</template>

<script setup>
  import axios from "axios";
  import { onMounted, ref, computed } from "vue";
  import ImageDisplay from "../components/ImageDisplay.vue";
  import LoadingSpinner from "../components/LoadingSpinner.vue";

  const apiKey = import.meta.env.VITE_DRIVE_API_KEY;
  const folderId = import.meta.env.VITE_DRIVE_FOLDER_ID;
  const folders = ref(null);
  const isLoading = ref(true);
  const selectedFolder = ref(null);
  const images = ref(null);
  const refreshKey = ref(0);

  const url = `https://www.googleapis.com/drive/v3/files`;

  const prettyFolderNames = computed(() => {
    if (!folders.value || !folders.value.files) return [];
    return folders.value.files.map((el) => {
      const dateString = el.name;

      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      const date = new Date(year, month - 1, day);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });
      return {
        ...el,
        formattedDate: formattedDate,
      };
    });
  });

  const getFolderNames = async (parentFolderId) => {
    const params = {
      q: `'${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id, name)",
      key: apiKey,
    };

    try {
      const response = await axios.get(url, { params });
      response.data.files = response.data.files.sort((a, b) => {
        return a.name > b.name ? 1 : -1;
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getImageFiles = async (folderId) => {
    const imageMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/bmp",
      "image/gif",
    ];
    const mimeTypeQuery = imageMimeTypes
      .map((type) => `mimeType='${type}'`)
      .join(" or ");
    const query = `'${folderId}' in parents and (${mimeTypeQuery}) and trashed=false`;
    const params = {
      q: query,
      fields: "files(id, name, mimeType, thumbnailLink, webContentLink)", // Add 'thumbnailLink' to get the thumbnail URL of the images
      key: apiKey,
    };

    try {
      const response = await axios.get(url, { params });
      return response.data.files; // this will be an array of image files
    } catch (error) {
      console.error("Error fetching image files:", error);
      throw error; // re-throw the error to be handled by the caller
    }
  };

  const updateImages = async () => {
    images.value = await getImageFiles(selectedFolder.value);
    refreshKey.value++;
  };

  onMounted(async () => {
    folders.value = await getFolderNames(folderId); // await the async function call
    isLoading.value = false;
  });
</script>
