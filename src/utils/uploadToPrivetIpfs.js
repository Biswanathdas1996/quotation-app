import { create } from "ipfs-http-client";
import Resizer from "react-image-file-resizer";

const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      350,
      350,
      "PNG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });

const client = create({
  url: "https://ipfs-nfts-container-new-ssl.eastus2.azurecontainer.io/",
});

export const uploadFileToIpfs = async (configs, file) => {
  const image = await resizeFile(file[0]);

  try {
    const result = await client.add(image);
    console.log("====>", result?.path);

    return `https://ipfs.io/ipfs/${result?.path}`;
  } catch (err) {
    console.log("--->", err);
    return null;
  }
};

export const createAnduploadFileToIpfs = async (configs, metaData) => {
  try {
    const result = await client.add(JSON.stringify(metaData));
    console.log("+++++result?.path+++++", result?.path);

    return `https://ipfs.io/ipfs/${result?.path}`;
  } catch (err) {
    console.log("--->", err);
    return null;
  }
};

export const getIpfsUrI = (fingerprint) => {
  return `https://ipfs.io/ipfs/${fingerprint}`;
};
