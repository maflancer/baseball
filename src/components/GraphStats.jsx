import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid,
  OutlinedInput,
  Checkbox,
} from "@mui/material";

function GraphStats({ data }) {
  const [selectedStat, setSelectedStat] = useState("R");
  const [selectedTeams, setSelectedTeams] = useState(["ALL"]);
  const [plotData, setPlotData] = useState([]);

  const stats = [
    "R",
    "HR",
    "RBI",
    "SB",
    "TB",
    "AVG",
    "OBP",
    "IP",
    "K",
    "ERA",
    "WHIP",
    "SV",
  ];
  const teamNames = [...new Set(data.map((item) => item.team_name))];

  useEffect(() => {
    if (data.length > 0) {
      const filteredTeams = selectedTeams.includes("ALL")
        ? teamNames
        : selectedTeams;
      const traceData = filteredTeams.map((team) => ({
        type: "scatter",
        mode: "lines+markers",
        name: team,
        x: data
          .filter((item) => item.team_name === team)
          .map((item) => item.week),
        y: data
          .filter((item) => item.team_name === team)
          .map((item) => item[selectedStat]),
        line: { shape: "linear" },
      }));
      setPlotData(traceData);
    }
  }, [data, selectedStat, selectedTeams]);

  const handleStatChange = (event) => {
    setSelectedStat(event.target.value);
  };

  const handleTeamChange = (event) => {
    const {
      target: { value },
    } = event;
    if (value[value.length - 1] === "ALL" || value.length === 0) {
      setSelectedTeams(["ALL"]);
    } else if (value.includes("ALL")) {
      setSelectedTeams(value.filter((item) => item !== "ALL"));
    } else {
      setSelectedTeams(value);
    }
  };

  return (
    <div style={{ backgroundColor: "white", padding: "20px" }}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          <Typography variant="h6" color={"black"}>
            Please select a stat to graph:
          </Typography>
        </Grid>
        <Grid item>
          <Box width={200}>
            <FormControl fullWidth>
              <InputLabel id="stat-select-label">Select Stat</InputLabel>
              <Select
                size="small"
                labelId="stat-select-label"
                id="stat-select"
                value={selectedStat}
                label="Select Stat"
                onChange={handleStatChange}
              >
                {stats.map((stat, index) => (
                  <MenuItem key={index} value={stat}>
                    {stat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
      <Grid container alignItems="center" spacing={2} sx={{ mt: 2, mb: 2 }}>
        <Grid item>
          <Typography variant="h6" color={"black"}>
            Please select teams to compare:
          </Typography>
        </Grid>
        <Grid item xs>
          <Box width={200}>
            <FormControl fullWidth>
              <InputLabel id="team-select-label">Select Teams</InputLabel>
              <Select
                size="small"
                labelId="team-select-label"
                id="team-select"
                multiple
                value={selectedTeams}
                onChange={handleTeamChange}
                input={<OutlinedInput label="Select Teams" />}
                renderValue={(selected) => selected.join(", ")}
              >
                <MenuItem value="ALL">
                  <Checkbox checked={selectedTeams.includes("ALL")} />
                  All Teams
                </MenuItem>
                {teamNames.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={selectedTeams.includes(name)} />
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
      <Plot
        data={plotData}
        layout={{
          title: `Weekly Trends for ${selectedStat} Across Teams`,
          xaxis: { title: "Week", tickmode: "linear", tick0: 1, dtick: 1 },
          yaxis: { title: selectedStat },
          margin: { t: 60 },
          autosize: true,
        }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

export default GraphStats;
