import { decode } from "js-base64";
import swal from "sweetalert";

export function configMapping(token) {
  return JSON.parse(decode(token));
}

export function getConfigData(configs) {
  return configs;
}

export async function fetchConfigData() {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  // if (!sessionStorage.getItem("x-nft-config-token")) {
  return fetch("https://sosal.in/endpoints/GetConfig.php", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      // sessionStorage.setItem("x-nft-config-token", result);
      return result;
    })
    .catch((error) => {
      console.log("error", error);
      swal("Configration failed!", "Please contact admin", "warning").then(
        (value) => {
          // sessionStorage.setItem("x-nft-config-token", mockToken);
          // return mockToken;
          return false;
        }
      );
    });
  // } else {
  //   return false;
  // }
}
