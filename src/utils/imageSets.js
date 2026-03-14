// Registry of all animal image sets
// Each set has 6 images (image_01 through image_06) and a display name

const IMAGE_SETS = {
  thirsty_animals: {
    name: "Thirsty Animals",
    images: [
      require("../../assets/sets/thirsty_animals/image_01.png"),
      require("../../assets/sets/thirsty_animals/image_02.png"),
      require("../../assets/sets/thirsty_animals/image_03.png"),
      require("../../assets/sets/thirsty_animals/image_04.png"),
      require("../../assets/sets/thirsty_animals/image_05.png"),
      require("../../assets/sets/thirsty_animals/image_06.png"),
    ],
  },
  test_animals: {
    name: "Test Animals",
    images: [
      require("../../assets/sets/test_animals/image_01.png"),
      require("../../assets/sets/test_animals/image_02.png"),
      require("../../assets/sets/test_animals/image_03.png"),
      require("../../assets/sets/test_animals/image_04.png"),
      require("../../assets/sets/test_animals/image_05.png"),
      require("../../assets/sets/test_animals/image_06.png"),
    ],
  },
};

const DEFAULT_SET = "thirsty_animals";
const SET_KEYS = Object.keys(IMAGE_SETS);

export { IMAGE_SETS, DEFAULT_SET, SET_KEYS };
