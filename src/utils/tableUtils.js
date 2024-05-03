export const sortData = (data, valueToOrderBy, orderDirection) => {
  return data.sort((a, b) => {
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
