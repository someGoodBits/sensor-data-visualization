const express = require("express");
require('dotenv').config()
const fs = require('fs');
const key  = fs.readFileSync(process.env.SSL_KEY_FILE_PATH);
const cert = fs.readFileSync(process.env.SSL_CERT_FILE_PATH);

const https = require('https');
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const PORT = 3000 ;

const server = https.createServer({
    key: key, 
    cert: cert , 
    passphrase: process.env.SSL_PASS_PHRASE
}, app);

const io = new Server(server);

io.on("connection",(socket) => {
    io.emit("client-connect",socket.id)
    
    socket.on('disconnect', () => {
        io.emit("client-disconnect",socket.id);
    });

    socket.on('sensor-data', (data) => {
        io.emit("sensor-data",data);
    });
})

app.use('/static', express.static('static'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname , '../public/index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname , '../public/dashboard.html'));
});

server.listen(PORT,()=>{
    console.info(`APP RUNNING ON PORT ${PORT}`) ;
});

