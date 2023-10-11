import {Wallet} from "xrpl";
import {store} from "./loaders";
import {createDidKeyFromPrivateKey} from "./onyxssi/create_did";
import {RippleFunctions} from "./ripple_commands";
class FirebaseMethods {
  static async createAccount(username: string, guildName: string, name: string, insitution: string, instagram: string) {
    var wallet = await this.createRippleAddress();
    var walletIss = await this.createRippleAddress();
    await createDidKeyFromPrivateKey(
      walletIss.privateKey.slice(2) + walletIss.publicKey.slice(2),
      wallet.privateKey.slice(2) + wallet.publicKey.slice(2),
      name, insitution, instagram
    )

    // await this.saveAccount(username, wallet.seed, guildName, wallet.address);
    return {address: wallet.address, seed: wallet.seed};
  }
  static async saveAccount(username: string, seed: string, server: string, address: string) {
    await store.collection(`discord/${server}/users`).add({
      username: username, seed: seed, address: address
    });
  }
  static async getAddressFromUsername(username: string, server: string): Promise<string> {
    var docs = await store.collection(`discord/${server}/users`)
      .where('username', "==", username)
      .limit(1)
      .get();
    return docs.docs[0].get('address');
  }
  static async getAccountFromUsername(username: string, server: string) {
    var docs = await store.collection(`discord/${server}/users`)
      .where('username', "==", username)
      .limit(1)
      .get();
    return docs.docs[0].data();
  }

  static async createRippleAddress(): Promise<Wallet> {
    return await RippleFunctions.createAccount();
  }

  static async getSeedFromUsername(username: string, guild: string): Promise<string> {
    var docs = await store.collection(`discord/${guild}/users`).where('username', "==", username).limit(1).get();
    return docs.docs[0].get('seed');
  }

  static async saveTransaction(username: string, txnID: string) {
    await store.collection(`discordTxns/${username}/transactions`).add({id: txnID});
  }
  static async getTransactions(username: string) {
    var txnsDocs = await store.collection(`discordTxns/${username}/transactions`).get();
    const allTxns: string[] = [];
    for (const doc in txnsDocs.docs) {
      const element: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData> = txnsDocs[doc];
      var data = element.data();
      allTxns.push(data.id);
    }
    return allTxns;
  }
}

export {FirebaseMethods};
