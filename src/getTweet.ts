import axios from 'axios';
import { extractSolanaTokenAddress } from './getTokenFromLlm';

export async function getTweet(screenname: string) {
  const tweets = [];
  const options = {
    method: 'GET',
    url: 'https://twitter-api45.p.rapidapi.com/timeline.php',
    params: {
      screenname: screenname
    },
    headers: {
      'x-rapidapi-key': '3c27a85d92msh0004e2185ea65e2p1236ffjsne9d67133a337',
      'x-rapidapi-host': 'twitter-api45.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    
    // Sort the tweets by timestamp in descending order to get the latest one
    const latestTweet = response.data.timeline.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

    // Push only the latest tweet
    if (latestTweet.author.screen_name === screenname) {
      tweets.push(latestTweet);
    }

    console.log("Latest tweet:", tweets);
    const token = await extractSolanaTokenAddress(tweets[0].text);
    console.log("Token:", token);
    return token
  } catch (error) {
    console.error(error);
  }
}

getTweet("elonmusk");
