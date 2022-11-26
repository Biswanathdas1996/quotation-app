export const getApiKey = (configs) => {
  return configs?.ChainExplorerAPIKEY;
};

export const getBaseApiUrl = (configs) => {
  return configs?.blockchain_base_api;
};

export const getNetworkName = (configs) => {
  return configs?.network_name;
};

export const openSeaURI = (configs, address, tokenId) => {
  return `${configs?.opensea_base_url}/assets/${getNetworkName(
    configs
  )}/${address}/${tokenId}/?force_update=true`;
};

export const networkURL = (configs) => {
  return configs?.network_url || "https://goerli.etherscan.io/address/";
};

export const getTransctionListAPI = (configs, account) => {
  return `${getBaseApiUrl(
    configs
  )}?module=account&action=txlist&address=${account}&sort=desc&page=1&offset=10&apikey=${getApiKey(
    configs
  )}`;
};

export const getContractTransctionListAPI = (configs, contractAddress) => {
  return `${getBaseApiUrl(
    configs
  )}?module=account&action=tokennfttx&contractaddress=${contractAddress}&page=1&offset=10000&sort=asc&apikey=${getApiKey(
    configs
  )}`;
};
