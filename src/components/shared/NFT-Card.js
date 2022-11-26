import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Tooltip } from "@mui/material";
import Avatars from "./Avatars";
import { useNavigate } from "react-router-dom";
import { _fetch, _account } from "../../CONTRACT-ABI/connect";
import { buyNft } from "../../functions/buyNft";
import TransctionModal from "./TransctionModal";
import MarkAsFevourite from "./MarkAsFevourite";
import RedirectToOpenSea from "./RedirectToOpenSea";
import { getIcon } from "../../utils/currencyIcon";
import { getSymbol } from "../../utils/currencySymbol";
import imgNotFound from "../../assets/images/default-placeholder.png";
import CardActions from "@mui/material/CardActions";

export default function NFTCard({ tokenId, reload = () => null }) {
  const [nftData, setNftData] = useState(null);
  const [start, setStart] = useState(false);
  const [price, setPrice] = useState(null);
  const [response, setResponse] = useState(null);
  const [owner, setOwner] = useState(null);
  const [account, setAccount] = useState(null);

  let history = useNavigate();

  useEffect(() => {
    fetchNftInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchNftInfo() {
    try {
      const getAllTokenUri = await _fetch("tokenURI", tokenId);
      const price = await _fetch("getNftPrice", tokenId);
      setPrice(price);
      const getOwner = await _fetch("ownerOf", tokenId);
      setOwner(getOwner);
      const account = await _account();
      setAccount(account);
      // console.log("---getAllTokenUri--->", getAllTokenUri);
      await fetch(getAllTokenUri)
        .then((response) => response.json())
        .then((data) => {
          setNftData(data);
          console.log("----->nftData", data);
        });
    } catch (err) {
      console.error("Unable to fetch data from IPFS", err);
    }
  }

  const buynow = async () => {
    setStart(true);
    const responseData = await buyNft(Number(tokenId));
    setResponse(responseData);
    fetchNftInfo();
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
  };
  // console.log("----------->", nftData);
  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}

      {nftData?.image && (
        <Card
          sx={{
            height: "100%",
            // width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            border: "0.01px solid rgba(0, 0, 0, 0.09)",
          }}
        >
          {/* <img
            src={nftData?.image}
            alt="NFT img"
            height="150"
            onError={(e) => {
              e.currentTarget.src = imgNotFound;
            }}
          /> */}

          {/* </Tooltip> */}

          <CardContent style={{ paddingBottom: 0 }}>
            <Typography
              style={{ fontSize: 14, cursor: "pointer" }}
              variant="body2"
              paragraph
              item
              fontWeight="600"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "11rem",
              }}
            >
              {nftData?.name} #{tokenId}
            </Typography>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <p>
                <span className="text-secondary" style={{ color: "grey" }}>
                  Closing Date{" "}
                </span>
                <strong style={{ fontSize: 12, fontWeight: "bold" }}>
                  {nftData?.closingDate}
                </strong>
              </p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <p>
                <span
                  className="text-secondary"
                  style={{ fontSize: 10, color: "grey" }}
                >
                  Status:{" "}
                </span>
                <strong
                  style={{ fontSize: 10, fontWeight: "bold", color: "#EC7063" }}
                >
                  {nftData?.status}
                </strong>
              </p>
            </div>
          </CardContent>
          <CardActions>
            <Button
              variant="outlined"
              size="small"
              sx={{
                marginX: "15px",
                marginBottom: "15px",
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                history(`/details/${tokenId}`);
                return;
              }}
              style={{
                border: "2px solid #1976d2",
                fontSize: 10,
                fontWeight: "bold",
                padding: 8,
                width: 100,
              }}
            >
              View
            </Button>
            <a href={nftData?.image} target="_blank" rel="noreferrer" download>
              <Button
                variant="contained"
                size="small"
                sx={{
                  marginX: "15px",
                  marginBottom: "15px",
                }}
                style={{
                  border: "2px solid #1976d2",
                  fontSize: 10,
                  fontWeight: "bold",
                  padding: 8,
                  width: 100,
                }}
              >
                Download
              </Button>
            </a>
          </CardActions>
        </Card>
      )}
    </>
  );
}
