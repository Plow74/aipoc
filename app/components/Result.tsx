import { Stack, Typography, Box, Button } from "@mui/material";
import ResultsTable from "./ResultsTable";

const Result = (props: {
  question: any;
  results: any;
  handleChecked: any;
  generateResponse: any;
  isGenerateResponseDisabled: any;
  suggestedResponse: any;
}) => {
  const {
    question,
    results,
    handleChecked,
    generateResponse,
    isGenerateResponseDisabled,
    suggestedResponse,
  } = props;
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
