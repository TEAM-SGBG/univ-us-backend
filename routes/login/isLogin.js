const isLogin = (req, res,next) => {//로그인여부 
    if(req.isAuthenticated()) {
        next();
        return true;
    }else return false;
}

module.exports=isLogin;