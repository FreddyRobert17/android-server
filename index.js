const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const multer = require('multer')
const { createUser, isAuthUser, findUser, updateUser } = require('./services/users.service')
const { createTweet, getAllTweets, findTweet, likeTweet, deleteTweet } = require('./services/tweets.service')

const app = express()
const port = 3000
const upload = multer({dest: 'uploads/'})
const secret = 'secret_token_key' // process.env.SECRET

app.use(bodyParser.json())

app.post('/auth/register', (req, res) => {
    const body = req.body

    if(body.email == undefined || body.password == undefined || body.username == undefined){
        return res.json({
            message: "Fill correctly email and username values"
        })
    }

    const createdUser = createUser(body)

    const token = jwt.sign({
        sub: createdUser,
        exp: Date.now() + 60 * 60 * 1000
    }, secret)

    res.send( { 
        access_token : token,
        id: createdUser.id,
        username: createdUser.username,
        email:createdUser.email,
        password: createdUser.password
    } )
})

app.post('/auth/login', async (req, res) => {
    const token = req.headers.authorization.split(" ")[1]

    const user = req.body

    const isAuth =  isAuthUser(user)
    
    if(!isAuth){
        res.send("Your user was not found, you need to login")
        return
    }

    res.send( { access_token : token } )
})

app.get('/tweets/all', (req, res) => {
    const tweets = getAllTweets(); 
    res.json(tweets)
})

app.post('/tweets/create', (req, res) => {
    const { message, userId  } = req.body

    if(!message){
        return res.send("You have to send a message in body")
    }

    const tweet =  createTweet(userId, message)

    res.json(tweet)
})

app.post('/tweets/like/:userId&:tweetId', (req, res) => {
    const { userId, tweetId } = req.params

    const tweet = findTweet(tweetId);

    const updatedTweet = likeTweet(tweet, userId);

    res.json(updatedTweet)
})

app.delete('/tweets/:tweetId', (req, res) => {
    const { tweetId } = req.params

    const deletedTweetId = deleteTweet(tweetId)

    return res.json({
        id: deletedTweetId
    })
})

app.post('/user/updateUserData', upload.single('image') , (req, res) => {
    const filename = req.file?.filename;
    const { userId, username, email, password } = req.body;
    let imagePath = "";

    const updatedUser = updateUser(userId, username, email, password);

    const baseUrl = 'https://test.infoworldtrips.club';

    if(filename){
        imagePath = `${baseUrl}/uploads/${filename}`;
    }

    res.json({
        photoUrl: imagePath,
        ...updatedUser,
    })
})



app.listen(port, function(){
    console.log(`Running server on port: ${port}`);
})