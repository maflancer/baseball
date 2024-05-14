import CustomTable from "./CustomTable";

function WeeklyStatLeaders({ data }) {
  const columnOrder = ["week", "teams", "val", "stat"];

  const filters = {
    week: "",
    stat: "",
  };

  return (
    <CustomTable data={data} filters={filters} columnOrder={columnOrder} />
  );
}

export default WeeklyStatLeaders;
