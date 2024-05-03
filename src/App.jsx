import { useState, useEffect } from "react";
import "./App.css";
import * as d3 from "d3";
import { AppBar, Tabs, Tab, Box, Toolbar, Typography } from "@mui/material";
import WeeklyStatLeaders from "./components/WeeklyStatLeaders";
import TeamStats from "./components/TeamStats";
import GraphStats from "./components/GraphStats";

function App() {
  const [weeklyData, setWeeklyData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    d3.csv("/data/leaders_2024.csv")
      .then((data) => {
        setWeeklyData(data);
      })
      .catch((err) => console.error("Error loading or parsing CSV:", err));
  }, []);

  useEffect(() => {
    d3.csv("/data/stats_2024.csv")
      .then((data) => {
        setTeamData(data);
      })
      .catch((err) => console.error("Error loading or parsing CSV:", err));
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 2 }}>
            The Errors of Ersen
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
      {tabValue === 0 && <WeeklyStatLeaders data={weeklyData} />}
      {tabValue === 1 && <TeamStats data={teamData} />}
      {tabValue === 2 && <GraphStats data={teamData} />}
    </Box>
  );
}

export default App;
