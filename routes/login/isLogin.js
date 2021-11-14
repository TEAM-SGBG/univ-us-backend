const isLogin = (req, res) => {//로그인여부 
    if(req.isAuthenticated()) return true;
    else return false;
}

module.exports=isLogin;