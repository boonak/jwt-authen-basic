require('dotenv').config()

var express = require('express')
var app = express()

var jwt = require('jsonwebtoken')

app.use(express.json())

var posts = [
    {
        username: "Boon",
        title: "Post 1"
    },
    {
        username: "Brown",
        title: "Post 2"
    },
]

app.get('/posts',authenticateToken, (req,res) => {
    console.log(req.user.name)
    res.json(posts.filter(post => post.username == req.user.name))
})

function authenticateToken(req,res,next){
    var authHeader = req.headers['authorization']
    var token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.listen(3000)
