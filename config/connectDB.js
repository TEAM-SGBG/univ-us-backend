const mysql = require('mysql');
const dotenv=require(`dotenv`);
const path = require('path');
dotenv.config({path: path.join(__dirname, `../.env`)});


const conn=mysql.createConnection({
    host: process.env.END_POINT,//사용할 db가 설치된 호스트 ip
    port: '3306',//DB설치할 때 사용자가 지정한 포트번호 기본값 3306
    user: 'admin',//DB의 user이름
    password: process.env.PW,//비번
    database: 'univus'//사용할 데이터베이스 명
});
const connectDB = async()=>{
    try{
        const conn=mysql.createConnection({
            host: process.env.END_POINT,//사용할 db가 설치된 호스트 ip
            port: '3306',//DB설치할 때 사용자가 지정한 포트번호 기본값 3306
            user: 'admin',//DB의 user이름
            password: process.env.PW,//비번
            database: 'univus'//사용할 데이터베이스 명
        });
        conn.connect((err)=>{
            if(err) console.error(`err : `+err);
            else console.log(`연결 성공`);
        });
    }catch(err){
        console.error(err);
    }
}


module.exports = conn;