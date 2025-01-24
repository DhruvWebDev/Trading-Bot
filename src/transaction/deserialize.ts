import {VersionedTransaction,Transaction}from "@solana/web3.js";
export async function deserializeTransaction(swapTransactions: any, isV0Tx: boolean = true) {
    const allTxBuf = swapTransactions.data.map((tx) => Buffer.from(tx.transaction, 'base64'))
    const allTransactions = allTxBuf.map((txBuf) =>
      isV0Tx ? VersionedTransaction.deserialize(txBuf) : Transaction.from(txBuf)
    )
    return allTransactions;
}