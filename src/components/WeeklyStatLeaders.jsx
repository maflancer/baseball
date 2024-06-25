import CustomTable from "./CustomTable";

function WeeklyStatLeaders({ data, tabValue }) {
  const columnOrder = ["week", "teams", "val", "stat"];

  return (
    <CustomTable data={data} tabValue={tabValue} columnOrder={columnOrder} />
  );
}

export default WeeklyStatLeaders;
