import CustomTable from "./CustomTable";

function TeamStats({ data }) {
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

  const filters = {
    week: "",
    team_name: "",
  };

  return (
    <CustomTable data={data} filters={filters} columnOrder={columnOrder} />
  );
}

export default TeamStats;
