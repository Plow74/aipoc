import { Stack, Typography, Box, Button, Avatar } from "@mui/material";
import ResultsTable from "./ResultsTable";
import { useEffect, useState } from "react";
import { Person2Outlined } from "@mui/icons-material";
import AiLogo from "../../public/Ai-Logo.svg";
import Image from "next/image";
const Result = (props: { question: any; results: any }) => {
  const { question, results } = props;
  const [isGenerateResponseDisabled, setIsGenerateResponseDisabled] =
    useState(false);
  const [checkedResponses, setCheckedResponses] = useState([]);
  const [suggestedResponse, setSuggestedResponse] = useState("");

  useEffect(() => {
    console.log(`DEBUG ---> something was checked`);
    if (checkedResponses.length > 0) {
      setIsGenerateResponseDisabled(false);
    } else {
      setIsGenerateResponseDisabled(true);
    }
  }, [checkedResponses]);

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

  return (
    <Stack
      direction="column"
      spacing={3}
      sx={{
        borderLeft: 2,
        borderColor: "grey",
        paddingLeft: "10px",
        marginBottom: "40px",
        mt: 12,
      }}
    >
      <Box
        sx={{
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
          gap: 2,
          backgroundColor: "#1e1e1e",
          padding: "10px",
          borderRadius: "4px",
          border: "1px solid black",
        }}
      >
        <Avatar>
          <Person2Outlined />
        </Avatar>
        <Typography color={"white"}>
          <strong>{question}</strong>
        </Typography>
      </Box>
      <Box
        sx={{
          borderRadius: "4px",
          backgroundColor: "#1e1e1e",
          padding: "10px",
          border: "1px solid black",
        }}
      >
        <Box
          sx={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            gap: 2,
            backgroundColor: "#1e1e1e",
          }}
        >
          <Image src={AiLogo} width={40} height={40} alt="Ai Small Logo" />
          <div>
            <Typography color={"white"} variant="body1" gutterBottom>
              I found these results for you.
            </Typography>
            <Typography color={"white"} variant="caption" gutterBottom>
              Please select which column(s) you would like to use to generate a
              resonse.
            </Typography>
          </div>
        </Box>
        <Box
          sx={{
            paddingLeft: "50px",
            paddingBottom: "20px",
            paddingTop: "20px",
          }}
        >
          <ResultsTable results={results} handleCheck={handleChecked} />
        </Box>
        <Button
          variant="contained"
          onClick={generateResponse}
          disabled={isGenerateResponseDisabled}
          sx={{
            position: "relative",
            float: "right",
            fontWeight: "bold",
            "&.Mui-disabled": {
              backgroundColor: "gray",
              color: "black",
            },
          }}
        >
          Generate Response
        </Button>
      </Box>
      {suggestedResponse && (
        <Box
          sx={{
            backgroundColor: "#1e1e1e",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid black",
            flexDirection: "row",
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Image src={AiLogo} width={40} height={40} alt="Ai Small Logo" />
          <Box width="100%">
            <Typography color={"white"} variant="body1" gutterBottom>
              The generated response is below.
            </Typography>
            <Typography color={"white"} variant="caption" gutterBottom>
              {suggestedResponse}
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              navigator.clipboard.writeText(results.suggestedResponse);
            }}
            sx={{
              position: "relative",
              float: "right",
              fontWeight: "bold",
            }}
          >
            COPY
          </Button>
        </Box>
      )}
    </Stack>
  );
};
export default Result;
