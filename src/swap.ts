import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, VersionedTransaction, sendAndConfirmTransaction } from '@solana/web3.js'
import { getAssociatedTokenAddress, NATIVE_MINT } from '@solana/spl-token'
import axios from 'axios'
import { API_URLS, TxVersion } from '@raydium-io/raydium-sdk-v2'
import bs58 from "bs58";
import dotenv from 'dotenv'
import { getPriorityFee, swapResponses, swapTransactions } from './transaction/serialize';
import { deserializeTransaction } from './transaction/deserialize';
import { executeTransaction } from './transaction/sign-execute';
dotenv.config();

const connection = new Connection(process.env.RPC_URL!);
const isV0Tx = true;
const owner = Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY!));
const slippage = 10;
export async function swap(tokenAddress: string, amount: number) {
  console.log("owner", owner.publicKey.toBase58())
  console.log("NATIVE_MINT", NATIVE_MINT)
  console.log("tokenAddress", tokenAddress)
  console.log("amount", amount)

  //Serialize the transaction
  const data = getPriorityFee();
  console.log("data", data);
  const swapResponse = swapResponses(NATIVE_MINT, tokenAddress, amount, slippage);
  console.log("swap response", swapResponse)

  const swapTransaction = swapTransactions(data, swapResponse, owner);
  console.log(swapTransactions)
  const ata = await getAssociatedTokenAddress(new PublicKey(tokenAddress), owner.publicKey);
  console.log("ata", ata)
  console.log(swapTransaction);

  //Deserialize the transaction
  const allTransactions = deserializeTransaction(swapTransaction);

  //Sign and send the transaction

  const transaction = executeTransaction(allTransactions, isV0Tx, owner, connection, swapTransaction);

}

swap("EsP4kJfKUDLfX274WoBSiiEy74Sh4tZKUCDjfULHpump", 0.0001 * LAMPORTS_PER_SOL);
