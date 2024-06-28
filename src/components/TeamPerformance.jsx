import React, { useMemo } from "react";
import Plot from "react-plotly.js";

const TeamPerformance = ({ data }) => {
  const { traces, layout } = useMemo(() => {
    if (!data || data.length === 0) return { traces: [], layout: {} };

    const totalExpectedPoints = data.reduce(
      (sum, row) => sum + parseFloat(row["Expected Points"]),
      0
    );

    const scatterTraces = data.map((row) => {
      const expectedPointsRatio =
        parseFloat(row["Expected Points"]) / totalExpectedPoints;
      const winPercentage = parseFloat(row["percentage"]);

      return {
        x: [expectedPointsRatio],
        y: [winPercentage],
        mode: "markers",
        marker: {
          symbol: "square",
          size: 20,
          color: "transparent",
        },
        hoverinfo: "text",
        hovertext:
          `Team: ${row["team_name"]}<br>` +
          `Expected Points: ${parseFloat(row["Expected Points"]).toFixed(
            2
          )}<br>` +
          `Win Percentage: ${winPercentage.toFixed(2)}<br>` +
          `Expected Points Ratio: ${expectedPointsRatio.toFixed(4)}`,
        showlegend: false,
      };
    });

    const annotations = data.map((row) => {
      const expectedPointsRatio =
        parseFloat(row["Expected Points"]) / totalExpectedPoints;
      const winPercentage = parseFloat(row["percentage"]);
      const textLength = row["team_name"].length;
      const rectWidth = textLength * 6;
      const rectHeight = 20;

      return {
        x: expectedPointsRatio,
        y: winPercentage,
        text: row["team_name"],
        font: { size: 10 },
        showarrow: false,
        align: "center",
        valign: "middle",
        xanchor: "center",
        yanchor: "middle",
        bgcolor: "lightblue",
        bordercolor: "black",
        borderwidth: 2,
        width: rectWidth,
        height: rectHeight,
      };
    });

    const xValues = data.map(
      (row) => parseFloat(row["Expected Points"]) / totalExpectedPoints
    );
    const yValues = data.map((row) => parseFloat(row["percentage"]));
    const xRange = [Math.min(...xValues), Math.max(...xValues)];
    const yRange = [Math.min(...yValues), Math.max(...yValues)];

    const diagonalLine = {
      x: xRange,
      y: yRange,
      mode: "lines",
      line: { dash: "dash", color: "grey" },
      showlegend: false,
    };

    return {
      traces: [...scatterTraces, diagonalLine],
      layout: {
        title: "Team Performance: Expected Points Ratio vs. Win Percentage",
        xaxis: {
          title: "Expected Points / Total Expected Points",
          range: [xRange[0] * 0.95, xRange[1] * 1.05],
        },
        yaxis: {
          title: "Win Percentage",
          range: [yRange[0] * 0.95, yRange[1] * 1.05],
        },
        hovermode: "closest",
        annotations: annotations,
        autosize: true,
      },
    };
  }, [data]);

  return (
    <Plot
      data={traces}
      layout={layout}
      useResizeHandler={true}
      style={{ width: "100%", height: "600px" }}
    />
  );
};

export default TeamPerformance;
