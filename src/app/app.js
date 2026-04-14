const path=require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});
const express=require('express');
const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } =require('@prisma/adapter-pg') ;
const adapter=new PrismaPg({
    connectionString: process.env.DATABASE_URL
});
const socketHandler=require('../app/routes/socket.js');


const passport=require('./passport.js')
const cors=require('cors');
const app=express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors:{
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
module.exports={io};
const routes=require('./routes/router.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  expressSession({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000
    },
    secret: 'a santa at nasa',
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      new PrismaClient({adapter}),
      {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);
app.use(passport.session());
app.use('/', routes);
socketHandler(io);


server.listen(3000, (err)=>{
    if(err){
        throw err;
    }
    console.log('Server is running on: 127.0.0.1:3000');
})