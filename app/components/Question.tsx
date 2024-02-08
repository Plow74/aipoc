import { Box, Stack, TextField, Button } from "@mui/material";

const Question = (props: {
  setResults: any;
  setQuestion: any;
  setIsLoading: any;
  question: string;
}) => {
  const { setResults, setQuestion, question, setIsLoading } = props;

  const handleClick = async () => {
    const postJson = { log: question };
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
