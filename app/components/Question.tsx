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
    <Box sx={{ 
      bgcolor:'#1E1E1E', 
      width:'-webkit-fill-available',
      pt:2,  
      pl:4, 
      pr:4, 
      pb:2, 
      justifyContent:'space-between', 
      position:'absolute', 
      bottom: 0, 
      flexDirection: 'row', 
      display:'flex',
      }}
      >
        <TextField
          id="filled-textarea"
          label="Ask me a question"
          variant="filled"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{
            color: "white",
            backgroundColor: "white",
            width: '-webkit-fill-available'
          }}
        />
        <Button
          variant="contained"
          onClick={handleClick}
          sx={{ backgroundColor: "black", width: '10vw' }}
        >
          ENTER
        </Button>
    </Box>
  );
};

export default Question;
