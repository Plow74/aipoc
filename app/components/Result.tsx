import { Stack, Typography, Box, Button } from "@mui/material";
import ResultsTable from "./ResultsTable";
import { useEffect, useState } from "react";

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
        borderColor: "red",
        paddingLeft: "10px",
        marginBottom: "40px",
      }}
    >
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
          Please select which column(s) you would like to use to generate a
          resonse.
        </Typography>
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
            navigator.clipboard.writeText(results.suggestedResponse);
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
  );
};
export default Result;
