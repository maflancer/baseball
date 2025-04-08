import { Box } from "@mui/material";
import CustomTable from "./CustomTable";

function Standings({ data, tabValue }) {
  // Define column order with flexibility for responsive design
  const columnOrder = [
    "team_name",     
    "rank",          
    "percentage",    
    "Expected Rank", 
    "Expected Points", 
    "wins",          
    "losses",        
    "ties",          
    "games_back",    
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