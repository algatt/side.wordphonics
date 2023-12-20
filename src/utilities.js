import axios from "axios";
import { PHONICS_SETTINGS } from "./constants";

const url = `https://www.googleapis.com/drive/v3/files`;
const apiKey = import.meta.env.VITE_DRIVE_API_KEY;
const folderId = import.meta.env.VITE_DRIVE_FOLDER_ID;

export const createRandomOrderArray = (length) => {
  const array = Array.from({ length }, (_, i) => i);
  return shuffleArray(array);
};

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getAllFolders = async (
  parentFolderId,
  orderBy,
  orderDirection
) => {
  if (!parentFolderId) parentFolderId = folderId;
  const params = {
    q: `'${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: " files(id, name)",
    key: apiKey,
    orderBy: `${orderBy} ${orderDirection}`,
  };

  try {
    const response = await axios.get(url, { params });
    return response.data.files;
  } catch (error) {
    console.log(error);
  }
};

const convertStringToDate = (dateString) => {
  let formattedDate = "";
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  const date = new Date(year, month - 1, day);
  formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  return formattedDate === "Invalid Date" ? dateString : formattedDate;
};

/* parameters for mode can be 
    BY_NAME - folder name remains the same
    BY_ORDER - generates a sequence of numbers based on sorting
    BY_DATE_PARSE - tries to parse date or use original name
*/
export const renameFolders = (folderCollection, mode = "BY_NAME") => {
  try {
    return folderCollection.map((el, index) => {
      let newName = el.name;
      if (mode === "BY_ORDER") {
        newName = index + 1;
      } else if (mode === "BY_DATE_PARSE") {
        newName = convertStringToDate(el.name);
      }
      return {
        ...el,
        formattedName: newName,
      };
    });
  } catch {
    return null;
  }
};

export const getImageFiles = async (folderId) => {
  const imageMimeTypes = ["image/jpeg", "image/png", "image/bmp", "image/gif"];

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

export const getImageFilesFromMultipleFolders = async (folders) => {
  const images = [];
  for (let folder of folders) {
    try {
      const result = await getImageFiles(folder);
      images.push(...result);
    } catch (error) {
      console.log(error);
    }
  }
  return images;
};

export const getRandomImages = async (images, count) => {
  if (!images || !count) return [];
  const totalImages = images.length;
  if (count > totalImages) count = totalImages;
  const randomSequence = createRandomOrderArray(images.length);
  const selectedImagesIndex = randomSequence.slice(0, count);
  const selectedImages = [];
  for (let i of selectedImagesIndex) {
    selectedImages.push(images[i]);
  }
  return selectedImages;
};

export const getRandomFolders = (folders, count) => {
  if (!folders || !count) return [];
  const totalFolders = folders.length;
  if (count > totalFolders) return [];
  const randomSequence = createRandomOrderArray(folders.length);
  const selectedFoldersIndex = randomSequence.slice(0, count);
  const selectedFolders = [];
  for (let i of selectedFoldersIndex) {
    selectedFolders.push(folders[i].id);
  }
  return selectedFolders;
};

export const preloadImages = async (links) => {
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

export const loadSettings = () => {
  let settings = localStorage.getItem("phonics-settings");
  if (!settings) settings = PHONICS_SETTINGS;
  else settings = JSON.parse(settings);
  if (!settings.Animation) settings.Animation = PHONICS_SETTINGS.Animation;
  localStorage.setItem("phonics-settings", JSON.stringify(settings));
  return settings;
};

export const saveSettings = (settings) => {
  localStorage.setItem("phonics-settings", JSON.stringify(settings));
};
