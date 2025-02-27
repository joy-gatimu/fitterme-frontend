import React, { useEffect, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProgressScreen = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchProgressData = async () => {
      let storedData = await AsyncStorage.getItem("progressData");
      let progressData = storedData ? JSON.parse(storedData) : [];
  
      let labels = progressData.map((item) => item.date);
      let data = progressData.map((item) => item.calories);
  
      setChartData({ labels, data });
    };
  
    fetchProgressData();
  }, []);
  
  

  return (
    <View>
      <Text style={{ textAlign: "center", fontSize: 18, marginBottom: 10 }}>
        Calorie Burn Progress
      </Text>

      <LineChart
        data={{ labels: chartData.labels, datasets: [{ data: chartData.data }] }}
        width={Dimensions.get("window").width - 40}
        height={220}
        yAxisSuffix=" cal"
        chartConfig={{ backgroundGradientFrom: "#ff9966", backgroundGradientTo: "#ff3300" }}
        bezier
      />
    </View>
  );
};

export default ProgressScreen;
