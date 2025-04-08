import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Box,
  Chip,
  useMediaQuery,
  useTheme,
  Tooltip,
  Divider,
  Card
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import { setFilter, clearFilter } from "../redux/filterSlice";

// Helper function to format column headers
const formatColumnHeader = (key, isMobile = false) => {
  // Mobile-specific shorter headers
  if (isMobile) {
    if (key === "team_name") return "TEAM";
    if (key === "percentage") return "PCT";
    if (key === "games_back") return "GB";
    if (key === "Expected Rank") return "ER";
    if (key === "Expected Points") return "EP";
    if (key === "wins") return "W";
    if (key === "losses") return "L";
    if (key === "ties") return "T";
    if (key === "rank") return "R";
  }
  
  // Regular headers
  if (key === "team_name") return "TEAM";
  if (key === "games_back") return "GB";
  if (key === "Expected Rank") return "EXP RANK";
  if (key === "Expected Points") return "EXP PTS";
  if (key === "percentage") return "PCT";
  if (key === "wins") return "W";
  if (key === "losses") return "L";
  if (key === "ties") return "T";
  
  // General formatting
  return key.toUpperCase()
    .replace(/_/g, ' ');
};

// Helper function for mobile-friendly cell formatting
const formatCellValue = (value, column) => {
  if (value === null || value === undefined) return "-";
  
  // Format percentages
  if (column === "percentage") {
    const numVal = parseFloat(value);
    return isNaN(numVal) ? value : numVal.toFixed(3).toString().replace(/^0+/, '');
  }
  
  return value;
};

