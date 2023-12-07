require('dotenv').config()

var express = require('express')
var app = express()

var jwt = require('jsonwebtoken')

app.use(express.json())

var refreshTokens = []

app.post('/token', (req,res) => {
    var refreshToken = req.body.token
    if(refreshToken == null) return res.sendStatus(401)
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(401)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        var accessToken = generateAccessToken({ name: user.name })
        res.json({ accessToken: accessToken })
    })
})

app.delete('/logout', (req,res) => {
    refreshTokens = refreshTokens.filter(token => token != req.body.token)
    res.sendStatus(204)
})

app.post('/login', (req,res) => {
    var username = req.body.username
    var user = { name: username }
    var accessToken = generateAccessToken(user)
    var refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })

}



app.listen(4000)