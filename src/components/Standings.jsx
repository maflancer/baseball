import CustomTable from "./CustomTable";

function Standings({ data, tabValue }) {
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

  return (
    <CustomTable data={data} tabValue={tabValue} columnOrder={columnOrder} />
  );
}

export default Standings;
