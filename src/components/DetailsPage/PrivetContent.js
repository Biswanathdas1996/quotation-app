import React from "react";
import { TabPanel } from "@mui/lab";

import Certificate from "./Certificate";

const Bid = ({ tokenId, attributes }) => {
  return (
    <TabPanel
      value="3"
      sx={{
        backgroundColor: "#F0F6FF",
        width: "100%",
        overflow: "auto",
      }}
    >
      <Certificate tokenId={tokenId} attributes={attributes} />
    </TabPanel>
  );
};

export default Bid;
