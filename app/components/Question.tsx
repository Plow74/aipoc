import { Box, TextField, Button } from "@mui/material";
import React from "react";
import { RefObject } from "react";

const Question = (
  props: {
    handleClick: any;
    isDisabled: boolean;
  },
  ref:
    | ((instance: HTMLDivElement | null) => void)
    | RefObject<HTMLDivElement>
    | null
    | undefined,
) => {
  const { handleClick, isDisabled } = props;

  return (
    <Box
      sx={{
        bgcolor: "#1E1E1E",
        width: "-webkit-fill-available",
        pt: 2,
        pl: 4,
        pr: 4,
        pb: 2,
        justifyContent: "space-between",
        position: "absolute",
        bottom: 0,
        flexDirection: "row",
        display: "flex",
      }}
    >
      <TextField
        id="filled-textarea"
        label="Ask me a question"
        variant="filled"
        disabled={isDisabled}
        inputRef={ref}
        style={{
          color: "white",
          backgroundColor: "white",
          width: "-webkit-fill-available",
        }}
      />
      <Button
        variant="contained"
        disabled={isDisabled}
        onClick={handleClick}
        sx={{ backgroundColor: "black", width: "10vw" }}
      >
        ENTER
      </Button>
    </Box>
  );
};

export default React.forwardRef(Question);
