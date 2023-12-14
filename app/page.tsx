"use client";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";

type SourceResponse = {
  source: String;
  score: Number;
  response: String;
  url: String;
};
type SourceResponses = [SourceResponse];
type AIResponse = {
  suggestedResponse: String;
  responses: SourceResponses;
};

const ResultsTable = (props) => {
  const { results } = props;
  return (
    <TableContainer component={Paper} style={{ paddingTop: "50px" }}>
      <Table sx={{ minWidth: 650 }} aria-label="results table">
        <TableHead>
          <TableRow sx={{ background: "lightblue" }}>
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              SELECT
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              SOURCE
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              MATCH SCORE
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="left">
              RESPONSE
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="left">
              LINK
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.responses.map((row: any, index: number) => (
            <TableRow key={index}>
              <TableCell align="center">
                <Checkbox />
              </TableCell>
              <TableCell align="center">{row.source}</TableCell>
              <TableCell align="center">{row.score}</TableCell>
              <TableCell align="left">{row.response}</TableCell>
              <TableCell align="left">
                <Link href="{row.url}">{row.url}</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default function Home() {
  const [results, setResults] = useState("");
  const [question, setQuestion] = useState("");

  const handleClick = async () => {
    const data = await fetch("/api/response", {
      method: "POST",
      headers: {
        Accept: "application.json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(question),
      cache: "default",
    });
    setResults(await data.json());
  };

  function generateResonse(
    event: MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void {
    throw new Error("Function not implemented.");
  }

  return (
    <main>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1 },
          padding: 3,
        }}
        noValidate
        autoComplete="off"
      >
        <Box
          sx={{
            padding: 0,
            textAlign: "right",
            background: "linear-gradient(to right, #1994cc, #0a1b3a)",
          }}
        >
          <img src="image.png" alt="image" height="150" />
        </Box>
        <Grid container spacing={1} sx={{ marginTop: "10px" }}>
          <Grid item xs={6}>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <TextField
                  id="outlined-multiline-flexible"
                  label="Enter question:"
                  multiline
                  maxRows={250}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  style={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleClick}
                  endIcon={<SendIcon />}
                  sx={{ width: "100%" }}
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            {results && (
              <>
                <TextField
                  id="outlined-multiline-flexible"
                  label="Suggested response from AI:"
                  multiline
                  maxRows={20}
                  value={results.suggestedResponse}
                  style={{ width: "100%" }}
                  disabled={true}
                />
                <Button
                  variant="contained"
                  size="large"
                  onClick={generateResonse}
                  // sx={{ width: "100%" }}
                >
                  Generate Response
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    navigator.clipboard.writeText(results.suggestedResponse);
                  }}
                  sx={{ position: "relative", float: "right" }}
                >
                  Copy To Clipboard
                </Button>
              </>
            )}
          </Grid>
          <Grid item xs={12}>
            {results && <ResultsTable results={results} />}
          </Grid>
        </Grid>
      </Box>
    </main>
  );
}
