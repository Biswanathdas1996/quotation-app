import React, { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import {
  _transction,
  _transction_signed,
  _fetch,
  _account,
} from "../../CONTRACT-ABI/connect";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import TransctionModal from "../shared/TransctionModal";
import {
  uploadFileToIpfs,
  createAnduploadFileToIpfs,
} from "../../utils/uploadFileToIpfs";
import swal from "sweetalert";
import { ConfigContext } from "../../App";

const web3 = new Web3(window.ethereum);

const Quote = ({ nftData, tokenId }) => {
  const configs = React.useContext(ConfigContext);

  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);
  const [file, setFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [description, setDescription] = useState(null);

  let history = useNavigate();

  const assignContractToVendor = async (selectedVendors, tokenId) => {
    const vendorWalletAddress = selectedVendors.map(({ value }) => value);
    console.log("vendorWalletAddress", vendorWalletAddress);

    try {
      for (let i = 0; i < selectedVendors.length; i++) {
        await _transction_signed(
          "assignContractToVendor",
          vendorWalletAddress[i],
          tokenId.toString()
        );

        console.log("Called instance:", i + 1);
      }
    } catch (err) {
      swal({
        title: "Server issue!",
        text: "Unable to assign vendor",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          console.error("Mint NFT failed Failed", err);
          setStart(false);
          return;
        }
      });
    }
  };

  const saveData = async () => {
    setStart(true);
    let responseData;
    let results;

    if (file) {
      const fileInput = document.querySelector('input[type="file"]');

      try {
        results = await uploadFileToIpfs(configs, fileInput.files);
      } catch (err) {
        swal({
          title: "Server issue!",
          text: "Upload File To Ipfs Failed, please try again",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then((willDelete) => {
          if (willDelete) {
            console.error("upload File To Ipfs Failed", err);
            setStart(false);
            return;
          }
        });
      }
      const account = await _account();
      nftData?.quotations?.push({
        vendor: account,
        file: results,
        description: description,
        date: new Date(),
      });
      let resultsSaveMetaData;
      try {
        resultsSaveMetaData = await createAnduploadFileToIpfs(configs, nftData);
      } catch (err) {
        alert("upload File To Ipfs Failed, please try again");
        console.error("upload File To Ipfs Failed", err);
        setStart(false);
        return;
      }
      console.log("---metadta-->", resultsSaveMetaData);

      try {
        responseData = await _transction(
          "setTokenURI",
          resultsSaveMetaData,
          tokenId
        );
      } catch (err) {
        swal({
          title: "Server issue!",
          text: "Mint NFT failed Failed, please try again",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then((willDelete) => {
          if (willDelete) {
            console.error("Mint NFT failed Failed", err);
            setStart(false);
            return;
          }
        });
      }
    }
    setResponse(responseData);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
    window.location.reload();
  };
  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}
      <Card style={{ marginTop: 40 }}>
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <div
              style={{
                padding: "20px",
              }}
            >
              <h4>Submit your Quotation</h4>
              <Formik
                initialValues={{
                  text: "",
                }}
                onSubmit={(values, { setSubmitting }) => {
                  console.log("values=======>", values);
                  saveData(values);
                  setSubmitting(false);
                }}
              >
                {({ touched, errors, isSubmitting, values }) => (
                  <Form>
                    <Grid container>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <div
                          className="form-group"
                          style={{ marginLeft: 10, marginTop: 10 }}
                        >
                          <label for="title" className="my-2">
                            Choose file <span className="text-danger">*</span>
                          </label>

                          <input
                            className={`form-control text-muted`}
                            type="file"
                            onChange={onFileChange}
                          />

                          {selectedFile && (
                            <center>
                              <img
                                src={preview}
                                alt="img"
                                style={{
                                  marginTop: 20,
                                  height: 300,
                                  width: "auto",
                                }}
                              />
                            </center>
                          )}
                        </div>
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <div
                          className="form-group"
                          style={{ marginLeft: 10, marginTop: 10 }}
                        >
                          <label for="title" className="my-2">
                            Description <span className="text-danger">*</span>
                          </label>
                          <TextareaAutosize
                            aria-label="minimum height"
                            minRows={3}
                            name="text"
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Minimum 3 rows"
                            style={{ width: "100%" }}
                            className={`form-control text-muted ${
                              touched.text && errors.text ? "is-invalid" : ""
                            }`}
                          />
                        </div>
                      </Grid>

                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <div
                          className="form-group"
                          style={{
                            marginLeft: 10,
                            marginTop: 10,
                            float: "right",
                          }}
                        >
                          <span className="input-group-btn">
                            <Button
                              variant="contained"
                              size="large"
                              sx={{
                                marginX: "15px",
                                marginBottom: "15px",
                              }}
                              type="submit"
                              value={"Submit"}
                              style={{
                                fontSize: 16,
                                padding: "10px 24px",
                                borderRadius: 12,
                              }}
                            >
                              Submit
                            </Button>
                          </span>
                        </div>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            </div>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};
export default Quote;
