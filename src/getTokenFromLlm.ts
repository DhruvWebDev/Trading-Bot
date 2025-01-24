import axios from "axios";

export async function extractSolanaTokenAddress(tweet:string) {
 const options = {
   method: 'POST',
   url: 'https://open-ai21.p.rapidapi.com/conversationgpt35',
   headers: {
     'x-rapidapi-key': '3c27a85d92msh0004e2185ea65e2p1236ffjsne9d67133a337',
     'x-rapidapi-host': 'open-ai21.p.rapidapi.com',
     'Content-Type': 'application/json'
   },
   data: {
     messages: [
       {
         role: 'user',
         content: `You are an AI agent tasked with determining if the provided tweet is about buying a Solana token. Your job is to return **only** the Solana token address if it is present in the tweet. If the tweet contains no Solana token address, return \`null\`.

- The Solana token address will be clearly visible in the tweet, and it will look like a string of characters such as \`123456tfgfgdx\` (without any special format like \`sol_address="123456tfgfgdx"\`).

If no Solana token address is found, return \`null\`. If a valid address is found, return it exactly as it appears in the tweet.

Return your response as a **JSON object** in the following format:

\`\`\`json
{
"output": "token address or null"
}
\`\`\`

### Here's the tweet for analysis:

**Tweet:** "${tweet}"`
       }
     ],
     web_access: false,
     system_prompt: '',
     temperature: 0.9,
     top_k: 5,
     top_p: 0.9,
     max_tokens: 256
   }
 };

 try {
   const response = await axios.request(options);
   console.log(response);
    const parsedResponse = JSON.parse(response.data.result as unknown as string);
   return parsedResponse.output;
 } catch (error) {
   console.error(error);
   return { output: null };
 }
}
