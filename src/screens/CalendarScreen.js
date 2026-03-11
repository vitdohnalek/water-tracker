import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getMonthTotals } from "../utils/storage";
import { DAILY_GOAL } from "../components/Animal";
import { colors } from "../theme";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CalendarScreen = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed
  const [totals, setTotals] = useState({});

  // Load data when screen focuses or month changes
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
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  // Build the calendar grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // getDay() returns 0=Sunday, we want 0=Monday
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;

  const calendarCells = [];

  // Empty cells before the 1st
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push({ day: null, key: `empty-${i}` });
  }

  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const total = totals[dateStr] || 0;
    calendarCells.push({ day, total, dateStr, key: dateStr });
  }

  // Check if a date is today
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // Calculate month stats
  const daysWithData = Object.values(totals).filter((v) => v > 0).length;
  const daysMetGoal = Object.values(totals).filter((v) => v >= DAILY_GOAL).length;
  const monthTotal = Object.values(totals).reduce((sum, v) => sum + v, 0);

  return (
    <ScrollView style={styles.container}>
      {/* Month navigation */}
      <View style={styles.monthNav}>
        <TouchableOpacity onPress={goToPrevMonth} style={styles.navBtn}>
          <Text style={styles.navBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {MONTH_NAMES[month]} {year}
        </Text>
        <TouchableOpacity onPress={goToNextMonth} style={styles.navBtn}>
          <Text style={styles.navBtnText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Day of week headers */}
      <View style={styles.weekRow}>
        {DAYS_OF_WEEK.map((d) => (
          <Text key={d} style={styles.weekDay}>
            {d}
          </Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.grid}>
        {calendarCells.map((cell) => {
          if (!cell.day) {
            return <View key={cell.key} style={styles.cell} />;
          }

          const isToday = cell.dateStr === todayStr;
          const metGoal = cell.total >= DAILY_GOAL;
          const hasData = cell.total > 0;

          return (
            <View
              key={cell.key}
              style={[
                styles.cell,
                isToday && styles.todayCell,
                metGoal && styles.goalMetCell,
              ]}
            >
              <Text
                style={[
                  styles.dayNumber,
                  isToday && styles.todayText,
                  metGoal && styles.goalMetText,
                ]}
              >
                {cell.day}
              </Text>
              {hasData ? (
                <Text
                  style={[
                    styles.dayTotal,
                    metGoal && styles.goalMetTotal,
                  ]}
                >
                  {cell.total >= 1000
                    ? `${(cell.total / 1000).toFixed(1)}L`
                    : `${cell.total}`}
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>

      {/* Monthly stats */}
      <View style={styles.stats}>
        <Text style={styles.statsTitle}>Monthly Summary</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {monthTotal >= 1000
                ? `${(monthTotal / 1000).toFixed(1)}L`
                : `${monthTotal} ml`}
            </Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{daysWithData}</Text>
            <Text style={styles.statLabel}>Days logged</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {daysMetGoal}
            </Text>
            <Text style={styles.statLabel}>Goals met</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  monthNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  navBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.highlight,
  },
  navBtnText: {
    fontSize: 24,
    color: colors.accent,
    fontWeight: "bold",
  },
  monthTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    padding: 2,
  },
  todayCell: {
    borderWidth: 2,
    borderColor: colors.accent,
  },
  goalMetCell: {
    backgroundColor: colors.successBg,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  todayText: {
    color: colors.accent,
  },
  goalMetText: {
    color: colors.success,
  },
  dayTotal: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  goalMetTotal: {
    color: colors.success,
    fontWeight: "600",
  },
  stats: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: colors.highlight,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.accent,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});

export default CalendarScreen;
