import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../theme";

const WaterEntry = ({ amount, index, onDelete }) => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: colors.surfaceLight,
        borderRadius: 10,
        marginBottom: 8,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 18 }}>💧</Text>
        <Text style={{ fontSize: 18, color: colors.textPrimary, fontWeight: "500" }}>
          {amount} ml
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => onDelete(index)}
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: colors.dangerBg,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: colors.danger, fontSize: 14, fontWeight: "bold" }}>
          ✕
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default WaterEntry;
