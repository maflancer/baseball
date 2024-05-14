import CustomTable from "./CustomTable";

function Standings({ data }) {
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

  const filters = {};

  return (
    <CustomTable data={data} filters={filters} columnOrder={columnOrder} />
  );
}

export default Standings;
