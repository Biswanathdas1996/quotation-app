import {
  Typography,
  Box,
  Stack,
  Button,
  Grid,
  Container,
  Tab,
  Link,
  Tooltip,
} from "@mui/material";
import React from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
// import Bid from "./Bid";
import Attributes from "./Attributes";
import TransactionHistory from "./TransactionHistory";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import UpdatePrice from "./UpdatePrice";
import TransferNFT from "./TransferNFT";
import PrivetContent from "./PrivetContent";
import Quotation from "./Quotation";
import ListOfQuote from "./ListOfQuote";
import { getIcon } from "../../utils/currencyIcon";
import { getSymbol } from "../../utils/currencySymbol";
import { networkURL } from "../../config";
import { ConfigContext } from "../../App";
import { TabPanel } from "@mui/lab";

const RightContent = ({
  nftData,
  owner,
  price,
  buynow,
  account,
  tokenId,
  fetchNftInfo,
}) => {
  const [value, setValue] = React.useState("2");
  const configs = React.useContext(ConfigContext);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { name, attributes } = nftData;
  return (
    <Container>
      <Typography sx={{ fontSize: 30, fontWeight: "bold" }}>{name}</Typography>
      <Stack direction="row" spacing={12} marginTop="20px">
        <Stack direction="row">
          <ManageAccountsIcon alt="Creator" sx={{ width: 30, height: 30 }} />
          <div style={{ marginLeft: 10 }}>
            <Typography
              sx={{ fontSize: 10, fontWeight: "bold", color: "#858585" }}
            >
              Author
            </Typography>
            <Typography sx={{ fontSize: 11, fontWeight: "bold" }}>
              {nftData?.author}
            </Typography>
          </div>
        </Stack>

        <Stack direction="row">
          <AccountCircleIcon alt="Owner" sx={{ width: 30, height: 30 }} />
          <div style={{ marginLeft: 10 }}>
            <Typography
              sx={{ fontSize: 10, fontWeight: "bold", color: "#858585" }}
            >
              Owner
            </Typography>
            <Tooltip title="Contrct Address">
              <Link
                href={`${networkURL(configs)}/address/${owner}`}
                target="_blank"
                sx={{ textDecoration: "none" }}
              >
                <Typography
                  variant="body2"
                  paragraph
                  item
                  fontWeight="600"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "11rem",
                  }}
                  style={{ fontSize: 10 }}
                >
                  {owner}
                </Typography>
              </Link>
            </Tooltip>
          </div>
        </Stack>
      </Stack>

      {owner !== account ? (
        <div style={{ marginTop: "30px", marginBottom: "30px" }}></div>
      ) : (
        <div style={{ marginTop: "30px", marginBottom: "30px" }}>
          <TransferNFT
            price={price}
            tokenId={tokenId}
            fetchNftInfo={fetchNftInfo}
          />
        </div>
      )}

      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab
                label="Conditions"
                value="2"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  color: "#000000",
                }}
              />
              <Tab
                label="Transaction history"
                value="1"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  color: "#000000",
                }}
              />
              <Tab
                label="Document"
                value="3"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  color: "#000000",
                }}
              />
              <Tab
                label="Assigned Vendors"
                value="4"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  color: "#000000",
                }}
              />
            </TabList>
          </Box>
          <TabPanel
            value="1"
            sx={{ border: "1px solid #EDEDED", padding: 0, marginTop: 5 }}
          >
            <TransactionHistory tokenId={tokenId} />
          </TabPanel>
          <TabPanel
            value="2"
            sx={{ border: "1px solid #EDEDED", padding: 0, marginTop: 5 }}
          >
            <Attributes attributes={attributes} />
          </TabPanel>
          <TabPanel
            value="4"
            sx={{ border: "1px solid #EDEDED", padding: 0, marginTop: 5 }}
          >
            {nftData?.assignedVendors?.map((val) => (
              <Stack direction="row" style={{ margin: 20 }}>
                <ManageAccountsIcon
                  alt="Creator"
                  sx={{ width: 30, height: 30 }}
                />
                <div style={{ marginLeft: 10 }}>
                  <Typography
                    sx={{ fontSize: 10, fontWeight: "bold", color: "#858585" }}
                  >
                    {val?.label}
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
                    {val?.value}
                  </Typography>
                </div>
              </Stack>
            ))}
          </TabPanel>

          <PrivetContent tokenId={tokenId} attributes={attributes} />
        </TabContext>
      </Box>

      <Box sx={{ width: "100%", typography: "body1" }}>
        <ListOfQuote nftData={nftData} />
      </Box>
      {owner !== account && (
        <Box sx={{ width: "100%", typography: "body1" }}>
          <Quotation nftData={nftData} tokenId={tokenId} />
        </Box>
      )}
    </Container>
  );
};

export default RightContent;
