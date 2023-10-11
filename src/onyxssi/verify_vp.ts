import {
  JWTService,
  KeyDIDMethod,
  getCredentialsFromVP,
  getSupportedResolvers,
  verifyDIDs,
  verifyPresentationJWT
} from "@jpmorganchase/onyx-ssi-sdk";
import fs from "fs";

const didKey = new KeyDIDMethod();
const jwtService = new JWTService();

export const verification = async (pth: string) => {
  // Instantiating the didResolver
  const didResolver = getSupportedResolvers([didKey]);
  console.log("\nReading an existing signed VP JWT\n");
  const signedVpJwt = fs.readFileSync(
    pth,
    "utf-8"
  );
  const isVpJwtValid = await verifyPresentationJWT(
    signedVpJwt,
    didResolver
  );

  if (isVpJwtValid) {
    const vcJwt = getCredentialsFromVP(signedVpJwt)[0];
    console.log(vcJwt)
    try {
      console.log("\nVerifying VC\n");
      const vcVerified = await verifyDIDs(vcJwt, didResolver);
      console.log(`\nVerification status: ${vcVerified}\n`);
      return vcVerified;
    } catch (error) {
      console.log(error);
      return false;
    }
  } else {
    console.log("Invalid VP JWT");
    return false;
  }
}
