import {Client, ECDSA, Wallet, xrpToDrops} from "xrpl";
import {xrplclient} from "./ripple_loader";
const client: Client = xrplclient;
class RippleFunctions {
  static async createAccount() {
    const wallet = Wallet.generate(ECDSA.ed25519);
    return wallet
  }

  // static async createAccount() {
  //   const fund_wallet = await xrplclient.fundWallet();
  //   const wallet = fund_wallet.wallet;
  //   return {address: wallet.address, seed: wallet.seed};
  // }

  static async sendXrp(destination: string, sender: string, amount: string, senderseed: string): Promise<string> {
    const wallet = Wallet.fromSeed(senderseed);
    const lls = (await client.getLedgerIndex()) + 20;
    const prepared = await client.autofill({
      TransactionType: "Payment",
      Account: sender,
      Amount: xrpToDrops(amount),
      Destination: destination,
      LastLedgerSequence: lls
    });
    const signed = wallet.sign(prepared);
    var txnResponse = await client.submitAndWait(signed.tx_blob);
    return txnResponse.id.toString();
  }

  static async getTransactions(address: string) {
    const response = await client.request({
      command: "account_info",
      account: address,
      ledger_index: "validated"
    });
    console.log(response.result.account_data);

  }


  static async getBalance(address: string) {
    const response = await client.request({
      command: "account_info",
      account: address,
      ledger_index: "validated"
    });
    return response.result.account_data.Balance;
  }
}

export {RippleFunctions};
