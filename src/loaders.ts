import * as admin from "firebase-admin";
import {cert} from "firebase-admin/app";
const app = admin.initializeApp({credential: cert("../serviceaccount.json")});
const store = admin.firestore();
export {store};
