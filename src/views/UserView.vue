<template>
  <div class="flex justify-center items-center">
    <img :src="logo" class="w-[400px]" />
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
      <option value="__all__">All Folders</option>
      <option
        v-for="folder in prettyFolderNames"
        :key="folder.id"
        :value="folder.id"
      >
        {{ folder.formattedDate }}
      </option>
    </select>

    <div v-if="showAll === 'no'" class="flex flex-col items-center w-full">
      <ImageDisplay
        :key="refreshKey"
        class="pt-8"
        v-if="selectedFolder && images"
        :images="images"
      ></ImageDisplay>
    </div>
    <div v-else class="flex flex-col items-center w-full">
      <LoadingSpinner
        v-if="showAll === 'loading'"
        class="mt-6"
      ></LoadingSpinner>
      <ImageDisplay
        v-else
        :key="refreshKey"
        class="pt-8"
        :images="images"
        :total-cards="25"
      ></ImageDisplay>
    </div>
  </div>
</template>

<script setup>
  import axios from "axios";
  import { onMounted, ref, computed } from "vue";
  import ImageDisplay from "../components/ImageDisplay.vue";
  import LoadingSpinner from "../components/LoadingSpinner.vue";
  import logo from "../assets/logo.png";

  const apiKey = import.meta.env.VITE_DRIVE_API_KEY;
  const folderId = import.meta.env.VITE_DRIVE_FOLDER_ID;
  const folders = ref(null);
  const isLoading = ref(true);
  const selectedFolder = ref(null);
  const images = ref(null);
  const refreshKey = ref(0);
  const showAll = ref("no");

  const url = `https://www.googleapis.com/drive/v3/files`;

  const getAllFiles = async (parentFolderId) => {
    const params = {
      q: `'${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id, name)",
      key: apiKey,
    };

    try {
      const images = [];
      const response = await axios.get(url, { params });
      response.data.files = response.data.files.sort((a, b) => {
        return a.name > b.name ? 1 : -1;
      });
      const content = response.data.files;

      for (const item of content) {
        images.push(...(await getImageFiles(item.id)));
      }

      return images;
    } catch (error) {
      console.log(error);
    }
  };

  const prettyFolderNames = computed(() => {
    if (!folders.value || !folders.value.files) return [];
    return folders.value.files.map((el) => {
      const dateString = el.name;

      let formattedDate = el.name;

      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      const date = new Date(year, month - 1, day);
      formattedDate = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });

      if (formattedDate === "Invalid Date") formattedDate = el.name;

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
    if (!selectedFolder.value) {
      images.value = null;
      showAll.value = "no";
    } else if (selectedFolder.value === "__all__") {
      showAll.value = "loading";
      images.value = await getAllFiles(folderId);
      showAll.value = "yes";
    } else {
      images.value = await getImageFiles(selectedFolder.value);
      showAll.value == "no";
    }
    refreshKey.value++;
  };

  onMounted(async () => {
    folders.value = await getFolderNames(folderId); // await the async function call
    isLoading.value = false;
    // console.log(await getAllFiles(folderId));
  });
</script>
