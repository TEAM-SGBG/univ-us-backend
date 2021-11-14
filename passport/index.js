const passport=require(`passport`);
const kakao =require(`./kakaoStrategy`);
const google =require(`./googleStrategy`);
const conn = require('../config/connectDB');

module.exports=()=>{
    passport.serializeUser((user,done)=>{
        console.log(user)
        done(null,user[0].id_token);
    });

    passport.deserializeUser((id,done)=>{
        console.log(`deserialize`);
        conn.query(`SELECT * FROM user WHERE id_token=${id}`,(err,user)=>{
            console.log(user);
            done(null,user);
        });//유저정보 넘김
        
    });
    kakao();
    google();
};