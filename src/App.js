import React, { useEffect, useState, createContext } from "react";
import "./App.css";
import "./index.css";
import Routes from "./Routes";
import "fontsource-roboto";
import CssBaseline from "@material-ui/core/CssBaseline";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import { getIcon } from "./utils/currencyIcon";
import { currentNeteork } from "./utils/currentNeteork";
import { getcurrentNetworkId } from "./CONTRACT-ABI/connect";
import { useLocation } from "react-router-dom";
import { fetchConfigData, configMapping } from "./getConfigaration";

const mockToken =
  "eyJpZCI6IjEiLCJibG9ja2NoYWluIjoiRXRoZXJldW0iLCJuZXR3b3JrX2lkIjoiNSIsIm5ldHdvcmtfbmFtZSI6ImdvZXJsaSIsImN1cnJlbmN5X3N5bWJvbCI6IkVUSCIsIm5ldHdvcmtfdXJsIjoiaHR0cHM6XC9cL2dvZXJsaS5ldGhlcnNjYW4uaW8iLCJDaGFpbkV4cGxvcmVyQVBJS0VZIjoiV0NWRFU1Mjc0OFdXNEY3RUtERURCODlIS0g0MUJJQTROMiIsIldhbGxldFByaXZhdGVLZXkiOiI4YzU5NDhlMGRiYzQxNjNiMTc2ZWE4Y2ZiN2NhNmEzZDJlOWM1MmQyZDFkZjdjMzYzZmFiYWJiOGYyZWI2ZjQyIiwiSW5mdXJhUHJvamVjdElkIjoiMjQwMjJmZGE1NDVmNDFiZWI1OTMzNGJkYmFmM2VmMzIiLCJJbmZ1cmFOb2RlVVJMIjoiaHR0cHM6XC9cL2dvZXJsaS5pbmZ1cmEuaW9cL3YzXC8yNDAyMmZkYTU0NWY0MWJlYjU5MzM0YmRiYWYzZWYzMiIsIldlYjNTdG9yYWdlIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnpkV0lpT2lKa2FXUTZaWFJvY2pvd2VERXpNa1JoTmpFMk4yVTBPVFkyWTJNMk9EQmxNak5sTnpkak1tTTVOakkyWVdaRlFqa3lOek1pTENKcGMzTWlPaUozWldJekxYTjBiM0poWjJVaUxDSnBZWFFpT2pFMk5qQXhPVEl4TmpJM01ERXNJbTVoYldVaU9pSjBaWE4wSW4wLm5yV3lHLVJQQ3R5MjhHUUxQT2ZqQ2FjWW9Pb1VSYXJDeW82bmgzdDBRQ1kiLCJhd3NBY2Nlc3NLZXlJZCI6bnVsbCwiYXdzU2VjcmV0QWNjZXNzS2V5IjpudWxsLCJzdGF0dXMiOiIxIiwiYmxvY2tjaGFpbl9iYXNlX2FwaSI6Imh0dHBzOlwvXC9hcGktZ29lcmxpLmV0aGVyc2Nhbi5pb1wvYXBpIiwib3BlbnNlYV9iYXNlX3VybCI6Imh0dHBzOlwvXC90ZXN0bmV0cy5vcGVuc2VhLmlvIiwibXNfZHluYW1pY3NfYmFzZV91cmwiOiJodHRwczpcL1wvZHluYW1pY3N3cmFwcGVyLmF6dXJld2Vic2l0ZXMubmV0XC9hcGkiLCJtc19keW5hbWljc19jbGllbnRfaWQiOiI2NTk5YjI2Yi05NTFiLTRhNWItODg3Yy00YWY1N2M1N2Y2M2YifQ==";

export const ConfigContext = createContext(null);

const App = () => {
  const [icon, setIcon] = useState(null);
  const [symbol, setSymbol] = useState(null);
  const [accessable, setAccessable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState(null);
  const [config, setConfig] = useState(null);
  const location = useLocation();

  window?.ethereum?.on("chainChanged", async (chainId) => {
    const networkId = await getcurrentNetworkId();
    sessionStorage.setItem("currentyNetwork", networkId);
    getCurrencyInfo();
    window.location.reload(true);
  });

  window?.ethereum?.on("accountsChanged", (accounts) => {
    window.location.reload(true);
  });

  useEffect(() => {
    getCurrencyInfo();
    getConfig();
  }, []);

  const getConfig = async () => {
    setLoading(true);

    const configResponce = await fetchConfigData();
    const decodedConfig = configMapping(configResponce || mockToken);
    console.log("--configResponce--->", decodedConfig);
    setConfig(decodedConfig);
    const currentNetworkId = await getcurrentNetworkId();
    setActiveNetwork(decodedConfig?.network_name);
    if (currentNetworkId.toString() !== decodedConfig?.network_id?.toString()) {
      setAccessable(false);
    } else {
      setAccessable(true);
    }
    setLoading(false);
  };

  const getCurrencyInfo = () => {
    setIcon(getIcon());
    setSymbol(currentNeteork());
  };

  console.log("----activeNetwork>", activeNetwork);
  const navBarLessRoutes = ["/"];
  return (
    <ConfigContext.Provider value={config}>
      <CssBaseline />
      {navBarLessRoutes.indexOf(location.pathname) === -1 && (
        <Header icon={icon} symbol={symbol} />
      )}
      {accessable ? (
        <Routes />
      ) : (
        <>
          {!loading ? (
            <h2 style={{ textAlign: "center", margin: "12.5rem" }}>
              Please change the blockchain network to{" "}
              <b>{activeNetwork?.toUpperCase()}</b>
            </h2>
          ) : (
            <div
              style={{ textAlign: "center", margin: "12.5rem" }}
              className="loader_background"
            >
              <h1 className="loader_ui">Loading configurations...</h1>
            </div>
          )}
        </>
      )}
      <Footer />
    </ConfigContext.Provider>
  );
};

export default App;
