import {
  DIDWithKeys,
  JWTService,
  JsonSchema, KeyDIDMethod, SchemaManager,
  createCredentialFromSchema
} from "@jpmorganchase/onyx-ssi-sdk";
import fs from "fs";
import {camelCase} from "lodash";
import path from "path";
import {createSignVp} from "./create_vp";
const jwtService = new JWTService();
export const createDidKeyFromPrivateKey = async (ISSUER_KEY: string, HOLDER_KEY: string) => {
  const didKey = new KeyDIDMethod();
  const issuerDidKey: DIDWithKeys = await didKey.generateFromPrivateKey(
    privateKeyBufferFromString(ISSUER_KEY)
  );



  const holderDidWithKeys = await didKey.generateFromPrivateKey(
    privateKeyBufferFromString(HOLDER_KEY)
  );

  const vcDidKey = (await didKey.create()).did;

  const credentialType = "PROOF_OF_IDENTITY";

  const subjectData: Object = {
    name: "Bolanle Jadesola",
    picture: "test url",
    location: "Freetown, South Africa",
    nationalID: "012345",
  };


  const expirtyDate = new Date();
  expirtyDate.setFullYear(new Date().getFullYear() + 3);

  const expirationDate = expirtyDate.toISOString();

  const additionalParams = {
    id: vcDidKey,
    expirationDate: expirationDate,
  };

  const proofOfIdentitySchema = await SchemaManager.getSchemaFromFile(
    path.join(__dirname, 'schema/proofofperson.json')
  );

  const validation: any = SchemaManager.validateCredentialSubject(
    subjectData,
    proofOfIdentitySchema as JsonSchema
  );
  if (validation) {

    const vc = await createCredentialFromSchema(
      'schema/proofofperson.json',
      issuerDidKey.did,
      holderDidWithKeys.did,
      subjectData,
      credentialType,
      additionalParams
    );

    const jwt = await jwtService.signVC(issuerDidKey, vc);

    writeToFile(
      path.resolve('vc/', `${camelCase(vc.type[1])}.jwt`),
      jwt
    );

    console.log(JSON.stringify(vc, null, 2));

    writeToFile(
      'issued_vcs.json',
      JSON.stringify(vc, null, 2)
    );

    await createSignVp(HOLDER_KEY);
  } else {
    console.log("Schema Validation failed");
  }

};


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