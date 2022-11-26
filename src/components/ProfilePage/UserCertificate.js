import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

import { frtchAccounttransction } from "../../functions/fetchAccountTransction";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  _fetch,
  _account,
  getContractAddress,
} from "../../CONTRACT-ABI/connect";
import { Stack, Typography } from "@mui/material";
import { ConfigContext } from "../../App";
import "../../styles/certificate.css";

export default function Certificate({ tokenId, attributes = [] }) {
  const [tokens, setToken] = React.useState([]);
  const [account, setAccount] = React.useState(null);
  const configs = React.useContext(ConfigContext);

  const printDocument = () => {
    const input = document.getElementById("divToPrint");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "JPEG", 0, 0);
      // pdf.output('dataurlnewwindow');
      pdf.save(`Token ${tokenId} - Ownership document.pdf`);
    });
  };

  const [transctions, settransctions] = React.useState([]);

  React.useEffect(() => {
    fetchData();
    fetchAllPosts();
  }, []);
  const fetchData = async () => {
    await frtchAccounttransction(configs)
      .then((response) => response.json())
      .then((result) => {
        // console.log("--------->", result);
        settransctions(result.result);
      })
      .catch((error) => console.log("error", error));
  };

  async function fetchAllPosts() {
    const getAllToken = await _fetch("getToken");
    const account = await _account();
    setAccount(account);
    console.log(account);
    const tokenOwnedByMe = [];

    await getAllToken.map(async (tokenId) => {
      const owner = await _fetch("ownerOf", tokenId);
      if (account === owner) {
        tokenOwnedByMe.push(tokenId);
        setToken([...tokenOwnedByMe]);
      }
    });
  }

  const listAllTransction = (token) => {
    return transctions?.map((data, i) => {
      var unixTimestamp = data?.timeStamp;
      var date = new Date(unixTimestamp * 1000);
      const txnDate =
        date.getDate() +
        "/" +
        (date.getMonth() + 1) +
        "/" +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds();
      console.log("====tokens===>", data?.tokenID);
      if (data?.tokenID === token) {
        return (
          <TableBody
            sx={{
              "&:last-child td, &:last-child th": {
                border: 0,
              },
            }}
          >
            <TableCell align="right">
              <Stack
                direction="column"
                sx={{
                  alignItems: "flex-start",
                  justifyContent: "start",
                  display: "flex",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "8rem",
                    color: "vlack",
                  }}
                >
                  {data?.from}
                </Typography>
              </Stack>
            </TableCell>
            <TableCell>
              {" "}
              <Typography
                sx={{
                  fontSize: "14px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "6rem",
                  color: "black",
                }}
              >
                {data?.to}
              </Typography>
            </TableCell>

            <TableCell>
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "8rem",
                  color: "black",
                }}
              >
                {data?.from === "0x0000000000000000000000000000000000000000"
                  ? `Mint`
                  : `Transfer`}
              </Typography>

              <Typography sx={{ fontSize: "11px" }}>{txnDate}</Typography>
            </TableCell>
          </TableBody>
        );
      } else {
        return null;
      }
    });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8} sm={12} lg={12}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => printDocument()}
            style={{ float: "right" }}
            startIcon={<DownloadForOfflineIcon />}
          >
            Download
          </Button>
        </Grid>
        <Grid item xs={12} md={8} sm={12} lg={12} id="divToPrint">
          <Card className="border linear-repeating">
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12} sm={12} lg={12}>
                  <h3 style={{ fontWeight: "bold", textAlign: "center" }}>
                    NFT Ownership certificate
                  </h3>
                </Grid>
                <Grid item xs={12} md={12} sm={12} lg={12}>
                  <p style={{ marginTop: 20, textAlign: "left", fontSize: 17 }}>
                    This is to certify that the user {<b>{account}</b>} owns the
                    bellow NFT(s) of contact address of{" "}
                    <b>{getContractAddress()}</b>.
                  </p>
                </Grid>

                <Grid item xs={12} md={12} sm={12} lg={12}>
                  <Typography
                    sx={{
                      //   fontWeight: "bold",
                      fontSize: "15px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "8rem",
                      color: "vlack",
                      marginBottom: 2,
                    }}
                  >
                    Transctions
                  </Typography>

                  {tokens?.map((token) => {
                    return (
                      <>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            fontSize: "16px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "8rem",
                            color: "vlack",
                            marginBottom: 2,
                            marginTop: 2,
                          }}
                        >
                          Token #{token}
                        </Typography>

                        <TableContainer component={Paper}>
                          <Table aria-label="simple table" size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Form</TableCell>
                                <TableCell>To</TableCell>
                                <TableCell>Type</TableCell>
                              </TableRow>
                            </TableHead>
                            {listAllTransction(token)}
                          </Table>
                        </TableContainer>
                      </>
                    );
                  })}

                  <br />
                </Grid>

                <Grid item xs={12} md={6} sm={12} lg={6}>
                  <h4
                    style={{ marginTop: 40, textAlign: "left", fontSize: 14 }}
                  >
                    Signature :{" "}
                  </h4>
                  <h4
                    style={{ marginTop: 10, textAlign: "left", fontSize: 14 }}
                  >
                    Date :{" "}
                  </h4>
                </Grid>
                <Grid item xs={12} md={6} sm={12} lg={6}></Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
