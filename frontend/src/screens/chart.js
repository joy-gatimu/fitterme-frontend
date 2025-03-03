import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const ProgressChart = ({ data }) => {
  const labels = data.map((entry) => entry.date);
  const values = data.map((entry) => entry.weight);

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
        Weight Progress Over Time
      </Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [{ data: values }],
        }}
        width={screenWidth - 32} // Adjust width
        height={220}
        yAxisSuffix=" kg"
        chartConfig={{
          backgroundColor: "#f5f5f5",
          backgroundGradientFrom: "#4CAF50",
          backgroundGradientTo: "#81C784",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16 },
          propsForDots: { r: "6", strokeWidth: "2", stroke: "#388E3C" },
        }}
        bezier
        style={{ borderRadius: 16 }}
      />
    </View>
  );
};

export default ProgressChart;
