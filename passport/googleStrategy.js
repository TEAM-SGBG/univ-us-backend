const passport=require(`passport`)
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy

const conn = require('../config/connectDB');
module.exports=()=>{
    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_KEY,
        callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        
        console.log('google profile', profile);
        conn.query(`SELECT * FROM user WHERE id_token=${profile.id}`,(err,exUser)=>{
            if(err){
                console.log(err);
                done(err);
            }
            if(Object.keys(exUser).length!=0){//빈 객체가 아니면
                console.log(exUser);
                done(null,exUser);
            }else{
                conn.query(`INSERT INTO user(id_token,reg_type,email) VALUES(${profile.id},0,'${profile._json.email}')`,(error,result)=>{
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
    }
    ));


};
