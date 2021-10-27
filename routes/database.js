const mysql = require('mysql');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, "../credentials/.env")}); //dir수정

const connectDB = async()=>{
    try{
        const conn=mysql.createConnection({
            host: 'localhost',//사용할 db가 설치된 호스트 ip
            port: '3306',//DB설치할 때 사용자가 지정한 포트번호 기본값 3306
            user: 'root',//DB의 user이름
            password: process.env.MYSQL_PW,//비번
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

module.exports = connectDB;