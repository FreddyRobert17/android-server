const fs = require("fs");
const { findUser } = require('./users.service')
const { faker } = require("@faker-js/faker");

function createTweet(id, message) {
  const response = fs.readFileSync("./data/tweets.json");
  const user = findUser(id)

  const tweets = JSON.parse(response);

  const tweet = {
    id: faker.datatype.uuid(),
    message,
    likes: [],
    user: {
      id,
      username: user.username,
      website: "",
      photoUrl: "",
      created: faker.date.recent(1),
    },
  };

  tweets.unshift(tweet);

  const jsonString = JSON.stringify(tweets);

  fs.writeFileSync("./data/tweets.json", jsonString);

  return tweet;
}

function getAllTweets() {
  const response = fs.readFileSync("./data/tweets.json");

  const tweets = JSON.parse(response);

  return tweets;
}

function findTweet(tweetId) {
  const response = fs.readFileSync("./data/tweets.json");

  const tweets = JSON.parse(response);

  const tweet = tweets.find((element) => element.id == tweetId);

  if (!tweet) {
    console.log(`No tweet with ${tweetId} found`);
    return;
  }

  return tweet;
}

function likeTweet(tweet, userId){
    const index = tweet.likes.findIndex(element => element == userId)

    if(index >= 0){
        tweet.likes.splice(index, 1)
    } else {
        tweet.likes.push(userId)
    }
    
    const updatedTweet = {
        ...tweet,
        likes: tweet.likes,
    }


    const allTweets = getAllTweets();

    allTweets.forEach((element, index) => {
      if(element.id == tweet.id){
        allTweets[index] = tweet
      }
    })

    const jsonString = JSON.stringify(allTweets);

    fs.writeFileSync("./data/tweets.json", jsonString);

    return updatedTweet
}

function deleteTweet(tweetId){
    const tweets = getAllTweets();

    const isValidId = tweets.find(element => element.id == tweetId)

    if(!isValidId){
      throw new Error("Your id was not found")
    }

    const filteredTweets = tweets.filter(element => element.id != tweetId)

    const jsonString = JSON.stringify(filteredTweets);

    fs.writeFileSync("./data/tweets.json", jsonString);

    return tweetId;
}

module.exports = {createTweet, getAllTweets, findTweet, likeTweet, deleteTweet}
