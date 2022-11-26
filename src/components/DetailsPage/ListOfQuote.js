/* eslint-disable eqeqeq */
import { Grid, Card } from "@mui/material";
import React, { useState } from "react";
import NoData from "../shared/NoData";
import ListCard from "../shared/ListCard";
import PDF_ICON from "../../assets/images/pdf.jpg";

const ListOfQuote = ({ nftData }) => {
  console.log("---nftData--->>>>>>>", nftData?.quotations);

  return (
    <Grid container style={{ marginTop: 40 }}>
      <div
        style={{
          padding: "20px",
        }}
      >
        <h4>Quotations</h4>
      </div>
      {nftData?.quotations.length > 0 ? (
        nftData?.quotations?.map((item) => (
          <Grid item xs={12} sm={12} md={12} lg={12} style={{ marginTop: 20 }}>
            <ListCard image={PDF_ICON} nftData={item} />
          </Grid>
        ))
      ) : (
        <NoData text="No Quotation found" />
      )}
    </Grid>
  );
};

export default ListOfQuote;
