import React from "react";
import { View, Text, Image } from "react-native";
import { useTheme } from "../theme";
import { IMAGE_SETS, DEFAULT_SET } from "../utils/imageSets";

const DAILY_GOAL = 2000;

const Animal = ({ totalWater, imageSetKey }) => {
  const { colors } = useTheme();
  const setKey = imageSetKey && IMAGE_SETS[imageSetKey] ? imageSetKey : DEFAULT_SET;
  const images = IMAGE_SETS[setKey].images;

  const isHappy = totalWater >= DAILY_GOAL;
  const progress = Math.min(totalWater / DAILY_GOAL, 1);

  let image, message;

  if (totalWater === 0) {
    image = images[0];
    message = "I'm so thirsty... please drink some water!";
  } else if (progress < 0.25) {
    image = images[1];
    message = "Just getting started... keep going!";
  } else if (progress < 0.5) {
    image = images[2];
    message = "Getting there! More water please!";
  } else if (progress < 0.75) {
    image = images[3];
    message = "Nice! Over halfway to the goal!";
  } else if (progress < 1) {
    image = images[4];
    message = "Almost there! Just a bit more!";
  } else {
    image = images[5];
    message = "Amazing! Daily goal reached!";
  }

  return (
    <View style={{ alignItems: "center", paddingVertical: 16, paddingHorizontal: 20 }}>
      <Image
        source={image}
        style={{ width: 150, height: 150, marginBottom: 8 }}
        resizeMode="contain"
      />
      <Text
        style={{
          fontSize: 16,
          color: isHappy ? colors.success : colors.textSecondary,
          fontWeight: isHappy ? "600" : "normal",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        {message}
      </Text>
      <View
        style={{
          width: "100%",
          height: 10,
          backgroundColor: colors.progressBarBg,
          borderRadius: 5,
          overflow: "hidden",
          marginBottom: 6,
        }}
      >
        <View
          style={{
            height: "100%",
            borderRadius: 5,
            width: `${progress * 100}%`,
            backgroundColor: isHappy ? colors.success : colors.accent,
          }}
        />
      </View>
      <Text style={{ fontSize: 14, color: colors.textMuted }}>
        {totalWater} / {DAILY_GOAL} ml
      </Text>
    </View>
  );
};

export { DAILY_GOAL };
export default Animal;
