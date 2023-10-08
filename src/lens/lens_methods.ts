import {isRelayerResult} from "@lens-protocol/client";
import {ethers} from "ethers";

import {LensClient, development} from "@lens-protocol/client";

const lensClient = new LensClient({
  environment: development
});


export const createLensProfile = async (handle: string) => {
  const profileCreateResult = await lensClient.profile.create({
    handle: handle,
  });
  const profileCreateResultValue = profileCreateResult.unwrap();
  if (!isRelayerResult(profileCreateResultValue)) {
    console.log(`Something went wrong`, profileCreateResultValue);
    return;
  }
  console.log(
    `Transaction was successfuly broadcasted with txId ${profileCreateResultValue.txId}`
  );


}
export const login = async (privateKey: string) => {

  const lensClient = new LensClient({
    environment: development,
  });

  const wallet = new ethers.Wallet(privateKey);
  const address = await wallet.getAddress();
  const challenge = await lensClient.authentication.generateChallenge(address);
  const signature = await wallet.signMessage(challenge);

  await lensClient.authentication.authenticate(address, signature);
  await lensClient.authentication.isAuthenticated()
}


