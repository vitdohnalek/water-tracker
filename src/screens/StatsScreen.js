import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { getRangeTotals, getMonthTotals } from "../utils/storage";
import { DAILY_GOAL } from "../components/Animal";
import { useTheme } from "../theme";

const PERIODS = ["Week", "Month", "Year"];
const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const SHORT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CHART_HEIGHT = 200;
const Y_AXIS_WIDTH = 30;

const getYTicks = (maxValue) => {
  const maxL = maxValue / 1000;
  let step;
  if (maxL <= 1) step = 0.5;
  else if (maxL <= 3) step = 0.5;
  else if (maxL <= 5) step = 1;
  else step = 2;
  const ticks = [];
  for (let v = step; v <= maxL; v += step) {
    ticks.push(v);
  }
  return ticks;
};

const StatsScreen = () => {
  const { colors } = useTheme();
  const [period, setPeriod] = useState("Month");
  const [chartData, setChartData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const now = new Date();
        if (period === "Week") {
          const dayOfWeek = (now.getDay() + 6) % 7;
          const monday = new Date(now);
          monday.setDate(monday.getDate() - dayOfWeek);
          const results = await getRangeTotals(monday, 7);
          setChartData(results.map((r, i) => ({ label: SHORT_DAYS[i], value: r.total, showLabel: true })));
        } else if (period === "Month") {
          const start = new Date(now);
          start.setDate(start.getDate() - 29);
          const results = await getRangeTotals(start, 30);
          setChartData(results.map((r) => ({ label: "", value: r.total, showLabel: false })));
        } else {
          const data = [];
          for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const totals = await getMonthTotals(d.getFullYear(), d.getMonth());
            const values = Object.values(totals);
            const avg = values.length > 0 ? Math.round(values.reduce((s, v) => s + v, 0) / values.length) : 0;
            data.push({ label: SHORT_MONTHS[d.getMonth()], value: avg, showLabel: true });
          }
          setChartData(data);
        }
      };
      load();
    }, [period])
  );

  const maxValue = Math.max(...chartData.map((d) => d.value), DAILY_GOAL);
  const chartMax = Math.ceil(maxValue / 500) * 500;
  const totalSum = chartData.reduce((s, d) => s + d.value, 0);
  const daysWithData = chartData.filter((d) => d.value > 0).length;
  const average = daysWithData > 0 ? Math.round(totalSum / daysWithData) : 0;
  const daysMetGoal = chartData.filter((d) => d.value >= DAILY_GOAL).length;
  const yTicks = getYTicks(chartMax);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: colors.textPrimary, marginBottom: 16 }}>
          Stats
        </Text>

        <View style={{
          flexDirection: "row", backgroundColor: colors.surface, borderRadius: 12,
          padding: 4, marginBottom: 20, borderWidth: 1, borderColor: colors.highlight,
        }}>
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p}
              style={{
                flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10,
                ...(period === p ? { backgroundColor: colors.highlight } : {}),
              }}
              onPress={() => setPeriod(p)}
            >
              <Text style={{
                fontSize: 15, fontWeight: "600",
                color: period === p ? colors.accent : colors.textMuted,
              }}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{
          backgroundColor: colors.surface, borderRadius: 16, padding: 16,
          borderWidth: 1, borderColor: colors.highlight, marginBottom: 20,
        }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.textSecondary, marginBottom: 16 }}>
            {period === "Year" ? "Daily Average by Month" : "Daily Intake"}
          </Text>

          <View style={{ flexDirection: "row" }}>
            <View style={{ width: Y_AXIS_WIDTH, height: CHART_HEIGHT, position: "relative" }}>
              {yTicks.map((tick) => (
                <Text
                  key={tick}
                  style={{
                    position: "absolute", left: 0, fontSize: 10,
                    color: colors.textMuted, fontWeight: "500",
                    top: (1 - (tick * 1000) / chartMax) * CHART_HEIGHT - 6,
                  }}
                >
                  {`${tick}L`}
                </Text>
              ))}
            </View>

            <View style={{ flex: 1 }}>
              <View style={{ height: CHART_HEIGHT, position: "relative", overflow: "hidden" }}>
                {yTicks.map((tick) => (
                  <View
                    key={tick}
                    style={{
                      position: "absolute", left: 0, right: 0, height: 0,
                      borderTopWidth: 1, borderTopColor: colors.highlight,
                      top: (1 - (tick * 1000) / chartMax) * CHART_HEIGHT,
                    }}
                  />
                ))}
                <View
                  style={{
                    position: "absolute", left: 0, right: 0, height: 0,
                    borderTopWidth: 1.5, borderTopColor: colors.success,
                    borderStyle: "dashed", zIndex: 1,
                    top: (1 - DAILY_GOAL / chartMax) * CHART_HEIGHT,
                  }}
                />
                <View style={{ flexDirection: "row", alignItems: "flex-end", height: "100%", gap: 2 }}>
                  {chartData.map((d, i) => {
                    const barHeight = chartMax > 0 ? (d.value / chartMax) * CHART_HEIGHT : 0;
                    const metGoal = d.value >= DAILY_GOAL;
                    return (
                      <View key={i} style={{ flex: 1, alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                        <View style={{ flex: 1 }} />
                        <View
                          style={{
                            width: "70%", borderRadius: 3, minHeight: 2,
                            height: barHeight,
                            backgroundColor: metGoal ? colors.success : d.value > 0 ? colors.accent : colors.progressBarBg,
                          }}
                        />
                      </View>
                    );
                  })}
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 2, marginTop: 4 }}>
                {chartData.map((d, i) => (
                  <View key={i} style={{ flex: 1, alignItems: "center" }}>
                    {d.showLabel ? (
                      <Text style={{ fontSize: 9, color: colors.textMuted, textAlign: "center" }}>
                        {d.label}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={{
          backgroundColor: colors.surface, borderRadius: 16, padding: 16,
          borderWidth: 1, borderColor: colors.highlight, marginBottom: 30,
        }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.textPrimary, marginBottom: 12 }}>
            Summary
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 22, fontWeight: "bold", color: colors.accent }}>
                {totalSum >= 1000 ? `${(totalSum / 1000).toFixed(1)}L` : `${totalSum} ml`}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
                {period === "Year" ? "Avg total" : "Total"}
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 22, fontWeight: "bold", color: colors.accent }}>
                {average >= 1000 ? `${(average / 1000).toFixed(1)}L` : `${average} ml`}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>Daily avg</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 22, fontWeight: "bold", color: colors.success }}>
                {daysMetGoal}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>Goals met</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StatsScreen;
