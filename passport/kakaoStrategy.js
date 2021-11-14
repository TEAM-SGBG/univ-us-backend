const passport=require(`passport`)
const KakaoStrategy = require(`passport-kakao`).Strategy;

const conn = require('../config/connectDB');

module.exports=()=>{
    passport.use(new KakaoStrategy({
        clientID:process.env.KAKAO_ID,
        callbackURL:'/auth/kakao/callback',//카카오로부터 인증결과를 받을 라우터 주소, 작성할 때 이 주소 사용
    }, (accessToken,refreshToken,profile,done)=>{
        console.log('kakao profile', profile);
        conn.query(`SELECT * FROM user WHERE id_token=${profile.id}`,(err,exUser)=>{
            if(err){
                console.log(err);
                done(err);
            }
            if(Object.keys(exUser).length!=0){//빈 객체가 아니면
                console.log(exUser);
                done(null,exUser);
            }else{
                conn.query(`INSERT INTO user(id_token,reg_type,email) VALUES(${profile.id},0,'${profile._json.kakao_account.email}')`,(error,result)=>{
                    if(error){
                        console.log(error);
                        done(error);
                    }
                    conn.query(`SELECT * FROM user WHERE id_token=${profile.id}`,(error2,newUser)=>{
                        if(error2){
                            console.log(error2);
                            done(error2);
                        }
                        done(null,newUser);
                    });
         
                });
            }

        });
    }));
}