function CustomTable({ data, columnOrder, tabValue }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  
  const [filteredData, setFilteredData] = useState([]);
  const [orderDirection, setOrderDirection] = useState("desc");
  const [valueToOrderBy, setValueToOrderBy] = useState("rank");
  const [showFilters, setShowFilters] = useState(!isMobile);
  
  const filters = useSelector((state) => state.filters[tabValue]) || {};

  // Show all columns regardless of screen size
  const getVisibleColumns = () => {
    // Return all columns and let the user scroll horizontally if needed
    return columnOrder;
  };

  const visibleColumns = getVisibleColumns();

  useEffect(() => {
    filterData(filters);
  }, [data, filters]);

  useEffect(() => {
    // Set initial sort to rank by default
    if (data.length > 0) {
      setValueToOrderBy("rank");
      setOrderDirection("asc");
    }
  }, [data]);

  const handleRequestSort = (property) => {
    const isAsc = valueToOrderBy === property && orderDirection === "asc";
    setValueToOrderBy(property);
    setOrderDirection(isAsc ? "desc" : "asc");
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    dispatch(setFilter({ tab: tabValue, name, value }));
  };

  const clearFilterValue = (name) => {
    dispatch(clearFilter({ tab: tabValue, name }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const filterData = (filters) => {
    if (!data || data.length === 0) return;
    
    let newData = data.filter((row) =>
      Object.entries(filters).every(([key, value]) =>
        value === "" ? true : row[key]?.toString() === value
      )
    );
    
    setFilteredData(newData);
  };

  const sortData = (array) => {
    if (!valueToOrderBy || array.length === 0) return array;
    
    return [...array].sort((a, b) => {
      let first = a[valueToOrderBy];
      let second = b[valueToOrderBy];
      
      // Handle missing values
      if (first === undefined) first = "";
      if (second === undefined) second = "";
      
      // Convert to numbers if possible
      if (!isNaN(first) && !isNaN(second)) {
        first = Number(first);
        second = Number(second);
      }

      if (first < second) {
        return orderDirection === "asc" ? -1 : 1;
      }
      if (first > second) {
        return orderDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(val => val !== "").length;

  // Check if we have data to display
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1">No data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Filter Controls - Now inline with table */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          alignItems: 'center',
          mb: 0.5,
          mt: -0.5
        }}
      >
        <Tooltip title={showFilters ? "Hide Filters" : "Show Filters"}>
          <IconButton 
            size="small" 
            onClick={toggleFilters}
            color={activeFilterCount > 0 ? "primary" : "default"}
            sx={{ mr: 0.5 }}
          >
            <FilterListIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        
        {activeFilterCount > 0 && (
          <Chip 
            label={`${activeFilterCount}`} 
            size="small"
            color="primary"
            onDelete={() => Object.keys(filters).forEach(clearFilterValue)}
            sx={{ height: 20, '& .MuiChip-label': { px: 1 } }}
          />
        )}
      </Box>

      {/* Filter Grid */}
      {showFilters && Object.keys(filters).length > 0 && (
        <Card 
          variant="outlined" 
          sx={{ 
            mb: 1, 
            p: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.02)'
          }}
        >
          <Grid container spacing={2} justifyContent="flex-start">
            {Object.keys(filters).map((filterName) => (
              <Grid item key={filterName} xs={12} sm={6} md={3} lg={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>
                    {formatColumnHeader(filterName)}
                  </InputLabel>
                  <Select
                    value={filters[filterName]}
                    label={formatColumnHeader(filterName)}
                    name={filterName}
                    onChange={handleFilterChange}
                    endAdornment={
                      filters[filterName] && (
                        <IconButton 
                          size="small" 
                          onClick={() => clearFilterValue(filterName)}
                          edge="end"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      )
                    }
                  >
                    {Array.from(
                      new Set(data.map((item) => item[filterName]))
                    ).sort((a, b) => {
                      if (!isNaN(a) && !isNaN(b)) return a - b;
                      return a > b ? 1 : -1;
                    }).map((item, index) => (
                      <MenuItem key={index} value={item ? item.toString() : ""}>
                        {item || "-"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>
        </Card>
      )}

      {/* Data Table */}
      <TableContainer 
        component={Paper}
        sx={{ 
          boxShadow: 1,
          borderRadius: 1,
          overflow: 'auto',
          maxWidth: '100%'
        }}
      >
        <Table 
          size="small"
          sx={{ 
            minWidth: isMobile ? 600 : 800,
            "& .MuiTableCell-root": {
              px: isMobile ? 0.75 : 2,
              py: isMobile ? 0.5 : 1
            }
          }}
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
              {visibleColumns.map((key) => (
                <TableCell 
                  key={key}
                  sx={{
                    fontWeight: valueToOrderBy === key ? 700 : 500,
                    color: valueToOrderBy === key ? 'primary.main' : 'text.primary',
                    px: isMobile ? 0.75 : 2,
                    py: isMobile ? 0.5 : 1,
                    whiteSpace: 'nowrap',
                    // Make team_name column wider and others narrower on mobile
                    ...(isMobile && {
                      width: key === "team_name" ? "auto" : key === "percentage" ? "60px" : key === "rank" ? "40px" : "auto",
                      fontSize: "0.75rem"
                    })
                  }}
                >
                  <TableSortLabel
                    active={valueToOrderBy === key}
                    direction={valueToOrderBy === key ? orderDirection : "asc"}
                    onClick={() => handleRequestSort(key)}
                    sx={{
                      color: valueToOrderBy === key ? 'primary.main' : 'text.primary',
                      fontWeight: valueToOrderBy === key ? 700 : 500,
                      '&.MuiTableSortLabel-active': {
                        color: 'primary.main',
                      }
                    }}
                  >
                    {formatColumnHeader(key, isMobile)}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortData(filteredData).map((row, index) => (
              <TableRow 
                key={index}
                hover
                sx={{
                  '&:nth-of-type(even)': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  },
                }}
              >
                {visibleColumns.map((col) => (
                  <TableCell 
                    key={col}
                    align={col === "team_name" ? "left" : "center"}
                    sx={{
                      // Bold for team name
                      ...(col === "team_name" && {
                        fontWeight: 500,
                        minWidth: isMobile ? "90px" : "auto",
                        left: 0,
                        zIndex: 1
                      }),
                      // Bold for main stat (e.g. rank)
                      ...(col === "rank" && {
                        fontWeight: 500,
                      }),
                      // Special styling for percentage
                      ...(col === "percentage" && {
                        fontFamily: "monospace",
                      }),
                      // Smaller font for mobile
                      ...(isMobile && {
                        fontSize: "0.75rem",
                        px: 0.75,
                        py: 0.75
                      })
                    }}
                  >
                    {formatCellValue(row[col], col)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Show additional info for mobile users */}
      {isMobile && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'center', color: 'text.secondary' }}>
          Swipe horizontally to see all columns. Tap column headers to sort.
        </Typography>
      )}
    </Box>
  );
}

export default CustomTable;