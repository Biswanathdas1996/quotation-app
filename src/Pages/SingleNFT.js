import React, { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import {
  _transction,
  _transction_signed,
  _fetch,
} from "../../src/CONTRACT-ABI/connect";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import DeleteOutlineIcon from "@mui/icons-material/Delete";
import { pink } from "@mui/material/colors";
import TransctionModal from "../components/shared/TransctionModal";
import HeaderWrapper from "../components/shared/BackgroundUI";
import CustomSelect from "../components/shared/SelectBox";
import "../styles/background.css";
import {
  uploadFileToIpfs,
  createAnduploadFileToIpfs,
} from "../utils/uploadFileToIpfs";
import swal from "sweetalert";
import { ConfigContext } from "../App";

const web3 = new Web3(window.ethereum);

const VendorSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  authorname: Yup.string().required("Authorname is required"),
});

const Mint = () => {
  const configs = React.useContext(ConfigContext);

  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);
  const [file, setFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [description, setDescription] = useState(null);
  const [vendors, setVendors] = useState([]);

  let history = useNavigate();

  const getAllVendor = async () => {
    const vendors = await _fetch("getAllVendor");

    if (vendors) {
      const mappedSelectField = vendors.map(({ name, walletAddress }) => {
        return {
          label: name,
          value: walletAddress,
        };
      });
      setVendors(mappedSelectField);
    }
  };

  useEffect(() => {
    getAllVendor();
  }, []);

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

  const saveData = async ({
    selectedVendors,
    title,
    closingDate,
    authorname,
    attributes,
  }) => {
    setStart(true);
    let responseData;
    let results;
    const dummyAttrribute = [
      {
        display_type: "date",
        trait_type: "publish-date",
        value: new Date(),
      },
    ];
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

      console.log("---results-->", results);

      const metaData = {
        name: title,
        author: authorname,
        category: "contract",
        image: results,
        closingDate: closingDate,
        description: description,
        attributes: attributes.concat(dummyAttrribute),
        assignedVendors: selectedVendors,
        quotations: [],
        status: "Pending",
      };

      let resultsSaveMetaData;
      try {
        resultsSaveMetaData = await createAnduploadFileToIpfs(
          configs,
          metaData
        );
      } catch (err) {
        alert("upload File To Ipfs Failed, please try again");
        console.error("upload File To Ipfs Failed", err);
        setStart(false);
        return;
      }
      console.log("---metadta-->", resultsSaveMetaData);

      try {
        responseData = await _transction(
          "mintNFT",
          resultsSaveMetaData,
          web3.utils.toWei("0", "ether"),
          "contract"
        );
        await assignContractToVendor(
          selectedVendors,
          responseData?.events?.Transfer?.returnValues?.tokenId
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
    history("/");
  };
  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}
      <HeaderWrapper className="header-wrapper-form">
        <div className="form-layer2">
          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item lg={3} md={3} sm={12} xs={12}></Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <div style={{ margin: 20 }}>
                <Card
                  style={{
                    background: "#ffffff9e",
                  }}
                >
                  <Grid container>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <div
                        style={{
                          padding: "20px",
                        }}
                      >
                        <h4>Create NFT</h4>
                        <Formik
                          initialValues={{
                            authorname: "",
                            title: "",
                            text: "",
                            closingDate: "",
                            attributes: [],
                            selectedVendors: [],
                          }}
                          validationSchema={VendorSchema}
                          onSubmit={(values, { setSubmitting }) => {
                            console.log("values=======>", values);
                            saveData(values);
                            setSubmitting(false);
                          }}
                        >
                          {({ touched, errors, isSubmitting, values }) => (
                            <Form>
                              <Grid container>
                                {vendors && (
                                  <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <div
                                      className="form-group"
                                      style={{ marginLeft: 10, marginTop: 10 }}
                                    >
                                      <label for="title" className="my-2">
                                        Vendors{" "}
                                        <span className="text-danger">*</span>
                                      </label>
                                      <Field
                                        className="custom-select"
                                        name="selectedVendors"
                                        options={vendors}
                                        component={CustomSelect}
                                        placeholder="Select multi languages..."
                                        isMulti={true}
                                      />
                                    </div>
                                  </Grid>
                                )}

                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <div
                                    className="form-group"
                                    style={{ marginLeft: 10, marginTop: 10 }}
                                  >
                                    <label for="title" className="my-2">
                                      Title{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                    <Field
                                      type="text"
                                      name="title"
                                      autoComplete="flase"
                                      placeholder="Enter title"
                                      className={`form-control text-muted ${
                                        touched.title && errors.title
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      style={{ marginRight: 10, padding: 9 }}
                                    />
                                  </div>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <div
                                    className="form-group"
                                    style={{ marginLeft: 10, marginTop: 10 }}
                                  >
                                    <label for="title" className="my-2">
                                      Author Name{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                    <Field
                                      type="text"
                                      name="authorname"
                                      autoComplete="flase"
                                      placeholder="Enter Author name"
                                      className={`form-control text-muted ${
                                        touched.authorname && errors.authorname
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      style={{ marginRight: 10, padding: 9 }}
                                    />
                                  </div>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <div
                                    className="form-group"
                                    style={{ marginLeft: 10, marginTop: 10 }}
                                  >
                                    <label for="title" className="my-2">
                                      Closing Date{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                    <Field
                                      type="date"
                                      name="closingDate"
                                      autoComplete="flase"
                                      placeholder="Enter Author name"
                                      className={`form-control text-muted ${
                                        touched.closingDate &&
                                        errors.closingDate
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      style={{ marginRight: 10, padding: 9 }}
                                    />
                                  </div>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                  <div
                                    className="form-group"
                                    style={{ marginLeft: 10, marginTop: 10 }}
                                  >
                                    <label for="title" className="my-2">
                                      Choose file{" "}
                                      <span className="text-danger">*</span>
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
                                      Description{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                    <TextareaAutosize
                                      aria-label="minimum height"
                                      minRows={3}
                                      name="text"
                                      onChange={(e) =>
                                        setDescription(e.target.value)
                                      }
                                      placeholder="Minimum 3 rows"
                                      style={{ width: "100%" }}
                                      className={`form-control text-muted ${
                                        touched.text && errors.text
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                    />
                                  </div>
                                </Grid>

                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                  <div
                                    className="form-group"
                                    style={{ marginLeft: 10, marginTop: 10 }}
                                  >
                                    <FieldArray
                                      name="attributes"
                                      render={(arrayHelpers) => (
                                        <div>
                                          {values.attributes &&
                                          values.attributes.length > 0 ? (
                                            values.attributes.map(
                                              (attribut, index) => (
                                                <div
                                                  style={{
                                                    border: "1px solid #c7c9cc",
                                                    borderRadius: 5,
                                                    padding: 12,
                                                    marginTop: 15,
                                                  }}
                                                  key={index}
                                                >
                                                  <DeleteOutlineIcon
                                                    onClick={() =>
                                                      arrayHelpers.remove(index)
                                                    }
                                                    sx={{ color: pink[500] }}
                                                    style={{
                                                      marginBottom: 10,
                                                      float: "right",
                                                      cursor: "pointer",
                                                    }}
                                                  />
                                                  <Grid container>
                                                    <Grid
                                                      item
                                                      lg={5}
                                                      md={5}
                                                      sm={12}
                                                      xs={12}
                                                      style={{
                                                        marginRight: 20,
                                                      }}
                                                    >
                                                      <Field
                                                        name={`attributes.${index}.trait_type`}
                                                        autoComplete="flase"
                                                        placeholder="Enter Properties name"
                                                        className={`form-control text-muted `}
                                                        style={{
                                                          marginTop: 10,
                                                          padding: 9,
                                                        }}
                                                      />
                                                    </Grid>
                                                    <Grid
                                                      item
                                                      lg={6}
                                                      md={6}
                                                      sm={12}
                                                      xs={12}
                                                    >
                                                      <Field
                                                        name={`attributes.${index}.value`}
                                                        autoComplete="flase"
                                                        placeholder="Enter value"
                                                        className={`form-control text-muted`}
                                                        style={{
                                                          marginTop: 10,
                                                          padding: 9,
                                                        }}
                                                      />
                                                    </Grid>
                                                  </Grid>
                                                </div>
                                              )
                                            )
                                          ) : (
                                            <Button
                                              variant="outlined"
                                              size="medium"
                                              type="button"
                                              onClick={() =>
                                                arrayHelpers.push("")
                                              }
                                            >
                                              {/* show this when user has removed all attributes from the list */}
                                              Add conditions
                                            </Button>
                                          )}
                                          {values.attributes.length !== 0 && (
                                            <Button
                                              variant="outlined"
                                              size="medium"
                                              type="button"
                                              onClick={() =>
                                                arrayHelpers.insert(
                                                  values.attributes.length + 1,
                                                  ""
                                                )
                                              }
                                              style={{
                                                marginTop: 10,
                                              }}
                                            >
                                              + Add
                                            </Button>
                                          )}
                                        </div>
                                      )}
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
                                        Create
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
              </div>
            </Grid>
            <Grid item lg={3} md={3} sm={12} xs={12}></Grid>
          </Grid>
        </div>
      </HeaderWrapper>
    </>
  );
};
export default Mint;
