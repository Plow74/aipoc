"use client";
import {
  Box,
  Button,
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
import AppBar from "@mui/material/AppBar";

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
            <TableCell sx={{ fontWeight: "bold" }}>SOURCE</TableCell>
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
        <Box sx={{ padding: 0 }}>
          <AppBar position="static" sx={{ textAlign: "right", padding: 3 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              AI-SearchGenius
            </Typography>
          </AppBar>
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
              <TextField
                id="outlined-multiline-flexible"
                label="Suggested response from AI:"
                multiline
                maxRows={20}
                value={results.suggestedResponse}
                style={{ width: "100%" }}
                disabled={true}
              />
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
