import { Box } from "@mui/material";
import CustomTable from "./CustomTable";

function Standings({ data, tabValue }) {
  // Define column order with flexibility for responsive design
  const columnOrder = [
    "team_name",     // Always show team name
    "rank",          // Always show rank
    "percentage",    // Always show win percentage
    "Expected Rank", // Hide on mobile
    "Expected Points", // Hide on mobile
    "wins",          // Show on all screens
    "losses",        // Show on all screens
    "ties",          // Hide on smaller screens
    "games_back",    // Hide on smaller screens
  ];

  // Set up filters specific to the standings view
  const standingsFilters = {
    team_name: "",  // Filter by team name
  };

  return (
    <Box sx={{ width: '100%' }}>
      <CustomTable 
        data={data} 
        tabValue={tabValue} 
        columnOrder={columnOrder} 
        initialFilters={standingsFilters}
      />
    </Box>
  );
}

export default Standings;