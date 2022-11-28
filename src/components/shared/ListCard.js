import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Button from "@mui/material/Button";
import { _fetch, _transction } from "../../CONTRACT-ABI/connect";
import Chip from "@mui/material/Chip";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import VerifiedIcon from "@mui/icons-material/Verified";
import CancelIcon from "@mui/icons-material/Cancel";

export default function MediaControlCard({
  image,
  nftData,
  ifOwner,
  acceptQuote,
  rejectQuote,
  index,
}) {
  const [vendor, setVendor] = React.useState(null);
  React.useEffect(() => {
    getVendorData();
  }, []);

  const getVendorData = async () => {
    const getAllToken =
      nftData?.vendor && (await _fetch("getVendorData", nftData?.vendor));
    setVendor(getAllToken);
  };
  console.log("====nftData=====>", nftData);
  return (
    <Card sx={{ display: "flex" }}>
      <Box
        sx={{ display: "flex", flexDirection: "column" }}
        style={{ width: "90%" }}
      >
        <CardContent>
          <Stack direction="row" style={{ marginBottom: 10 }}>
            <ManageAccountsIcon alt="Creator" sx={{ width: 30, height: 30 }} />
            <div style={{ marginLeft: 10 }}>
              <Typography
                sx={{ fontSize: 10, fontWeight: "bold", color: "#858585" }}
              >
                {vendor?.name}
              </Typography>
              <Typography
                component="div"
                variant="h5"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "18rem",
                  fontSize: 11,
                  fontWeight: "bold",
                }}
              >
                {nftData?.vendor}
              </Typography>
            </div>
          </Stack>

          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
            sx={{
              fontSize: "12px",
            }}
          >
            {nftData?.description}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.primary"
            component="div"
            sx={{
              fontSize: "10px",
              fontWeight: "bold",
            }}
          >
            Created on {nftData?.date}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.primary"
            component="div"
            sx={{
              fontSize: "10px",
            }}
          >
            Phone No: {vendor?.contactNo}
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
          {ifOwner && !("accepted" in nftData) && (
            <>
              <Button
                variant="outlined"
                color="success"
                size="small"
                sx={{
                  marginX: "15px",
                  marginBottom: "15px",
                }}
                style={{
                  border: "2px solid #2e7d32",
                  fontSize: 10,
                  fontWeight: "bold",
                  padding: 8,
                  width: 100,
                }}
                startIcon={<VerifiedIcon />}
                onClick={() => acceptQuote(index)}
              >
                Accept
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                sx={{
                  marginX: "15px",
                  marginBottom: "15px",
                }}
                style={{
                  border: "2px solid red",
                  fontSize: 10,
                  fontWeight: "bold",
                  padding: 8,
                  width: 100,
                }}
                startIcon={<CancelIcon />}
                onClick={() => rejectQuote(index)}
              >
                Reject
              </Button>
            </>
          )}

          <a href={nftData?.file} target="_blank" rel="noreferrer" download>
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
              startIcon={<DownloadForOfflineIcon />}
            >
              Download
            </Button>
          </a>

          {nftData?.accepted && (
            <>
              <Chip
                label="Accepted"
                color="success"
                variant="contained"
                icon={<VerifiedIcon />}
                style={{ marginBottom: 10 }}
              />
            </>
          )}
          {nftData?.accepted === false && (
            <>
              <Chip
                label="Rejected"
                color="error"
                variant="contained"
                icon={<CancelIcon />}
                style={{ marginBottom: 10 }}
              />
            </>
          )}
        </Box>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 130 }}
        image={image}
        alt="Live from space album cover"
      />
    </Card>
  );
}
