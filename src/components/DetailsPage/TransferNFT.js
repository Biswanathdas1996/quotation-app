import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Card } from "@mui/material";
import { _transction, _account } from "../../CONTRACT-ABI/connect";
import TransctionModal from "../shared/TransctionModal";
import Web3 from "web3";
import { getSymbol } from "../../utils/currencySymbol";

const web3 = new Web3(window.ethereum);

const VendorSchema = Yup.object().shape({
  to: Yup.string().required("Wallet address is required"),
});

const UpdatePrice = ({ price, tokenId, fetchNftInfo }) => {
  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);

  const saveData = async ({ to }) => {
    setStart(true);
    let responseData;
    const account = await _account();
    responseData = await _transction("safeTransferFrom", account, to, tokenId);

    setResponse(responseData);
    fetchNftInfo();
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
  };

  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}

      <div
        style={{
          paddingTop: "20px",
          background: "white",
        }}
      >
        <Card style={{ padding: 15 }}>
          <p>Transfer your NFT</p>
          <Formik
            initialValues={{
              to: "",
            }}
            validationSchema={VendorSchema}
            onSubmit={(values, { setSubmitting }) => {
              saveData(values);
              setSubmitting(false);
            }}
          >
            {({ touched, errors, isSubmitting, values }) => (
              <Form>
                <div className="form-group">
                  <Field
                    type="text"
                    name="to"
                    autoComplete="flase"
                    placeholder={`Enter Wallet Address ( example: 0x9A13... )`}
                    className={`form-control text-muted ${
                      touched.to && errors.to ? "is-invalid" : ""
                    }`}
                    style={{ marginRight: 10, padding: 6 }}
                  />
                </div>

                <div className="form-group" style={{ marginTop: 20 }}>
                  <span className="input-group-btn">
                    <input
                      className="btn btn-default btn-primary"
                      type="submit"
                      value={"Transfer"}
                    />
                  </span>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </>
  );
};
export default UpdatePrice;
