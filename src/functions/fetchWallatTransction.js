import { getTransctionListAPI } from "../config";
export function fetchWallatTransction(configs, account) {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  return fetch(getTransctionListAPI(configs, account), requestOptions);
}
