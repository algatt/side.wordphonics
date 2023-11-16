export const ORDER_BY_FIELDS = [
  { display: "Created Time", value: "createdTime" },
  { display: "Modified Time", value: "modifiedTime" },
  { display: "Name", value: "name" },
];

export const ORDER_BY_DIRECTION = [
  { display: "Ascending", value: "" },
  { display: "Descending", value: "desc" },
];

export const FOLDER_NAMING = [
  { display: "Use Original Name", value: "BY_NAME" },
  { display: "Use Index Number", value: "BY_ORDER" },
  { display: "Use Date (when possible)", value: "BY_DATE_PARSE" },
];

const generateAvailableQuestions = () => {
  const result = [];
  for (let i = 5; i <= 100; i += 5) {
    result.push({ display: String(i), value: i });
  }
  return result;
};

export const PHONICS_SETTINGS = {
  Sorting: {
    "Sort By": {
      selectedValue: "modifiedTime",
      availableValues: ORDER_BY_FIELDS,
    },
    Direction: {
      selectedValue: "desc",
      availableValues: ORDER_BY_DIRECTION,
    },
  },
  Folder: {
    "Folder Naming": {
      selectedValue: "BY_NAME",
      availableValues: FOLDER_NAMING,
    },
  },
  Questions: {
    "Question Count (All)": {
      selectedValue: 20,
      availableValues: generateAvailableQuestions(),
    },
  },
};
