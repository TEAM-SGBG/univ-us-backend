const express=require(`express`);
const router=express.Router();

const conn = require('../config/connectDB');

/**
 * <마이 페이지 쪽>
 * 1. 행사 신청 취소
 * 2. 신청한 행사 가져오기
 * 3. 관심있는 행사 가져오기
 * 4. 구독중인 채널 정보 가져오기
 * 5. 회원정보 가져오기
 * 6. 회원정보 수정하기
 */

// 1. 신청한 행사 전부 가져오기
router.post('/all_event', (req, res) => {
    const id_token = req.body.id_token
    
    conn.query(`select * from event_participant where participant='${id_token}'`,(err,result) => {
        if(err){
            res.send(err)
        }else{
            list = []
            for(var obj of result){
                list.push(obj.event_id)
            }
            // const r = result[0].event_id
            // console.log(r.event_id)
            res.send(list) // evnet_id 리스트를 리턴
        }
    })

})

// 2. 회원정보 가져오기
router.post('/my_info', (req, res) => {
    const id_token = req.body.id_token
    conn.query(`select * from user where id_token='${id_token}'`, (err, result) => {
        if(err){
            res.send(err)
        }
        else{
            res.send(result)
        }
    })
})

// 3. 회원정보 수정하기
router.post('/modify_info', (req, res) => {
    const id_token = req.body.id_token
    const new_password = req.body.password
    const new_phone_num = req.body.phone_num
    conn.query(`update user set pw='${new_password}', phone_num='${new_phone_num}' where id_token='${id_token}'`, (err, result) => {
        if(err){
            res.send(err)
        }
        else{
            res.send(result)
        }
    })
})

// 4. 



module.exports = router; 