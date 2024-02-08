"use client";
import { Box, CircularProgress, Container, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import Question from "./components/Question";
import Result from "./components/Result";

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

export default function Home() {
  const [results, setResults] = useState(null);
  const [question, setQuestion] = useState("");
  const [suggestedResponse, setSuggestedResponse] = useState("");
  const [checkedResponses, setCheckedResponses] = useState([]);
  const [conversations, setConversations] = useState([]);
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
      <Container maxWidth="lg">
        <Box
          sx={{
            bgcolor: "#1e1e1e",
            height: "90vh",
            padding: "20px",
          }}
        >
          <Stack direction="column" spacing={2}>
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
              {results && (
                <>
                  <Result
                    generateResponse={generateResponse}
                    handleChecked={handleChecked}
                    isGenerateResponseDisabled={isGenerateResponseDisabled}
                    question={question}
                    results={results}
                    suggestedResponse={suggestedResponse}
                  />
                </>
              )}
            </Box>

            <Question
              handleClick={handleClick}
              setQuestion={setQuestion}
              question={question}
            />
          </Stack>
        </Box>
      </Container>
    </main>
  );
}
