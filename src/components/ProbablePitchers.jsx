import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  Divider,
  Alert,
  useTheme
} from "@mui/material";
import UpdateIcon from "@mui/icons-material/Update";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";
import { format, parse } from "date-fns";

function ProbablePitchers() {
  const theme = useTheme();
  
  const [pitcherData, setPitcherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState("All Teams");
  const [weekDates, setWeekDates] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const basePath = import.meta.env.BASE_URL;
        const response = await fetch(`${basePath}data/probable_pitchers.json`);
        
        if (!response.ok) {
          throw new Error("Failed to load pitcher data");
        }
        
        const data = await response.json();
        setPitcherData(data);
        
        // Extract unique teams from the data
        if (data.pitchers_by_date) {
          const uniqueTeams = new Set();
          Object.keys(data.pitchers_by_date).forEach(date => {
            Object.keys(data.pitchers_by_date[date] || {}).forEach(team => {
              uniqueTeams.add(team);
            });
          });
          setTeams(Array.from(uniqueTeams).sort());
        }
        
        // Extract and format dates from the data
        if (data.pitchers_by_date) {
          const dates = Object.keys(data.pitchers_by_date).sort();
          if (dates.length > 0) {
            setWeekDates(dates);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error("Error loading pitcher data:", err);
        setError(`Failed to load pitcher data. ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };
  
  // Format date for display
  const formatDateForDisplay = (dateString) => {
    try {
      const date = parse(dateString, "yyyy-MM-dd", new Date());
      return format(date, "EEE, MMM d");
    } catch (err) {
      console.error("Error formatting date:", err);
      return dateString;
    }
  };
  
  // Determine if a date is today
  const isToday = (dateString) => {
    const today = format(new Date(), "yyyy-MM-dd");
    return dateString === today;
  };
  
  // Get filtered pitchers for the selected team
  const getFilteredPitchers = () => {
    if (!pitcherData || !pitcherData.pitchers_by_date) return {};
    
    if (selectedTeam === "All Teams") {
      return pitcherData.pitchers_by_date;
    }
    
    const filtered = {};
    Object.keys(pitcherData.pitchers_by_date).forEach(date => {
      if (pitcherData.pitchers_by_date[date][selectedTeam]) {
        filtered[date] = {
          [selectedTeam]: pitcherData.pitchers_by_date[date][selectedTeam]
        };
      } else {
        filtered[date] = {};
      }
    });
    
    return filtered;
  };
  
  // Get the date when data was last updated
  const getLastUpdated = () => {
    if (pitcherData && pitcherData.date_pulled) {
      return pitcherData.date_pulled;
    }
    return "Unknown";
  };
  
  const filteredPitchers = getFilteredPitchers();
  
  return (
    <Box sx={{ width: "100%" }}>
      {/* Header with controls */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 2, 
          mb: 3, 
          backgroundColor: "#f8f9fa",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2
        }}
      >
        {/* Team filter */}
        <FormControl size="small" sx={{ minWidth: 200, flexGrow: 1, maxWidth: 300 }}>
          <Select
            value={selectedTeam}
            onChange={handleTeamChange}
            displayEmpty
            sx={{ 
              backgroundColor: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(0, 0, 0, 0.23)"
              }
            }}
          >
            <MenuItem value="All Teams">All Teams</MenuItem>
            {teams.map((team) => (
              <MenuItem key={team} value={team}>
                {team}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {/* Last updated info */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <UpdateIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">
            Last updated from MLB.com: {getLastUpdated()}
          </Typography>
        </Box>
      </Paper>
      
      {/* Error display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Loading state */}
      {isLoading ? (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography>Loading pitchers data...</Typography>
        </Box>
      ) : (
        <>
          {/* Compact Calendar View */}
          <Grid container spacing={1.5}>
            {weekDates.map((date) => (
              <Grid item xs={12} sm={6} md={4} key={date}>
                <Card 
                  elevation={isToday(date) ? 3 : 1}
                  sx={{
                    position: "relative",
                    ...(isToday(date) && {
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                    }),
                  }}
                >
                  {/* Date header */}
                  <Box
                    sx={{
                      py: 1,
                      px: 1.5,
                      backgroundColor: isToday(date) ? "primary.light" : "grey.100",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2" fontWeight={isToday(date) ? "bold" : "medium"}>
                      {formatDateForDisplay(date)}
                      {isToday(date) && (
                        <Chip
                          label="Today"
                          size="small"
                          color="primary"
                          sx={{ ml: 1, height: "20px", fontSize: "0.7rem" }}
                        />
                      )}
                    </Typography>
                  </Box>
                  
                  <CardContent sx={{ p: 0 }}>
                    {Object.keys(filteredPitchers[date] || {}).length > 0 ? (
                      <>
                        {Object.keys(filteredPitchers[date] || {})
                          .sort()
                          .map((team, idx) => (
                            <Box key={`${date}-${team}`}>
                              {idx > 0 && <Divider />}
                              <Box sx={{ px: 1.5, py: 1 }}>
                                <Typography variant="body2" fontWeight="bold" gutterBottom>
                                  {team}
                                </Typography>
                                <Box sx={{ pl: 1 }}>
                                  {filteredPitchers[date][team].map((pitcher, pidx) => (
                                    <Box
                                      key={`pitcher-${pidx}`}
                                      sx={{
                                        mb: pitcher.record ? 0.5 : 0.3,
                                        "&:last-child": { mb: 0 },
                                      }}
                                    >
                                      <Typography 
                                        variant="body2" 
                                        sx={{ 
                                          fontWeight: "medium", 
                                          lineHeight: 1.2,
                                          fontSize: "0.875rem"
                                        }}
                                      >
                                        {pitcher.title.split(" (")[0]}
                                        <Typography 
                                          component="span" 
                                          variant="caption" 
                                          color="text.secondary"
                                          sx={{ ml: 0.5 }}
                                        >
                                          ({pitcher.throws})
                                        </Typography>
                                      </Typography>
                                      {pitcher.record && (
                                        <Typography 
                                          variant="caption" 
                                          color="text.secondary" 
                                          sx={{ 
                                            display: "block",
                                            fontSize: "0.75rem",
                                            lineHeight: 1.2 
                                          }}
                                        >
                                          {pitcher.record} • ERA: {pitcher.era} • K: {pitcher.strikeouts}
                                        </Typography>
                                      )}
                                    </Box>
                                  ))}
                                </Box>
                              </Box>
                            </Box>
                          ))}
                      </>
                    ) : (
                      <Box sx={{ p: 1.5, textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          No pitchers scheduled for {selectedTeam === "All Teams" ? "any teams" : selectedTeam}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* No data message */}
          {weekDates.length === 0 && !isLoading && (
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography>No pitcher data available.</Typography>
            </Paper>
          )}
        </>
      )}
      
      {/* Disclaimer footer */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">
          This site is not affiliated with Major League Baseball. Game statistics and information are displayed for fantasy baseball purposes only.
        </Typography>
      </Box>
    </Box>
  );
}

export default ProbablePitchers;