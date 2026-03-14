import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { getSettings, saveSetting } from "../utils/storage";
import { IMAGE_SETS, DEFAULT_SET, SET_KEYS } from "../utils/imageSets";
import { useTheme, THEMES, THEME_KEYS } from "../theme";

const DEFAULT_QUICK_AMOUNTS = [100, 200, 300, 500];

const SettingsScreen = () => {
  const { colors, themeKey, setThemeKey } = useTheme();
  const [selectedSet, setSelectedSet] = useState(DEFAULT_SET);
  const [animalDropdownOpen, setAnimalDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [quickAmounts, setQuickAmounts] = useState(DEFAULT_QUICK_AMOUNTS);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const settings = await getSettings();
        if (settings.imageSet) setSelectedSet(settings.imageSet);
        if (settings.quickAmounts) setQuickAmounts(settings.quickAmounts);
      };
      load();
    }, [])
  );

  const handleSelectSet = async (key) => {
    setSelectedSet(key);
    setAnimalDropdownOpen(false);
    await saveSetting("imageSet", key);
  };

  const handleSelectTheme = async (key) => {
    setThemeDropdownOpen(false);
    await setThemeKey(key);
  };

  const renderDropdown = ({ label, isOpen, setIsOpen, selectedKey, keys, onSelect, renderIcon, getName }) => (
    <View style={{ marginBottom: 24, zIndex: isOpen ? 10 : 1 }}>
      <Text style={{ fontSize: 16, fontWeight: "600", color: colors.textSecondary, marginBottom: 8 }}>
        {label}
      </Text>
      <TouchableOpacity
        style={{
          flexDirection: "row", alignItems: "center", justifyContent: "space-between",
          backgroundColor: colors.surface, borderRadius: 12, padding: 12,
          borderWidth: 1, borderColor: colors.highlight,
        }}
        onPress={() => {
          setIsOpen(!isOpen);
          // Close the other dropdown
          if (label === "Image Set") setThemeDropdownOpen(false);
          else setAnimalDropdownOpen(false);
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {renderIcon(selectedKey)}
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.textPrimary }}>
            {getName(selectedKey)}
          </Text>
        </View>
        <Text style={{ fontSize: 12, color: colors.textMuted }}>
          {isOpen ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={{
          backgroundColor: colors.surface, borderRadius: 12, marginTop: 4,
          borderWidth: 1, borderColor: colors.highlight, overflow: "hidden",
        }}>
          {keys.map((key) => {
            const isActive = key === selectedKey;
            return (
              <TouchableOpacity
                key={key}
                style={{
                  flexDirection: "row", alignItems: "center", padding: 12, gap: 12,
                  borderBottomWidth: 1, borderBottomColor: colors.highlight,
                  ...(isActive ? { backgroundColor: colors.surfaceLight } : {}),
                }}
                onPress={() => onSelect(key)}
              >
                {renderIcon(key)}
                <Text style={{
                  fontSize: 16,
                  color: isActive ? colors.accent : colors.textPrimary,
                  fontWeight: isActive ? "600" : "normal",
                }}>
                  {getName(key)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: colors.textPrimary, marginBottom: 24 }}>
          Settings
        </Text>

        {renderDropdown({
          label: "Image Set",
          isOpen: animalDropdownOpen,
          setIsOpen: setAnimalDropdownOpen,
          selectedKey: selectedSet,
          keys: SET_KEYS,
          onSelect: handleSelectSet,
          renderIcon: (key) => (
            <Image
              source={IMAGE_SETS[key].images[1]}
              style={{ width: 36, height: 36 }}
              resizeMode="contain"
            />
          ),
          getName: (key) => IMAGE_SETS[key].name,
        })}

        {/* Quick add buttons */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.textSecondary, marginBottom: 8 }}>
            Quick Add Buttons
          </Text>
          <View style={{
            backgroundColor: colors.surface, borderRadius: 12, padding: 12,
            borderWidth: 1, borderColor: colors.highlight,
          }}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {quickAmounts.map((amount, i) => (
                <TouchableOpacity
                  key={i}
                  style={{
                    flex: 1, backgroundColor: editingIndex === i ? colors.bg : colors.surfaceLight,
                    borderRadius: 10, paddingVertical: 10, alignItems: "center",
                    borderWidth: 1, borderColor: editingIndex === i ? colors.accent : colors.highlight,
                  }}
                  onPress={() => {
                    setEditingIndex(i);
                    setEditValue(String(amount));
                  }}
                >
                  <Text style={{ color: colors.accent, fontWeight: "600", fontSize: 13 }}>
                    {amount} ml
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {editingIndex !== null && (
              <View style={{ flexDirection: "row", gap: 8, marginTop: 12, alignItems: "center" }}>
                <TextInput
                  style={{
                    flex: 1, backgroundColor: colors.bg, borderRadius: 10,
                    paddingHorizontal: 14, paddingVertical: 10, fontSize: 16,
                    color: colors.textPrimary, borderWidth: 1, borderColor: colors.highlight,
                  }}
                  keyboardType="numeric"
                  value={editValue}
                  onChangeText={setEditValue}
                  autoFocus
                  placeholder="ml..."
                  placeholderTextColor={colors.textMuted}
                />
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.highlight, borderRadius: 10,
                    paddingHorizontal: 16, paddingVertical: 10,
                  }}
                  onPress={async () => {
                    const num = parseInt(editValue, 10);
                    if (num > 0) {
                      const updated = [...quickAmounts];
                      updated[editingIndex] = num;
                      setQuickAmounts(updated);
                      await saveSetting("quickAmounts", updated);
                    }
                    setEditingIndex(null);
                  }}
                >
                  <Text style={{ color: colors.textPrimary, fontWeight: "bold", fontSize: 14 }}>
                    Save
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ paddingHorizontal: 8, paddingVertical: 10 }}
                  onPress={() => setEditingIndex(null)}
                >
                  <Text style={{ color: colors.textMuted, fontSize: 14 }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {renderDropdown({
          label: "Theme",
          isOpen: themeDropdownOpen,
          setIsOpen: setThemeDropdownOpen,
          selectedKey: themeKey,
          keys: THEME_KEYS,
          onSelect: handleSelectTheme,
          renderIcon: (key) => (
            <View
              style={{
                width: 36, height: 36, borderRadius: 18,
                backgroundColor: THEMES[key].circle,
                borderWidth: 2, borderColor: colors.highlight,
              }}
            />
          ),
          getName: (key) => THEMES[key].name,
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
