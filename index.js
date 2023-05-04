const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const { createUser, isAuthUser } = require('./services/users.service')
const { createTweet, getAllTweets, findTweet, likeTweet} = require('./services/tweets.service')

const app = express()
const port = 3000
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

    console.log(createdUser)

    const token = jwt.sign({
        sub: createdUser,
        exp: Date.now() + 60 * 60 * 1000
    }, secret)

    res.send( { 
        access_token : token,
        id: createdUser.id,
    } )
})

app.post('/auth/login', async (req, res) => {
    if(!req.headers.authorization){
        res.send("You need to append your token in header")
        return
    }

    const token = req.headers.authorization.split(" ")[1]

    const payload = jwt.verify(token, secret)

    if(Date.now() > payload.exp){
        return res.status(401).send({error: 'Token expired'})
    }

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

    console.log(message, userId)

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

app.listen(port, function(){
    console.log(`Running server on port: ${port}`);
})