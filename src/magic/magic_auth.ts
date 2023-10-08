import {Magic} from "magic-sdk";




const authenticate = async () => {

  const customNodeOptions = {
    rpcUrl: 'https://rpc.ankr.com/fantom/', // Custom RPC URL
    chainId: 250, // Custom chain id
  }
  const magic = new Magic("pk_live_EA7FB93581081770", {
    network: customNodeOptions
  });
  /* Connect to any email input or enter your own */
  await magic.auth.loginWithEmailOTP({email: "abdulhadih48@gmail.com", showUI: false, deviceCheckUI: false});
}

const api = "pk_live_EA7FB93581081770";
const secret = "sk_live_69242AF5F6CAA19D"

authenticate().then((_) => { }).catch((e) => console.log(e));
