import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, VersionedTransaction, sendAndConfirmTransaction  } from '@solana/web3.js'
import { getAssociatedTokenAddress, NATIVE_MINT } from '@solana/spl-token'
import axios from 'axios'
import { API_URLS, TxVersion } from '@raydium-io/raydium-sdk-v2'
import bs58 from "bs58";
import dotenv from 'dotenv'
dotenv.config();

const connection = new Connection(process.env.RPC_URL!);
const isV0Tx =true;
const owner = Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY!));
const slippage = 10;
export async function swap(tokenAddress: string, amount: number) {
console.log("owner", owner.publicKey.toBase58())
console.log("NATIVE_MINT", NATIVE_MINT)
console.log("tokenAddress", tokenAddress)
console.log("amount", amount)

//Serialize the transaction
    const { data } = await axios.get<{
        id: string
        success: boolean
        data: { default: { vh: number; h: number; m: number } }
    }>(`${API_URLS.BASE_HOST}${API_URLS.PRIORITY_FEE}`);
    console.log("data",data);
    const { data: swapResponse } = await axios.get(
        `${API_URLS.SWAP_HOST
        }/compute/swap-base-in?inputMint=${NATIVE_MINT}&outputMint=${tokenAddress}&amount=${amount}&slippageBps=${slippage * 100}&txVersion=V0`
    ) // Use the URL xxx/swap-base-in or xxx/swap-base-out to define the swap type. 
    console.log("swap response", swapResponse)
    const { data: swapTransactions } = await axios.post<{
        id: string
        version: string
        success: boolean
        data: { transaction: string }[]
    }>(`${API_URLS.SWAP_HOST}/transaction/swap-base-in`, {
        computeUnitPriceMicroLamports: String(data.data.default.h),
        swapResponse,
        txVersion: 'V0',
        wallet: owner.publicKey.toBase58(),
        wrapSol: true,
        unwrapSol: false,
    })
    console.log(swapTransactions)
    const ata = await getAssociatedTokenAddress(new PublicKey(tokenAddress), owner.publicKey);
    console.log("ata",ata)
    // console.log({
    //     computeUnitPriceMicroLamports: String(data.data.default.h),
    //     swapResponse,
    //     txVersion: 'V0',
    //     wallet: owner.publicKey.toBase58(),
    //     wrapSol: true,
    //     unwrapSol: false,
    //     // outputMint: ata.toBase58()
    // })
    console.log(swapTransactions);

    //Deserialize the transaction
    const allTxBuf = swapTransactions.data.map((tx) => Buffer.from(tx.transaction, 'base64'))
    const allTransactions = allTxBuf.map((txBuf) =>
      isV0Tx ? VersionedTransaction.deserialize(txBuf) : Transaction.from(txBuf)
    )

    //Sign and send the transaction

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
}

}

swap("EsP4kJfKUDLfX274WoBSiiEy74Sh4tZKUCDjfULHpump", 0.0001 * LAMPORTS_PER_SOL);
