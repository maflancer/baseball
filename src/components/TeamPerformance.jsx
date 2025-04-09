import React, { useMemo, useState } from "react";
import Plot from "react-plotly.js";
import { Box, Typography, Paper, useTheme, useMediaQuery } from "@mui/material";

const TeamPerformance = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isExplanationVisible, setIsExplanationVisible] = useState(true);

  const { traces, layout } = useMemo(() => {
    if (!data || data.length === 0) return { traces: [], layout: {} };

    // Calculate total expected points for ratio calculation
    const totalExpectedPoints = data.reduce(
      (sum, row) => sum + parseFloat(row["Expected Points"]),
      0
    );

    // Prepare data points
    const xValues = data.map(
      (row) => parseFloat(row["Expected Points"]) / totalExpectedPoints
    );
    const yValues = data.map((row) => parseFloat(row["percentage"]));
    
    // Get range for axes
    const xRange = [Math.min(...xValues), Math.max(...xValues)];
    const yRange = [Math.min(...yValues), Math.max(...yValues)];
    
    // Implement a proper linear regression line
    // Using the formula: y = mx + b
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    const n = xValues.length;
    
    for (let i = 0; i < n; i++) {
      sumX += xValues[i];
      sumY += yValues[i];
      sumXY += xValues[i] * yValues[i];
      sumXX += xValues[i] * xValues[i];
    }
    
    // Calculate slope (m) and y-intercept (b) for y = mx + b
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Create points for the regression line
    const regressionX = [xRange[0], xRange[1]];
    const regressionY = [slope * xRange[0] + intercept, slope * xRange[1] + intercept];
    
    // Add regression line 
    const lineTrace = {
      x: regressionX,
      y: regressionY,
      mode: "lines",
      line: { 
        dash: "dash", 
        color: "rgba(128, 128, 128, 0.6)",
        width: 2
      },
      name: "Expected Trend (Regression)",
      hoverinfo: "skip"
    };

    // Create team markers
    const scatterTrace = {
      x: xValues,
      y: yValues,
      mode: "markers",
      marker: {
        symbol: "circle",
        size: 12,
        color: "#3f51b5",
        opacity: 0.85,
        line: {
          color: "#000",
          width: 1
        }
      },
      text: data.map(row => row["team_name"]),
      hoverinfo: "text",
      hovertext: data.map((row, idx) => {
        const expectedPointsRatio = xValues[idx];
        const winPercentage = yValues[idx];
        const expectedWinPct = slope * expectedPointsRatio + intercept;
        const performanceDiff = winPercentage - expectedWinPct;
        
        return `<b>${row["team_name"]}</b><br>` +
               `Win-Loss: ${row["wins"]}-${row["losses"]}${row["ties"] > 0 ? `-${row["ties"]}` : ''}<br>` +
               `Win %: ${(winPercentage * 100).toFixed(1)}%<br>` +
               `Expected Points: ${parseFloat(row["Expected Points"]).toFixed(1)}<br>` +
               `Expected Points Share: ${(expectedPointsRatio * 100).toFixed(1)}%<br>` +
               `Performance vs Expected: ${(performanceDiff * 100).toFixed(1)}%`;
      }),
      name: "Teams",
      showlegend: true
    };

    // Create text labels for each team
    const annotations = data.map((row, index) => {
      const expectedPointsRatio = xValues[index];
      const winPercentage = yValues[index];
      
      return {
        x: expectedPointsRatio,
        y: winPercentage,
        text: row["team_name"],
        font: { 
          size: 10,
          color: "#fff",
          family: '"Roboto", "Helvetica", "Arial", sans-serif'
        },
        showarrow: false,
        yshift: -20,
        bgcolor: "rgba(0, 0, 0, 0.7)",
        borderpad: 3,
        borderwidth: 0,
        borderradius: 3
      };
    });

    return {
      traces: [lineTrace, scatterTrace],
      layout: {
        title: "Team Performance vs. Expected Points",
        xaxis: {
          title: "Expected Points Share",
          tickformat: ".1%",
          range: [xRange[0] * 0.9, xRange[1] * 1.1],
          gridcolor: 'rgba(0,0,0,0.05)',
          gridwidth: 0.5,
          showgrid: true, 
          zeroline: false
        },
        yaxis: {
          title: "Win Percentage",
          tickformat: ".0%",
          range: [yRange[0] * 0.9, yRange[1] * 1.1],
          gridcolor: 'rgba(0,0,0,0.05)', 
          gridwidth: 0.5
        },
        hovermode: "closest",
        annotations: [...annotations],
        autosize: true,
        paper_bgcolor: 'white',
        plot_bgcolor: 'white',
        font: {
          family: '"Roboto", "Helvetica", "Arial", sans-serif'
        },
        legend: {
          orientation: "h",
          yanchor: "bottom",
          y: -0.2,
          xanchor: "center", 
          x: 0.5
        },
        margin: {
          l: 60,
          r: 30,
          t: 60, 
          b: 60,
          pad: 4
        }
      },
    };
  }, [data]);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: '#f8f9fa' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            About This Chart
          </Typography>
          <Box 
            component="button" 
            onClick={() => setIsExplanationVisible(!isExplanationVisible)}
            sx={{ 
              border: 'none', 
              background: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: 'primary.main',
              fontSize: '0.875rem',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            {isExplanationVisible ? 'Hide Details' : 'Show Details'}
          </Box>
        </Box>
        <Box sx={{ display: isExplanationVisible ? 'block' : 'none' }}>
          <Typography variant="body2" paragraph>
            This chart visualizes the relationship between a team's Expected Points and their actual performance. 
            Expected Points is calculated by awarding points based on weekly stat rankings: 14 points for 1st place down to 1 point for 14th place in a 14-team league. 
            Teams tied for positions receive the average of their positions (e.g., teams tied for 1st-2nd each get 13.5 points).
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            How to interpret this chart:
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • The x-axis shows each team's share of the total Expected Points
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • The y-axis shows each team's actual win percentage
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • The dashed line shows the expected relationship (regression line) between Expected Points and win percentage
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • Teams above the regression line are over-performing their Expected Points (lucky)
          </Typography>
          <Typography variant="body2">
            • Teams below the regression line are under-performing their Expected Points (unlucky)
          </Typography>
        </Box>
      </Paper>
      
      <Paper elevation={2} sx={{ p: 0, overflow: 'hidden' }}>
        <Plot
          data={traces}
          layout={layout}
          useResizeHandler={true}
          style={{ 
            width: "100%", 
            height: isMobile ? "400px" : "600px" 
          }}
          config={{
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['lasso2d', 'select2d']
          }}
        />
      </Paper>
      
      {/* Mobile help text */}
      {isMobile && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'center', color: 'text.secondary' }}>
          Tip: Turn your device to landscape for a better view of the graph.
        </Typography>
      )}
    </Box>
  );
};

export default TeamPerformance;