import React from "react";
import { Chart } from "react-google-charts";
export const data = [
  ["Year", "Sales"],
  ["2013", 1000],
  ["2014", 1170],
  ["2015", 660],
  ["2016", 1030],
  ["2017", 130],
  ["2018", 100],
  ["2018", 1300],
];
export const options = {
  title: "Company Performance",
  hAxis: { title: "Year", titleTextStyle: { color: "#333" } },
  vAxis: { minValue: 0 },
  chartArea: { width: "80%", height: "70%" },
};

function HomeSaleChart() {
  return (
    <div>
      <Chart
        chartType="AreaChart"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
    </div>
  );
}

export default HomeSaleChart;
