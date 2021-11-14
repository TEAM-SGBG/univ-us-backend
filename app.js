const express=require(`express`);
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv=require(`dotenv`);
const path = require('path');
const cors= require(`cors`);
const passport= require(`passport`);
dotenv.config({path: path.join(__dirname, `./credentials/.env`)});


const passportConfig=require(`./passport/index`);
const api = require('./routes/api');
const events = require('./routes/events')
const mypage = require('./routes/mypage')
const channel = require('./routes/channel');
const auth = require('./routes/auth');
const connectDB = require('./config/connectDB');
const MySQLStore = require('express-mysql-session');
const subscribes = require('./routes/subscribes')

const app=express();
passportConfig();
const port = process.env.PORT || 3001;

connectDB.connect((err)=>{
    if(err) console.error(`err : `+err);
    else console.log(`연결 성공`);
})

app.use(express.urlencoded({extended:true}));
app.use(express.json()); 
app.use(cors());

app.use(cookieParser());

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'keyboard cat',
    store: new MySQLStore({
        host: process.env.END_POINT,//사용할 db가 설치된 호스트 ip
        port: '3306',//DB설치할 때 사용자가 지정한 포트번호 기본값 3306
        user: 'admin',//DB의 user이름
        password: process.env.PW,//비번
        database: 'univus'//사용할 데이터베이스 명
    }),
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: 'session-cookie',
}));
app.use(passport.initialize());//req객체에 passport설정 심음
app.use(passport.session());//req.session에 passport정보 저장


app.get('/', (req, res) => {
    
    res.send('Hello World!');
});

app.use('/api', api);
app.use('/auth', auth);
app.use('/api/channel',channel);
app.use('/api/events', events);
app.use('/api/mypage', mypage);
app.use('/api/subscribes', subscribes)

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

