const isLogin=(req,res,next)=>{//로그인 여부
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
}
module.exports=isLogin;