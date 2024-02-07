"use client";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Link,
  Paper,
  Stack,
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
  const [results, setResults] = useState(null);
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

    const data = await fetch("http://127.0.0.1:3000/api/answerquestion", {
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
    const data = await fetch("http://127.0.0.1:3000/api/combinedresponse", {
      // const data = await fetch("api/combinedresponse", {
      method: "POST",
      headers: {
        Accept: "application.json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selectedResponses: selectedResponses,
        question: question,
      }),
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
      {/* <Box
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
                  COPY
                </Button>
              </>
            )}
          </Grid>
        </Grid>
      </Box> */}

      <Container maxWidth="lg">
        <Box
          sx={{
            bgcolor: "#1e1e1e",
            height: "90vh",
            padding: "20px",
          }}
        >
          <Stack direction="column" spacing={2}>
            {results && (
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 700,
                  overflow: "hidden",
                  overflowY: "scroll",
                  bgcolor: "#2b2b2b",
                  padding: "20px",
                }}
              >
                <Stack direction="column" spacing={3}>
                  <Typography
                    color={"white"}
                    sx={{ backgroundColor: "#1e1e1e", padding: "10px" }}
                  >
                    {question}
                  </Typography>
                  <Box sx={{ backgroundColor: "#1e1e1e", padding: "20px" }}>
                    <Typography color={"white"} variant="body1" gutterBottom>
                      I found these results for you.
                    </Typography>
                    <Typography color={"white"} variant="caption" gutterBottom>
                      Please select which column(s) you would like to use to
                      generate a resonse.
                    </Typography>
                    <Box
                      sx={{
                        paddingLeft: "50px",
                        paddingBottom: "20px",
                        paddingTop: "20px",
                      }}
                    >
                      <ResultsTable
                        results={results}
                        handleCheck={handleChecked}
                      />
                    </Box>
                    <Button
                      variant="contained"
                      onClick={generateResponse}
                      //disabled={isGenerateResponseDisabled}
                      sx={{
                        backgroundColor: "#7a7a7a",
                        color: "black",
                        position: "relative",
                        float: "right",
                        fontWeight: "bold",
                      }}
                    >
                      Generate Response
                    </Button>
                  </Box>
                  <Box sx={{ backgroundColor: "#1e1e1e", padding: "20px" }}>
                    <Typography color={"white"} variant="body1" gutterBottom>
                      The generated response is below.
                    </Typography>
                    <Typography color={"white"} variant="caption" gutterBottom>
                      {suggestedResponse}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          results.suggestedResponse,
                        );
                      }}
                      sx={{
                        backgroundColor: "#7a7a7a",
                        color: "black",
                        position: "relative",
                        float: "right",
                        fontWeight: "bold",
                      }}
                    >
                      COPY
                    </Button>
                  </Box>
                </Stack>
              </Box>
            )}
            <Box sx={{ alignItems: "flex-end" }}>
              <Stack direction="row" spacing={2}>
                <TextField
                  id="filled-textarea"
                  label="Ask me a question"
                  variant="filled"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  style={{
                    color: "white",
                    backgroundColor: "white",
                    width: "90%",
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleClick}
                  sx={{ backgroundColor: "black" }}
                >
                  ENTER
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Container>
    </main>
  );
}
