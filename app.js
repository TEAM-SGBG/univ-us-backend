const express=require(`express`);
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv=require(`dotenv`);
const path = require('path');
dotenv.config({path: path.join(__dirname, `./credentials/.env`)});


const api = require('./routes/api');
const events = require('./routes/events')
const mypage = require('./routes/mypage')
const db = require('./routes/database');
const connectDB = require('./config/connectDB');

const app=express();
const port = process.env.PORT || 3001;

connectDB.connect((err)=>{
    if(err) console.error(`err : `+err);
    else console.log(`연결 성공`);
})

app.use(express.urlencoded({extended:true}));
app.use(express.json()); 

app.use(cookieParser());

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'keyboard cat',
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: 'session-cookie',
}));

app.get('/', (req, res) => {
    
    res.send('Hello World!');
});
app.use('/api', api);
app.use('/database',db);
app.use('/api/events', events);
app.use('/api/mypage', mypage);

 /* app.use(
    session({
        secret:'keyboard cat', 
        resave: false, 
        saveUninitialized:false,
        store: MongoStore.create({//session 저장장소
            mongoUrl: process.env.MONGO_TEST
        })
    })
);*/
app.listen(port,()=>{
    console.log(`Univ-us server start in port ${port}`);
})

