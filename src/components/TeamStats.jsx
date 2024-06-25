import CustomTable from "./CustomTable";

function TeamStats({ data, tabValue }) {
  const columnOrder = [
    "week",
    "team_name",
    "R",
    "HR",
    "RBI",
    "SB",
    "TB",
    "AVG",
    "OBP",
    "IP",
    "K",
    "ERA",
    "WHIP",
    "SV",
  ];

  return (
    <CustomTable data={data} tabValue={tabValue} columnOrder={columnOrder} />
  );
}

export default TeamStats;
