import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";

export const uploadFileToIpfs = async (configs, file) => {
  const client = new Web3Storage({
    token: configs?.Web3Storage,
  });

  const fileName = file[0].name;
  const results = await client.put(file, {});

  // return `https://ipfs.io/ipfs/${results}/${fileName}`;
  return `https://${results}.ipfs.dweb.link/${fileName}`;
};

export const createAnduploadFileToIpfs = async (configs, metaData) => {
  const client = new Web3Storage({
    token: configs?.Web3Storage,
  });
  const blob = new Blob([JSON.stringify(metaData)], {
    type: "application/json",
  });
  const files = [new File([blob], "ipfs.json")];
  const resultsSaveMetaData = await client.put(files, {});
  // return `https://ipfs.io/ipfs/${resultsSaveMetaData}/ipfs.json`;
  return `https://${resultsSaveMetaData}.ipfs.dweb.link/ipfs.json`;
};

export const getIpfsUrI = (fingerprint) => {
  return `https://ipfs.io/ipfs/${fingerprint}`;
};
