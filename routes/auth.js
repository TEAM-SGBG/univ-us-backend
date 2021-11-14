const express  = require('express');
const isLogin=require(`./login/isLogin`);
const passport=require(`passport`);
const bcrypt = require(`bcrypt`);
const conn = require('../config/connectDB');

const router=express.Router();


router.get('/',(req,res)=>{//로그인 상태확인
    if(isLogin){
        res.send(req.user);
    }else{
        res.send(false);
    }
});

router.get('/logout',(req,res)=>{
    req.logout();
    req.session.destroy();
    res.redirect(`/`);//home으로 redirect
});

router.get('/kakao',passport.authenticate('kakao'));//카카오 로그인 시작


router.get('/kakao/callback',passport.authenticate('kakao',{failureRedirect:'/',}),//로그인 성공여부 결과 받음
(req,res)=>{
    console.log(`로그인완료`);
    //console.log(req.session);//사용자 id만
    //req.session.passport.user//사용자 전체정보
    res.redirect('/');
});
//kakao 로그인은내부적으로 req.login호출하므로 직접 호출할 필요없음


router.get(`/google`,passport.authenticate('google', { scope: ['email','profile'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', {failureRedirect: '/'}), 
    (req, res) => {
    console.log("로그인 완료");
    res.redirect('/');
  });
  
module.exports=router;