import {
  JWTService,
  KeyDIDMethod,
  getCredentialsFromVP,
  getSupportedResolvers,
  verifyDIDs,
  verifyPresentationJWT,
  verifySchema
} from "@jpmorganchase/onyx-ssi-sdk";
import fs from "fs";

const didKey = new KeyDIDMethod();
const jwtService = new JWTService();

const verification = async () => {
  // Instantiating the didResolver
  const didResolver = getSupportedResolvers([didKey]);
  console.log("\nReading an existing signed VP JWT\n");
  const signedVpJwt = fs.readFileSync(
    'vp/proofOfIdentity.jwt',
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
      if (vcVerified) {
        const isSubjectDataValid = verifySchema(vcJwt, false);
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Invalid VP JWT");
  }
}

verification();