import React from "react";
import { Typography, Stack } from "@mui/material";
import { TabPanel } from "@mui/lab";
import SpeakerNotesOffIcon from "@mui/icons-material/SpeakerNotesOff";

const Bid = ({ text }) => {
  return (
    <Stack
      direction="Column"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "Center",
        p: 5,
        marginTop: 5,
      }}
    >
      <SpeakerNotesOffIcon sx={{ color: "#ABB2B9", fontSize: 60 }} />
      <Typography
        sx={{
          color: "#ABB2B9",
          fontSize: 14,
          fontWeight: "bold",
          marginTop: 5,
        }}
      >
        {text}
      </Typography>
    </Stack>
  );
};

export default Bid;
