import { Box, Stack, TextField, Button } from "@mui/material";

const Question = (props: {
  handleClick: any;
  setQuestion: any;
  question: string;
}) => {
  const { handleClick, setQuestion, question } = props;
  return (
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
  );
};

export default Question;
