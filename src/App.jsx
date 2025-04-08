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
  Container,
  Paper,
  Tooltip,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  Alert,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Button,
  Skeleton,
  SwipeableDrawer,
  Fab
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import MenuIcon from "@mui/icons-material/Menu";
import TableChartIcon from "@mui/icons-material/TableChart";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import CloseIcon from "@mui/icons-material/Close";
import WeeklyStatLeaders from "./components/WeeklyStatLeaders";
import TeamStats from "./components/TeamStats";
import GraphStats from "./components/GraphStats";
import Standings from "./components/Standings";
import TeamPerformance from "./components/TeamPerformance";

function App() {
  const dispatch = useDispatch();
  const year = useSelector((state) => state.year);
  const tabValue = useSelector((state) => state.tab);
  const [weeklyData, setWeeklyData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [standingsData, setStandingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showInfoBanner, setShowInfoBanner] = useState(true);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const basePath = import.meta.env.BASE_URL;
      const yearSuffix = year === 2025 ? "2025" : year === 2024 ? "2024" : "2023";

      try {
        // Load data in parallel for better performance
        const [weeklyResult, teamResult, standingsResult] = await Promise.all([
          d3.csv(`${basePath}data/leaders_${yearSuffix}.csv`),
          d3.csv(`${basePath}data/stats_${yearSuffix}.csv`),
          d3.csv(`${basePath}data/standings_${yearSuffix}.csv`)
        ]);
        
        setWeeklyData(weeklyResult);
        setTeamData(teamResult);
        setStandingsData(standingsResult);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [year]);

  const handleTabChange = (event, newValue) => {
    dispatch(setTab(newValue));
    // Close mobile drawer if open
    if (mobileOpen) setMobileOpen(false);
  };

  const handleYearChange = (event) => {
    dispatch(setYear(event.target.value));
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Get league season name based on year
  const getLeagueName = () => {
    switch (year) {
      case 2025:
        return "📚 Page 199 (2025)";
      case 2024:
        return "Errors of Ersen (2024)";
      case 2023:
        return "Womanfred's World (2023)";
      default:
        return "Fantasy League";
    }
  };

  // Get tab icon based on index
  const getTabIcon = (index) => {
    switch (index) {
      case 0:
        return <TableChartIcon />;
      case 1:
        return <EmojiEventsIcon />;
      case 2:
        return <AssessmentIcon />;
      case 3:
        return <ShowChartIcon />;
      case 4:
        return <EqualizerIcon />;
      default:
        return <TableChartIcon />;
    }
  };

  // Get tab labels
  const getTabLabels = () => [
    "Standings",
    "Weekly Leaders",
    "Team Stats",
    "Stat Trends", 
    "Performance"
  ];

  // Get info text based on active tab
  const getInfoText = () => {
    if (tabValue === 0 || tabValue === 4) {
      return "*EXPECTED POINTS: Weekly stat rankings award points: 14 for 1st place down to 1 for 14th (14-team league). Tied teams receive the average of their positions (e.g., teams tied for 1st-2nd each get 13.5 points)";
    } else if (tabValue === 1 || tabValue === 2 || tabValue === 3) {
      return "*Normal weeks are 7 days. Week 1 is 10 days and week 15 (all star break) is 14 days.";
    }
    return null;
  };
  
  // Navigation drawer for mobile screens
  const drawer = (
    <Box sx={{ width: 250, pt: 1 }}>
      <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
          Navigation
        </Typography>
        <IconButton size="small" onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {getTabLabels().map((text, index) => (
          <ListItem 
            key={text} 
            disablePadding
            selected={tabValue === index}
          >
            <ListItemButton 
              onClick={() => handleTabChange(null, index)}
              sx={{
                px: 3,
                py: 1.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {getTabIcon(index)}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Season:
        </Typography>
        <Select
          value={year}
          onChange={handleYearChange}
          size="small"
          fullWidth
          sx={{ mt: 1 }}
        >
          <MenuItem value={2025}>📚 Page 199 (2025)</MenuItem>
          <MenuItem value={2024}>Errors of Ersen (2024)</MenuItem>
          <MenuItem value={2023}>Womanfred's World (2023)</MenuItem>
        </Select>
      </Box>
    </Box>
  );

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      {/* Mobile navigation drawer */}
      {isMobile && (
        <SwipeableDrawer
          variant="temporary"
          open={mobileOpen}
          onOpen={() => setMobileOpen(true)}
          onClose={() => setMobileOpen(false)}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box' },
          }}
        >
          {drawer}
        </SwipeableDrawer>
      )}

      {/* App Bar */}
      <AppBar 
        position="sticky" 
        elevation={3}
        sx={{ 
          background: 'linear-gradient(to right, #1976d2, #1565c0)'
        }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* League year selector */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mr: 2,
            flexGrow: isMobile ? 1 : 0
          }}>
            {!isMobile && (
              <Select
                value={year}
                onChange={handleYearChange}
                size="small"
                sx={{ 
                  color: 'white', 
                  '.MuiOutlinedInput-notchedOutline': { 
                    borderColor: 'rgba(255, 255, 255, 0.3)' 
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': { 
                    borderColor: 'rgba(255, 255, 255, 0.5)' 
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                    borderColor: 'white' 
                  },
                  '.MuiSelect-icon': { 
                    color: 'white' 
                  },
                  minWidth: '180px'
                }}
              >
                <MenuItem value={2025}>📚 Page 199 (2025)</MenuItem>
                <MenuItem value={2024}>Errors of Ersen (2024)</MenuItem>
                <MenuItem value={2023}>Womanfred's World (2023)</MenuItem>
              </Select>
            )}
            
            {/* Mobile: Show current league name */}
            {isMobile && (
              <Typography variant="subtitle1" noWrap sx={{ fontWeight: 500 }}>
                {getLeagueName()}
              </Typography>
            )}
          </Box>

          {/* Desktop tabs */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, overflowX: 'auto' }}>
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
                    fontWeight: "bold",
                    outline: "none",
                  },
                  "& .MuiTab-root": {
                    minWidth: '140px',
                  },
                }}
              >
                {getTabLabels().map((label, index) => (
                  <Tab 
                    key={index}
                    label={label} 
                    icon={getTabIcon(index)} 
                    iconPosition="start"
                  />
                ))}
              </Tabs>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Info text banner - Now dismissable */}
      {getInfoText() && showInfoBanner && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 1, 
            mb: 1, 
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #e0e0e0',
            borderRadius: 0,
            position: 'relative'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            justifyContent: 'center',
            gap: 1,
            maxWidth: '900px',
            mx: 'auto',
            pr: 4,
            pl: 2
          }}>
            <InfoIcon color="info" fontSize="small" sx={{ mt: 0.25, flexShrink: 0 }} />
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                fontStyle: 'italic',
                textAlign: 'left',
                fontSize: isMobile ? '0.65rem' : '0.75rem'
              }}
            >
              {getInfoText()}
            </Typography>
            <IconButton 
              size="small" 
              sx={{ 
                position: 'absolute', 
                right: 4, 
                top: '50%', 
                transform: 'translateY(-50%)',
                padding: 0.5
              }}
              onClick={() => setShowInfoBanner(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      )}

      {/* Main content */}
      <Container 
        maxWidth="xl" 
        sx={{ 
          flexGrow: 1, 
          py: 2,
          px: isMobile ? 1 : 2,
        }}
      >
        <Paper 
          elevation={2} 
          sx={{ 
            p: isMobile ? 1 : 2, 
            height: '100%',
            overflow: 'hidden'
          }}
        >
          {loading ? (
            <Box sx={{ p: 4 }}>
              <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={400} />
            </Box>
          ) : (
            <>
              {tabValue === 0 && <Standings data={standingsData} tabValue={tabValue} />}
              {tabValue === 1 && <WeeklyStatLeaders data={weeklyData} tabValue={tabValue} />}
              {tabValue === 2 && <TeamStats data={teamData} tabValue={tabValue} />}
              {tabValue === 3 && <GraphStats data={teamData} />}
              {tabValue === 4 && <TeamPerformance data={standingsData} />}
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default App;