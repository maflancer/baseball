import { useState, useEffect } from "react";
import "./App.css";
import * as d3 from "d3";
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Toolbar,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import WeeklyStatLeaders from "./components/WeeklyStatLeaders";
import TeamStats from "./components/TeamStats";
import GraphStats from "./components/GraphStats";

function App() {
  const [year, setYear] = useState(2024);
  const [weeklyData, setWeeklyData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const basePath = import.meta.env.BASE_URL;
    const yearSuffix = year === 2024 ? "2024" : "2023";

    d3.csv(`${basePath}data/leaders_${yearSuffix}.csv`)
      .then((data) => {
        setWeeklyData(data);
      })
      .catch((err) => console.error("Error loading or parsing CSV:", err));
  }, [year]);

  useEffect(() => {
    const basePath = import.meta.env.BASE_URL;
    const yearSuffix = year === 2024 ? "2024" : "2023";

    d3.csv(`${basePath}data/stats_${yearSuffix}.csv`)
      .then((data) => {
        setTeamData(data);
      })
      .catch((err) => console.error("Error loading or parsing CSV:", err));
  }, [year]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 2 }}>
            <Select
              value={year}
              onChange={handleYearChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              size="small"
              sx={{ color: "white", borderBottom: "none" }}
            >
              <MenuItem value={2024}>Errors of Ersen (2024)</MenuItem>
              <MenuItem value={2023}>Womanfred's World (2023)</MenuItem>
            </Select>
          </Typography>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{
              ".Mui-selected": {
                outline: "none",
              },
            }}
          >
            <Tab label="Weekly Stat Leaders" />
            <Tab label="Team Stats" />
            <Tab label="Team Stat Trends" />
          </Tabs>
        </Toolbar>
      </AppBar>
      <Box sx={{ backgroundColor: "white" }}>
        <Typography color={"black"}>
          *normal weeks are 7 days. week 1 is 10 days and week 15 (all star
          break) is 14 days
        </Typography>
      </Box>
      {tabValue === 0 && <WeeklyStatLeaders data={weeklyData} year={year} />}
      {tabValue === 1 && <TeamStats data={teamData} year={year} />}
      {tabValue === 2 && <GraphStats data={teamData} year={year} />}
    </Box>
  );
}

export default App;
