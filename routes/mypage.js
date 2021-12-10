const express=require(`express`);
const router=express.Router();

const conn = require('../config/connectDB');
const isLogin = require('../routes/login/isLogin.js');

/**
 * <마이 페이지 쪽>
 * // 1. 행사 신청 취소 -> event.js 쪽에 있음
 * 2. 신청한 행사 가져오기
 * // 3. 관심있는 행사 가져오기 -> 개발 예정
 * 4. 구독중인 채널 정보 가져오기
 * 5. 회원정보 가져오기
 * 6. 회원정보 수정하기
 */

// 1. 신청한 행사 전부 가져오기
router.get('/applied_event', isLogin, (req, res) => {
    const id_token = req.session.passport.user
    //const id_token = req.query.id_token
    
    conn.query(`select * from event where event_id 
                    in (select event_id from event_participant where participant='${id_token}')`,(err,result) => {
        if(err){
            res.status(400).json({
                success: false,
                err,
                message: '[ERROR] GET:mypage/applied_event'
            })
        }
        else{
            // const r = result[0].event_id
            // console.log(r.event_id)
            res.status(200).json({
                success: true,
                message: '[SUCCESS] GET:mypage/applied_event',
                data: result
            })
        }
    })
})

// 2. 회원정보 가져오기
router.get('/my_info', isLogin, (req, res) => {
    const id_token = req.session.passport.user
    conn.query(`select * from user where id_token='${id_token}'`, (err, result) => {
        if(err){
            res.status(400).json({
                success: false,
                message: err
            })
        }
        else{
            res.status(200).json({
                success: true,
                message: 'SUCCESS events/my_info',
                data: result
            })
        }
    })
})

// 3. 회원정보 수정하기
router.put('/modify_info', isLogin, (req, res) => {
    const id_token =req.session.passport.user
    const new_phone_num = req.user.phone_num
    conn.query(`update user set phone_num='${new_phone_num}' where id_token='${id_token}'`, (err, result) => {
        if(err){
            res.status(400).json({
                success: false,
                message: err
            })
        }
        else{
            res.status(200).json({
                success: true,
                message: 'SUCCESS events/modify_info'
            })
        }
    })
})

// // 4. 구독 정보 가져오기
// router.get('/subscribe_info', (req, res) => {
//     const id_token = req.user.id_token
    
//     conn.query(`select * from channel_subscriber where subscriber_id='${id_token}'`,(err,result) => {
//         if(err){
//             res.status(400).json({
//                 success: false,
//                 message: err
//             })
//         }
//         else{
//             list = []
//             for(var obj of result){
//                 list.push(obj.channel_id)
//             }
//             res.status(200).json({
//                 success: true,
//                 message: 'SUCCESS mypage/subscribe_info',
//                 data: list
//             })
//         }
//     })
// })

router.get(`/subscribe_info`,isLogin,(req,res)=>{
    console.log(req.session);
    conn.query(`SELECT* FROM channel_subscriber JOIN channel ON channel.channel_id=channel_subscriber.channel_id WHERE subscriber_id=?`,[req.session.passport.user],(err,result)=>{
        if(err){
            console.log(err);
            res.status(400).json({
                success: false,
                message: err,
            });
        }else{
            console.log(result);
            res.status(200).json({
                success:true,
                message:'SUCCESS GET:channel/subscribe',
                data:result,
            });
        }
    });
});//구독한 채널 정보 가져옴

// . 특정 사용자가 좋아요를 누른 행사 리스트 가져오기 /api/events/user_like_event_list
router.get('/user_like_event_list', (req, res) => {
    const id_token = req.session.passport.user
    conn.query(`select * from event where event_id 
                    in (select event_id from event_like where user_id='${id_token}')`, (err, result) => {
        if(err){
            res.status(400).json({
                success: false,
                err: err,
                message: "[ERROR] GET:api/mypage/user_like_event_list"
            })
        }
        else{
            res.status(200).json({
                success: true,
                message: "[SUCCESS] GET:api/user_like_event_list",
                data: result
            })
        }
    })
})

module.exports = router; 