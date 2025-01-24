import {extractSolanaTokenAddress} from "./getTokenFromLlm"
async function main() {
//  cosnt newTweet = await getTweet();
//Debugging
//console.log(newTweets);

//for(tweets of newTweets){
  //cosnt tokenAddress = await getTokenFromLlm(tweets)
  //if (tokenAddress !== "null") {
          //  console.log(`trying to execute tweet => ${tweet.contents}`)
            //Swap Logic Here 
        //}
//}
const response = await extractSolanaTokenAddress("The founder has 658k followers on instagram and they have an X post with 4M+ views.Esp4kjfkudlfx274wobsi1ey74h4tzkucd1fulhpump")

  console.log(response);
}

main();
