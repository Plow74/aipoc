"use client";
import { Box, CircularProgress, Container, Stack } from "@mui/material";
import { useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);

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
                  <Result question={question} results={results} />
                </>
              )}
            </Box>

            <Question
              setResults={setResults}
              setQuestion={setQuestion}
              setIsLoading={setIsLoading}
              question={question}
            />
          </Stack>
        </Box>
      </Container>
    </main>
  );
}
