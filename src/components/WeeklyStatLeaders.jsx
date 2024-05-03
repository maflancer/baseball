import { useState, useEffect } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function WeeklyStatLeaders({ data }) {
  const [filteredData, setFilteredData] = useState([]);
  const [orderDirection, setOrderDirection] = useState("asc");
  const [valueToOrderBy, setValueToOrderBy] = useState("");
  const [filter, setFilter] = useState({
    week: "",
    stat: "",
  });

  useEffect(() => {
    filterData(filter);
  });

  const handleRequestSort = (property) => {
    const isAsc = valueToOrderBy === property && orderDirection === "asc";
    setValueToOrderBy(property);
    setOrderDirection(isAsc ? "desc" : "asc");
    filterData(filter);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
    filterData({ ...filter, [name]: value });
  };

  const clearFilter = (name) => {
    setFilter((prev) => ({
      ...prev,
      [name]: "",
    }));
    filterData({ ...filter, [name]: "" });
  };

  const filterData = (filters) => {
    let newData = data.filter((row) =>
      Object.entries(filters).every(([key, value]) =>
        value === "" ? true : row[key] === value
      )
    );
    setFilteredData(newData);
  };

  const sortData = (array) => {
    return array.sort((a, b) => {
      let first = a[valueToOrderBy];
      let second = b[valueToOrderBy];
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

  const columnOrder = ["week", "teams", "val", "stat"];

  return (
    <Paper className="fullScreenPaper">
      <Grid sx={{ mt: 1 }} container spacing={2} justifyContent="center">
        {Object.keys(filter).map((filterName) => (
          <Grid item key={filterName} xs={6} sm={3}>
            <FormControl fullWidth>
              <InputLabel>
                {filterName.charAt(0).toUpperCase() + filterName.slice(1)}
              </InputLabel>
              <Select
                value={filter[filterName]}
                label={filterName.charAt(0).toUpperCase() + filterName.slice(1)}
                name={filterName}
                onChange={handleFilterChange}
                endAdornment={
                  filter[filterName] && (
                    <IconButton onClick={() => clearFilter(filterName)}>
                      <CloseIcon />
                    </IconButton>
                  )
                }
              >
                {Array.from(new Set(data.map((item) => item[filterName]))).map(
                  (item, index) => (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Grid>
        ))}
      </Grid>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {data[0] &&
                columnOrder.map((key) => (
                  <TableCell key={key}>
                    <TableSortLabel
                      active={valueToOrderBy === key}
                      direction={
                        valueToOrderBy === key ? orderDirection : "asc"
                      }
                      onClick={() => handleRequestSort(key)}
                    >
                      {key}
                    </TableSortLabel>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortData(filteredData).map((row, index) => (
              <TableRow key={index}>
                {columnOrder.map((col, idx) => (
                  <TableCell key={idx}>{row[col]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default WeeklyStatLeaders;
