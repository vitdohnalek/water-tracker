import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { colors } from "../theme";

const DAILY_GOAL = 2000; // ml — change this to your personal goal

const animalImages = [
  require("../../assets/animals/image_01.png"),
  require("../../assets/animals/image_02.png"),
  require("../../assets/animals/image_03.png"),
  require("../../assets/animals/image_04.png"),
  require("../../assets/animals/image_05.png"),
  require("../../assets/animals/image_06.png"),
];

const Animal = ({ totalWater }) => {
  const isHappy = totalWater >= DAILY_GOAL;
  const progress = Math.min(totalWater / DAILY_GOAL, 1);

  let image, message;

  if (totalWater === 0) {
    image = animalImages[0];
    message = "I'm so thirsty... please drink some water!";
  } else if (progress < 0.25) {
    image = animalImages[1];
    message = "Just getting started... keep going!";
  } else if (progress < 0.5) {
    image = animalImages[2];
    message = "Getting there! More water please!";
  } else if (progress < 0.75) {
    image = animalImages[3];
    message = "Nice! Over halfway to the goal!";
  } else if (progress < 1) {
    image = animalImages[4];
    message = "Almost there! Just a bit more!";
  } else {
    image = animalImages[5];
    message = "Amazing! Daily goal reached!";
  }

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <Text style={[styles.message, isHappy && styles.happyMessage]}>
        {message}
      </Text>
      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${progress * 100}%`,
              backgroundColor: isHappy ? colors.success : colors.accent,
            },
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        {totalWater} / {DAILY_GOAL} ml
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 12,
  },
  happyMessage: {
    color: colors.success,
    fontWeight: "600",
  },
  progressBarBg: {
    width: "100%",
    height: 10,
    backgroundColor: colors.progressBarBg,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});

export { DAILY_GOAL };
export default Animal;
