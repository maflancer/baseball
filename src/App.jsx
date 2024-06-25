import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setYear } from "./redux/yearSlice";
import { setTab } from "./redux/tabSlice";
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
import Standings from "./components/Standings";

function App() {
  const dispatch = useDispatch();
  const year = useSelector((state) => state.year);
  const tabValue = useSelector((state) => state.tab);
  const [weeklyData, setWeeklyData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [standingsData, setStandingsData] = useState([]);

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

  useEffect(() => {
    const basePath = import.meta.env.BASE_URL;
    const yearSuffix = year === 2024 ? "2024" : "2023";

    d3.csv(`${basePath}data/standings_${yearSuffix}.csv`)
      .then((data) => {
        setStandingsData(data);
      })
      .catch((err) => console.error("Error loading or parsing CSV:", err));
  }, [year]);

  const handleTabChange = (event, newValue) => {
    dispatch(setTab(newValue));
  };

  const handleYearChange = (event) => {
    dispatch(setYear(event.target.value));
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
              <MenuItem value={2023}>Womanfred&apos;s World (2023)</MenuItem>
            </Select>
          </Typography>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              ".Mui-selected": {
                outline: "none",
              },
            }}
          >
            <Tab label="Standings" />
            <Tab label="Weekly Stat Leaders" />
            <Tab label="Team Stats" />
            <Tab label="Team Stat Trends" />
          </Tabs>
        </Toolbar>
      </AppBar>
      <Box sx={{ backgroundColor: "white" }}>
        {tabValue > 0 ? (
          <Typography color={"black"}>
            *normal weeks are 7 days. Week 1 is 10 days and week 15 (all star
            break) is 14 days.
          </Typography>
        ) : (
          <Typography color={"black"}>
            *EXPECTED POINTS: Points are awarded weekly for each stat category
            based on overall rankings. 1st place gets 14 points, decreasing to 1
            point for last place (14-team league). For tiebreakers, the tied
            teams get the average of the points for thier ranks. (e.g., 1st and
            2nd get 13.5 each).
          </Typography>
        )}
      </Box>
      {tabValue === 0 && <Standings data={standingsData} tabValue={tabValue} />}
      {tabValue === 1 && (
        <WeeklyStatLeaders data={weeklyData} tabValue={tabValue} />
      )}
      {tabValue === 2 && <TeamStats data={teamData} tabValue={tabValue} />}
      {tabValue === 3 && <GraphStats data={teamData} />}
    </Box>
  );
}

export default App;
