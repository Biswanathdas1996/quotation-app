/* eslint-disable eqeqeq */
import { Grid, Card } from "@mui/material";
import React, { useState } from "react";
import NoData from "../shared/NoData";
import ListCard from "../shared/ListCard";
import PDF_ICON from "../../assets/images/pdf.jpg";
import { createAnduploadFileToIpfs } from "../../utils/uploadFileToIpfs";
import { ConfigContext } from "../../App";
import { _transction } from "../../CONTRACT-ABI/connect";
import TransctionModal from "../shared/TransctionModal";

const ListOfQuote = ({ nftData, ifOwner, tokenId }) => {
  console.log("---nftData--->>>>>>>", nftData?.quotations);
  const configs = React.useContext(ConfigContext);
  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);

  const acceptQuote = async (index) => {
    setStart(true);
    const currentNftData = { ...nftData };
    console.log("---currentNftData-->", currentNftData);
    const selectedQuote = currentNftData?.quotations[index];
    const accepettedData = { ...selectedQuote, accepted: true };
    nftData.quotations[index] = accepettedData;
    const updatedMetadata = {
      ...nftData,
      status: `One offer accepted`,
    };
    console.log("---updatedMetadata-->", updatedMetadata);
    let resultsSaveMetaData;
    try {
      resultsSaveMetaData = await createAnduploadFileToIpfs(
        configs,
        updatedMetadata
      );
    } catch (err) {
      alert("upload File To Ipfs Failed, please try again");
      console.error("upload File To Ipfs Failed", err);
      setStart(false);
      return;
    }
    console.log("---metadta-->", resultsSaveMetaData);
    let responseData;
    try {
      responseData = await _transction(
        "setTokenURI",
        resultsSaveMetaData,
        tokenId
      );
    } catch (err) {
      setStart(false);
    }
    setResponse(responseData);
  };

  const rejectQuote = async (index) => {
    setStart(true);
    const currentNftData = { ...nftData };
    console.log("---currentNftData-->", currentNftData);
    const selectedQuote = currentNftData?.quotations[index];
    const accepettedData = { ...selectedQuote, accepted: false };
    nftData.quotations[index] = accepettedData;
    const updatedMetadata = {
      ...nftData,
    };
    console.log("---updatedMetadata-->", updatedMetadata);
    let resultsSaveMetaData;
    try {
      resultsSaveMetaData = await createAnduploadFileToIpfs(
        configs,
        updatedMetadata
      );
    } catch (err) {
      alert("upload File To Ipfs Failed, please try again");
      console.error("upload File To Ipfs Failed", err);
      setStart(false);
      return;
    }
    console.log("---metadta-->", resultsSaveMetaData);
    let responseData;
    try {
      responseData = await _transction(
        "setTokenURI",
        resultsSaveMetaData,
        tokenId
      );
    } catch (err) {
      setStart(false);
    }
    setResponse(responseData);
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
    window.location.reload();
  };

  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}
      <Grid container style={{ marginTop: 40 }}>
        <div
          style={{
            padding: "20px",
          }}
        >
          <h4>Quotations</h4>
        </div>
        {nftData?.quotations.length > 0 ? (
          nftData?.quotations?.map((item, index) => (
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              style={{ marginTop: 20 }}
            >
              <ListCard
                image={PDF_ICON}
                nftData={item}
                ifOwner={ifOwner}
                acceptQuote={acceptQuote}
                rejectQuote={rejectQuote}
                index={index}
              />
            </Grid>
          ))
        ) : (
          <NoData text="No Quotation found" />
        )}
      </Grid>
    </>
  );
};

export default ListOfQuote;
