import { API_URLS } from "@raydium-io/raydium-sdk-v2";
import axios from "axios";

export async function getPriorityFee(){
    const { data } = await axios.get<{
        id: string
        success: boolean
        data: { default: { vh: number; h: number; m: number } }
    }>(`${API_URLS.BASE_HOST}${API_URLS.PRIORITY_FEE}`);
    return data;
}

export async function swapResponses(NATIVE_MINT, tokenAddress, amount, slippage){
        const { data: swapResponse } = await axios.get(
        `${API_URLS.SWAP_HOST
        }/compute/swap-base-in?inputMint=${NATIVE_MINT}&outputMint=${tokenAddress}&amount=${amount}&slippageBps=${slippage * 100}&txVersion=V0`
    ) // Use the URL xxx/swap-base-in or xxx/swap-base-out to define the swap type. 

}

export async function swapTransactions(data, swapResponse, owner){
    console.log("swap response", swapResponse)
    console.log("data", data)
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

    return swapTransactions;
}
