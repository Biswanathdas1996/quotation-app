import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Stack,
  Typography,
} from "@mui/material";
// import MonetizationOnOutlined from "@mui/icons-material/MonetizationOnOutlined";
// import MaleImg from "../../assets/images/female1.png";
import { getIcon } from "../../utils/currencyIcon";
import CustomButton from "./CustomButton";
// import CustomTransactionStat from "./CustomTransactionStat";

import { frtchAccounttransction } from "../../functions/fetchAccountTransction";
import { ConfigContext } from "../../App";

const columns = [
  { id: "from", label: "FROM", minWidth: 170 },
  { id: "to", label: "TO", minWidth: 100 },

  {
    id: "type",
    label: "TYPE",
    minWidth: 170,
    align: "center",
  },
];

const MyTransaction = ({ tokenId }) => {
  const [transctions, settransctions] = useState([]);
  const configs = React.useContext(ConfigContext);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    await frtchAccounttransction(configs)
      .then((response) => response.json())
      .then((result) => {
        console.log("--------->", result);
        settransctions(result.result);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <Card>
      <TableContainer
        sx={{
          maxHeight: "auto",
          width: "100%",
          // border: "1px solid #EDEDED",
        }}
      >
        <Table
          stickyHeader
          aria-label="sticky table"
          sx={{ border: "1px solid #EDEDED" }}
        >
          <TableHead sx={{}}>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ fontWeight: "bold", backgroundColor: "#F1F7FD" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {transctions?.map((data, i) => {
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

              if (data?.tokenID === tokenId) {
                return (
                  <TableRow
                    key={i}
                    sx={{
                      "&:last-child td, &:last-child th": {
                        marginBottom: 10,
                      },
                    }}
                  >
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
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
                            fontWeight: "bold",
                            fontSize: "14px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "6rem",
                            color: "#0578EC",
                          }}
                        >
                          {data?.from}
                        </Typography>

                        <Typography sx={{ fontSize: "11px" }}>
                          {txnDate}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            fontSize: "14px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "6rem",
                            color: "#0578EC",
                          }}
                        >
                          {data?.to}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    <TableCell align="center">
                      <CustomButton
                        type={
                          data?.from ===
                          "0x0000000000000000000000000000000000000000"
                            ? `Mint`
                            : `Transfer`
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              } else {
                return null;
              }
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default MyTransaction;
