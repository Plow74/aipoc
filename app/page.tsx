"use client";
import {
  AppBar,
  Avatar,
  Box,
  CircularProgress,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Question from "./components/Question";
import Result from "./components/Result";
import Image from "next/image";
import AiLogo from "../public/Ai-Logo.svg";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2b2b2b',
    },
  },
});
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
          <ThemeProvider theme={theme}>

      <div>
        <Box
          sx={{
            bgcolor: "#1e1e1e",
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
                bgcolor: "#2b2b2b",
              }}
            >
              <AppBar
                sx={{
                  backgroundColor: "#000810",
                }}
              >
                <Toolbar>
                <Image
                        src={AiLogo}
                        width={30}
                        height={30}
                        alt="Ai Small Logo"
                      />
                <Typography sx={{ml:2}}>AI Search Genius</Typography>
                </Toolbar>
              </AppBar>
              {results ? (
                <Container maxWidth="lg">
                  <Result question={question} results={results} />
                </Container>
              ) : (
                <>
                  <Container
                    sx={{ textAlign: "center", color: "#FFF", pt: 32 }}
                    maxWidth="sm"
                  >
                    <Box pb={2}>
                      <Image
                        src={AiLogo}
                        width={150}
                        height={100}
                        alt="Ai Logo"
                      />
                    </Box>
                    <Typography gutterBottom variant="h5" component="h1">
                      <strong>Where Conversations Get Resolved</strong>
                    </Typography>
                    <Typography>
                      Expert guidance on all things related to Health
                      Information Technology. From understanding healthcare
                      systems to navigating digital solutions.
                    </Typography>
                  </Container>
                </>
              )}
              <Question
                setResults={setResults}
                setQuestion={setQuestion}
                setIsLoading={setIsLoading}
                question={question}
              />
            </Box>
          </Stack>
        </Box>
      </div>
      </ThemeProvider>
    </main>
  );
}
