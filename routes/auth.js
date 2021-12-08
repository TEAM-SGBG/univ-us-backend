const express  = require('express');
const isLogin=require(`./login/isLogin`);
const passport=require(`passport`);


const router=express.Router();
const myUrl=`https://univ-us.herokuapp.com`;

router.get('/',isLogin,(req,res)=>{//로그인 상태확인
    res.send(req.user);
});

router.get('/logout',(req,res)=>{
    req.logout();
    req.session.destroy();
    res.redirect(myUrl);//home으로 redirect
});

router.get('/kakao',(req,res,next)=>{
    req.session.redirect = req.query.redirectUrl;
    next();
},passport.authenticate('kakao'));//카카오 로그인 시작


router.get('/kakao/callback',passport.authenticate('kakao',{failureRedirect:myUrl,}),//로그인 성공여부 결과 받음
(req,res)=>{
    console.log(`로그인완료`);
        //console.log(req.session);//사용자 전체정보
        //req.user
    //req.session.passport.user//사용자 id만 
    res.redirect(myUrl+req.session.redirect);
});
//kakao 로그인은내부적으로 req.login호출하므로 직접 호출할 필요없음


router.get(`/google`,(req,res,next)=>{
    req.session.redirect = req.query.redirectUrl;
    next();
},passport.authenticate('google', { scope: ['email','profile'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', {failureRedirect: myUrl}), 
    (req, res) => {
    console.log("로그인 완료");
    res.redirect(myUrl+req.session.redirect);
});
  
module.exports=router;