import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { getTodayKey, getEntries, saveEntries, getSettings } from "../utils/storage";
import WaterEntry from "../components/WaterEntry";
import Animal from "../components/Animal";
import { useTheme } from "../theme";

const TodayScreen = () => {
  const { colors } = useTheme();
  const [entries, setEntries] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [imageSetKey, setImageSetKey] = useState(null);
  const [quickAmounts, setQuickAmounts] = useState([100, 200, 300, 500]);

  const dateKey = getTodayKey();

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const saved = await getEntries(dateKey);
        setEntries(saved);
        const settings = await getSettings();
        if (settings.imageSet) setImageSetKey(settings.imageSet);
        if (settings.quickAmounts) setQuickAmounts(settings.quickAmounts);
      };
      load();
    }, [dateKey])
  );

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

  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView
        style={{ flex: 1, paddingHorizontal: 20 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 28, fontWeight: "bold", color: colors.textPrimary }}>
            Today's Water
          </Text>
          <Text style={{ fontSize: 14, color: colors.textMuted, marginTop: 2 }}>
            {dateString}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 12,
            borderWidth: 1,
            borderColor: colors.highlight,
            maxHeight: 250,
          }}
        >
          <FlatList
            data={entries}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <WaterEntry amount={item} index={index} onDelete={deleteEntry} />
            )}
            ListEmptyComponent={
              <Text
                style={{
                  textAlign: "center",
                  color: colors.textMuted,
                  fontSize: 15,
                  paddingVertical: 20,
                  lineHeight: 22,
                }}
              >
                No water logged yet today.{"\n"}Add your first glass below!
              </Text>
            }
            style={{ flexGrow: 0 }}
          />

          <View style={{ marginTop: 4 }}>
            <View
              style={{
                height: 2,
                backgroundColor: colors.highlight,
                borderRadius: 1,
                marginBottom: 8,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 16,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.accent }}>
                Total
              </Text>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.accent }}>
                {total} ml
              </Text>
            </View>
          </View>
        </View>

        <Animal totalWater={total} imageSetKey={imageSetKey} />

        <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
          <TextInput
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              color: colors.textPrimary,
              borderWidth: 1,
              borderColor: colors.highlight,
            }}
            placeholder="Amount in ml..."
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={addEntry}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={{
              backgroundColor: colors.highlight,
              borderRadius: 12,
              paddingHorizontal: 20,
              justifyContent: "center",
            }}
            onPress={addEntry}
          >
            <Text style={{ color: colors.textPrimary, fontWeight: "bold", fontSize: 16 }}>
              + Add
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
            marginBottom: 16,
            gap: 8,
          }}
        >
          {quickAmounts.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={{
                flex: 1,
                backgroundColor: colors.surfaceLight,
                borderRadius: 10,
                paddingVertical: 10,
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.highlight,
              }}
              onPress={() => setEntries([...entries, amount])}
            >
              <Text style={{ color: colors.accent, fontWeight: "600", fontSize: 13 }}>
                {amount} ml
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TodayScreen;
