import * as xrpl from "xrpl";

const xrplclient = new xrpl.Client("wss://s.altnet.rippletest.net:51233")

var connectXrpl = async () => {
  console.log("connecting to ripple");
  await xrplclient.connect();
}

var disconnectXrpl = async () => {
  console.log("disconnecting from ripple");
  await xrplclient.disconnect();
}


export {connectXrpl, disconnectXrpl, xrplclient};
