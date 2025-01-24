import {Transaction, sendAndConfirmTransaction, VersionedTransaction}from "@solana/web3.js";


export async function executeTransaction(allTransactions, isV0Tx=true, owner, connection, swapTransactions){
    let idx = 0
    if (!isV0Tx) {
      for (const tx of allTransactions) {
        console.log(`${++idx} transaction sending...`)
        const transaction = tx as Transaction
        transaction.sign(owner)
        const txId = await sendAndConfirmTransaction(connection, transaction, [owner], { skipPreflight: true })
        console.log(`${++idx} transaction confirmed, txId: ${txId}`)
      }
    } else {
      for (const tx of allTransactions) {
        idx++
        const transaction = tx as VersionedTransaction
        transaction.sign([owner])
        const txId = await connection.sendTransaction(tx as VersionedTransaction, { skipPreflight: true })
        const { lastValidBlockHeight, blockhash } = await connection.getLatestBlockhash({
          commitment: 'finalized',
        })
        console.log(`${idx} transaction sending..., txId: ${txId}`)
        await connection.confirmTransaction(
          {
            blockhash,
            lastValidBlockHeight,
            signature: txId,
          },
          'confirmed'
        )
        console.log(`${idx} transaction confirmed`)
      }
      console.log(`total ${allTransactions.length} transactions`, swapTransactions)
      return swapTransactions;
  }
}