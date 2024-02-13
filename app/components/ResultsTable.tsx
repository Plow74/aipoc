import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
} from "@mui/material";
import Link from "next/link";

const ResultsTable = (props: { results: any; handleCheck: any }) => {
  const { results, handleCheck } = props;

  return (
    <TableContainer component={Paper} style={{ backgroundColor: "#1e1e1e" }}>
      <Table aria-label="results table" size="small">
        <TableHead
          sx={{
            "& .MuiTableCell-root": {
              color: "white",
            },
          }}
        >
          <TableRow>
            <TableCell align="center"></TableCell>
            <TableCell align="center">Source</TableCell>
            <TableCell align="center">Match</TableCell>
            <TableCell align="left">Response</TableCell>
            <TableCell align="left">Link</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.responses?.map((row: any, index: number) => (
            <TableRow
              key={index}
              sx={{
                "& .MuiTableCell-root": {
                  color: "white",
                },
              }}
            >
              <TableCell align="center">
                {row.source.length > 0 && (
                  <Checkbox
                    onClick={handleCheck(row)}
                    sx={{
                      color: "white",
                      "&.Mui-checked": {
                        color: "white",
                      },
                    }}
                  />
                )}
              </TableCell>
              <TableCell align="center">{row.source}</TableCell>
              <TableCell align="center">{row.score}</TableCell>
              <TableCell align="left">{row.response}</TableCell>
              <TableCell sx={{  minWidth:'200px'}} align="left">
                <Link style={{ overflowWrap:'anywhere', color:'white', fontWeight:600,}} href={row.url}>{row.url}</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResultsTable;
