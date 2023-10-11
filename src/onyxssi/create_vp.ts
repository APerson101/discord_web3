import {
  JWTService,
  KeyDIDMethod,
  createPresentation,
  getSubjectFromVP
} from "@jpmorganchase/onyx-ssi-sdk";
import fs from "fs";
import path from "path";

const jwtService = new JWTService();
const didKey = new KeyDIDMethod();
export const createSignVp = async (holderKeys: string) => {

  const holderDidWithKeys = await didKey.generateFromPrivateKey(
    privateKeyBufferFromString(holderKeys)
  );
  const signedVcJwt = fs.readFileSync(path.join(__dirname, 'vc/proofOfIdentity.jwt'), 'utf-8'
  );


  const holderDid = getSubjectFromVP(signedVcJwt);

  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(new Date().getFullYear() + 1);

  const expirationDate = oneYearFromNow.toISOString();

  const vpOptions = {
    issuanceDate: new Date().toISOString(),
    expirationDate: expirationDate,
  };

  const vp = createPresentation(holderDid!, [signedVcJwt], vpOptions);

  writeToFile(path.resolve('onyxssi/vp/proofOfIdentity.json'), JSON.stringify(vp));

  const signedVp = await jwtService.signVP(holderDidWithKeys, vp);
  writeToFile(path.join(__dirname, 'vp/proofOfIdentity.jwt'),
    signedVp
  );
}

const writeToFile = (fileLocationPath: string, content: string) => {
  try {
    fs.writeFileSync(fileLocationPath, content);

  } catch (error) {
    console.log("Failed to write file");
    console.error(error);
  }

};

const privateKeyBufferFromString = (
  privateKeyString: string
): Uint8Array => {
  const buffer: Buffer = Buffer.from(privateKeyString, "hex");
  return new Uint8Array(buffer);
};


// create signed VC
// send them a copy to their dm
// give space for them to upload