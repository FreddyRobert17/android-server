
const list = [
    {
      id: 10,
      message: "new tweet",
      likes: [12,14,16, 8, 9],
      user: {
        id: 1,
        username: "android",
        description: "",
        website: "",
        photoUrl: "",
        created: "today"
      }
    },
    {
      id: 20,
      message: "Blown away by Android 14 Beta's battery prowess! My Pixel 7 Pro lasted 8+ hours of screen on time on a single charge! 🔋 That's definitely new for Pixel, especially without anything weird, or apps turning off data/battery saver mode.",
      likes: [],
      user: {
        id: 2,
        username: "Jeremiah Bonds",
        description: "",
        website: "",
        photoUrl: "https://cdn.pixabay.com/photo/2015/01/08/18/29/entrepreneur-593358_960_720.jpg",
        created: "today"
      }
    }
]

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

    return updatedTweet
}



const result = []

console.log(result)


