"use client";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
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
import { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { ConstructionOutlined } from "@mui/icons-material";

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

const ResultsTable = (props: { results: any; handleCheck: any }) => {
  const { results, handleCheck } = props;

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
                {row.source.length > 0 && (
                  <Checkbox onClick={handleCheck(row)} />
                )}
              </TableCell>
              <TableCell align="center">{row.source}</TableCell>
              <TableCell align="center">{row.score}</TableCell>
              <TableCell align="left">{row.response}</TableCell>
              <TableCell align="left">
                <Link href={row.url}>{row.url}</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default function Home() {
  const [results, setResults] = useState({
    suggestedResponse: "",
    responses: [{ id: 0, source: "", score: "", response: "", url: "" }],
  });
  const [question, setQuestion] = useState("");
  const [suggestedResponse, setSuggestedResponse] = useState("");
  const [checkedResponses, setCheckedResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerateResponseDisabled, setIsGenerateResponseDisabled] =
    useState(false);

  useEffect(() => {
    console.log(`DEBUG ---> something was checked`);
    if (checkedResponses.length > 0) {
      setIsGenerateResponseDisabled(false);
    } else {
      setIsGenerateResponseDisabled(true);
    }
  }, [checkedResponses]);

  const handleClick = async () => {
    const postJson = { log: question };
    setResults({
      suggestedResponse: "",
      responses: [{ id: 0, source: "", score: "", response: "", url: "" }],
    });
    setSuggestedResponse("");
    setIsLoading(true);

    const data = await fetch("http://localhost:3000/api/answer-question", {
      method: "POST",
      headers: {
        Accept: "application.json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postJson),
      cache: "default",
    });
    setResults(await data.json());
    setIsLoading(false);
  };

  const generateResponse = async () => {
    const selectedResponses = checkedResponses.map((x) => x.response);
    console.log(`DEBUG ---> the selected responses are ${selectedResponses}`);
    // here is where you wil post the array of selected responses to the AI endpoint //
    const data = await fetch("http://localhost:3000/api/combine-answer", {
    // const data = await fetch("api/combinedresponse", {
      method: "POST",
      headers: {
        Accept: "application.json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selectedResponses: selectedResponses, question: question }),
      cache: "default",
    });
    setSuggestedResponse(await data.json());
  };

  const handleChecked = (row) => () => {
    const responseArray = Array.from(checkedResponses);
    const responseIndex = checkedResponses.findIndex(
      (obj) => obj.id === row.id,
    );
    if (responseIndex != -1) {
      responseArray.splice(responseIndex, 1);
    } else {
      responseArray.push(row);
    }
    setCheckedResponses(responseArray);
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
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {isLoading && <CircularProgress color="primary" />}
                </div>
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
                  value={suggestedResponse}
                  style={{ width: "100%" }}
                  disabled={true}
                />
                <Button
                  variant="contained"
                  size="large"
                  onClick={generateResponse}
                  disabled={isGenerateResponseDisabled}
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
            {results && (
              <ResultsTable results={results} handleCheck={handleChecked} />
            )}
          </Grid>
        </Grid>
      </Box>
    </main>
  );
}
