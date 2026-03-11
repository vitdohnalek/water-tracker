import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getTodayKey, getEntries, saveEntries } from "../utils/storage";
import WaterEntry from "../components/WaterEntry";
import Animal from "../components/Animal";
import { colors } from "../theme";

const TodayScreen = () => {
  const [entries, setEntries] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const dateKey = getTodayKey();

  // Load entries when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const saved = await getEntries(dateKey);
        setEntries(saved);
      };
      load();
    }, [dateKey])
  );

  // Save whenever entries change
  useEffect(() => {
    saveEntries(dateKey, entries);
  }, [entries, dateKey]);

  const total = entries.reduce((sum, val) => sum + val, 0);

  const addEntry = () => {
    const num = parseInt(inputValue, 10);
    if (!num || num <= 0) return;
    setEntries([...entries, num]);
    setInputValue("");
  };

  const deleteEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  // Format today's date nicely
  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Today's Water</Text>
        <Text style={styles.date}>{dateString}</Text>
      </View>

      {/* Water entries list */}
      <View style={styles.notepad}>
        <FlatList
          data={entries}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <WaterEntry amount={item} index={index} onDelete={deleteEntry} />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No water logged yet today.{"\n"}Add your first glass below!
            </Text>
          }
          style={styles.list}
        />

        {/* Divider line and sum */}
        <View style={styles.sumSection}>
          <View style={styles.divider} />
          <View style={styles.sumRow}>
            <Text style={styles.sumLabel}>Total</Text>
            <Text style={styles.sumValue}>{total} ml</Text>
          </View>
        </View>
      </View>

      {/* Animal */}
      <Animal totalWater={total} />

      {/* Input area */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Amount in ml..."
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={addEntry}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addBtn} onPress={addEntry}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Quick-add buttons */}
      <View style={styles.quickRow}>
        {[100, 200, 300, 500].map((amount) => (
          <TouchableOpacity
            key={amount}
            style={styles.quickBtn}
            onPress={() => setEntries([...entries, amount])}
          >
            <Text style={styles.quickBtnText}>{amount} ml</Text>
          </TouchableOpacity>
        ))}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  date: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  notepad: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.highlight,
    maxHeight: 250,
  },
  list: {
    flexGrow: 0,
  },
  emptyText: {
    textAlign: "center",
    color: colors.textMuted,
    fontSize: 15,
    paddingVertical: 20,
    lineHeight: 22,
  },
  sumSection: {
    marginTop: 4,
  },
  divider: {
    height: 2,
    backgroundColor: colors.highlight,
    borderRadius: 1,
    marginBottom: 8,
  },
  sumRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  sumLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.accent,
  },
  sumValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.accent,
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.highlight,
  },
  addBtn: {
    backgroundColor: colors.highlight,
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  addBtnText: {
    color: colors.textPrimary,
    fontWeight: "bold",
    fontSize: 16,
  },
  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 16,
    gap: 8,
  },
  quickBtn: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.highlight,
  },
  quickBtnText: {
    color: colors.accent,
    fontWeight: "600",
    fontSize: 13,
  },
});

export default TodayScreen;
