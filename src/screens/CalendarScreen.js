import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { getMonthTotals } from "../utils/storage";
import { DAILY_GOAL } from "../components/Animal";
import { useTheme } from "../theme";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CalendarScreen = () => {
  const { colors } = useTheme();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [totals, setTotals] = useState({});

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const data = await getMonthTotals(year, month);
        setTotals(data);
      };
      load();
    }, [year, month])
  );

  const goToPrevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const goToNextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;

  const calendarCells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push({ day: null, key: `empty-${i}` });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    calendarCells.push({ day, total: totals[dateStr] || 0, dateStr, key: dateStr });
  }

  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const daysWithData = Object.values(totals).filter((v) => v > 0).length;
  const daysMetGoal = Object.values(totals).filter((v) => v >= DAILY_GOAL).length;
  const monthTotal = Object.values(totals).reduce((sum, v) => sum + v, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <TouchableOpacity
            onPress={goToPrevMonth}
            style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: colors.surfaceLight, justifyContent: "center",
              alignItems: "center", borderWidth: 1, borderColor: colors.highlight,
            }}
          >
            <Text style={{ fontSize: 24, color: colors.accent, fontWeight: "bold" }}>‹</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: colors.textPrimary }}>
            {MONTH_NAMES[month]} {year}
          </Text>
          <TouchableOpacity
            onPress={goToNextMonth}
            style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: colors.surfaceLight, justifyContent: "center",
              alignItems: "center", borderWidth: 1, borderColor: colors.highlight,
            }}
          >
            <Text style={{ fontSize: 24, color: colors.accent, fontWeight: "bold" }}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", marginBottom: 8 }}>
          {DAYS_OF_WEEK.map((d) => (
            <Text key={d} style={{ flex: 1, textAlign: "center", fontSize: 13, fontWeight: "600", color: colors.textMuted }}>
              {d}
            </Text>
          ))}
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {calendarCells.map((cell) => {
            if (!cell.day) {
              return <View key={cell.key} style={{ width: "14.28%", aspectRatio: 1 }} />;
            }
            const isToday = cell.dateStr === todayStr;
            const metGoal = cell.total >= DAILY_GOAL;
            const hasData = cell.total > 0;

            return (
              <View
                key={cell.key}
                style={{
                  width: "14.28%", aspectRatio: 1, justifyContent: "center",
                  alignItems: "center", borderRadius: 8, padding: 2,
                  ...(isToday ? { borderWidth: 2, borderColor: colors.accent } : {}),
                  ...(metGoal ? { backgroundColor: colors.successBg } : {}),
                }}
              >
                <Text style={{
                  fontSize: 14, fontWeight: "600",
                  color: metGoal ? colors.success : isToday ? colors.accent : colors.textSecondary,
                }}>
                  {cell.day}
                </Text>
                {hasData ? (
                  <Text style={{
                    fontSize: 10, marginTop: 1,
                    color: metGoal ? colors.success : colors.textMuted,
                    fontWeight: metGoal ? "600" : "normal",
                  }}>
                    {cell.total >= 1000 ? `${(cell.total / 1000).toFixed(1)}L` : `${cell.total}`}
                  </Text>
                ) : null}
              </View>
            );
          })}
        </View>

        <View style={{
          backgroundColor: colors.surface, borderRadius: 16, padding: 16,
          marginTop: 20, marginBottom: 30, borderWidth: 1, borderColor: colors.highlight,
        }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.textPrimary, marginBottom: 12 }}>
            Monthly Summary
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 22, fontWeight: "bold", color: colors.accent }}>
                {monthTotal >= 1000 ? `${(monthTotal / 1000).toFixed(1)}L` : `${monthTotal} ml`}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>Total</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 22, fontWeight: "bold", color: colors.accent }}>{daysWithData}</Text>
              <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>Days logged</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 22, fontWeight: "bold", color: colors.success }}>{daysMetGoal}</Text>
              <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>Goals met</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CalendarScreen;
