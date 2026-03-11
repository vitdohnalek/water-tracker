import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../theme";

const WaterEntry = ({ amount, index, onDelete }) => {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={styles.bullet}>💧</Text>
        <Text style={styles.amount}>{amount} ml</Text>
      </View>
      <TouchableOpacity onPress={() => onDelete(index)} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    marginBottom: 8,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bullet: {
    fontSize: 18,
  },
  amount: {
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  deleteBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.dangerBg,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default WaterEntry;
