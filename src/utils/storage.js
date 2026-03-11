import AsyncStorage from "@react-native-async-storage/async-storage";

// Key format: "water-YYYY-MM-DD" -> JSON array of numbers
const getKey = (date) => {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `water-${year}-${month}-${day}`;
};

export const getTodayKey = () => getKey(new Date());

export const getEntries = async (dateKey) => {
  try {
    const data = await AsyncStorage.getItem(dateKey);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load entries:", e);
    return [];
  }
};

export const saveEntries = async (dateKey, entries) => {
  try {
    await AsyncStorage.setItem(dateKey, JSON.stringify(entries));
  } catch (e) {
    console.error("Failed to save entries:", e);
  }
};

// Get total water for a specific date key
export const getDayTotal = async (dateKey) => {
  const entries = await getEntries(dateKey);
  return entries.reduce((sum, val) => sum + val, 0);
};

// Get totals for an entire month: { "2025-01-15": 2100, "2025-01-16": 1800, ... }
export const getMonthTotals = async (year, month) => {
  const totals = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const keys = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    keys.push(getKey(d));
  }

  // Batch fetch all keys for the month
  try {
    const pairs = await AsyncStorage.multiGet(keys);
    for (const [key, value] of pairs) {
      if (value) {
        const entries = JSON.parse(value);
        const total = entries.reduce((sum, val) => sum + val, 0);
        if (total > 0) {
          // Extract date part: "water-2025-01-15" -> "2025-01-15"
          const dateStr = key.replace("water-", "");
          totals[dateStr] = total;
        }
      }
    }
  } catch (e) {
    console.error("Failed to load month totals:", e);
  }

  return totals;
};
