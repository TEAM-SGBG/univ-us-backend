const express=require(`express`);
const router=express.Router();

const conn = require('../config/connectDB');

// 1. 행사 정보 불러오기 (추후 세부 조건 별로 가져오는 API 추가 예정)
router.get('/load_list', (req, res) => {
    conn.query(`select * from event`,(err,result)=>{
        if(err){
            console.log('/evnets/load_list')
            res.send(err);
        }else{
            res.send(result);
        }
    })

})

// 2. 헹사 생성
router.post('/create', (req,res) => {
    const event_name = req.body.event_name
    const host_id = req.body.host_id
    conn.query(`insert into event(event_id, channel_owner_id, name) values(${host_id}, ${event_name})`,(err,result)=>{
        if(err){
            res.send(err);
        }else{
            res.status(200).json({
                success: true,
                message: "events/create SUCCESS"
            });
        }
    })
})

// router.post('/c', (req, res) => {
//     const event_name = req.body.event_name
//     if(event_name != null){
//         res.send(event_name)
//     }else{
//         res.send('aaa')
//     }
    
// })

// 3. 행사 삭제
router.post('/delete', (req,res) => {
    const event_id = req.body.event_id
    conn.query(`DELETE FROM event WHERE event_id=${event_id}`,(err,result)=>{
        if(err){
            res.send(err);
        }else{
            res.status(200).json({
                success: true,
                message: "events/delete SUCCESS"
            });
        }
    })
})

// 4. 행사 신청하기
router.post('/apply', (req, res) => {
    const id_token = req.body.id_token
    const event_id = req.body.event_id
    conn.query(`select * from user where id_token='${id_token}'`, (err, result) => {
        if(result == null){
            res.status(400).json({
                success: false,
                err: err,
                description: "user_id error"
            })
        }
    })
    conn.query(`select * from event where event_id=${event_id}`, (err, result) => {
        if(result == null){
            res.status(400).json({
                success: false,
                err: err,
                message: "event_id error"
            })
        }
    })
    conn.query(`select * from event_participant where event_id=${event_id} and participant='${id_token}'`, (err, result) => {
        if(result){
            res.status(400).json({
                success: false,
                err: err,
                message: "already applied"
            })
        }
        else{
            // TODO: event_participant가 관계 테이블이므로 (event_id(FK), id_token(FK)) 면 충분하지 않을까 싶음
            // TODO: 따라서 evnet_participant의 id 테이블을 없애거나 자동 증가하도록 수정할 필요가 있음
            conn.query(`insert into event_participant(id, event_id, participant) values(2, ${event_id}, '${id_token}')`,(err,result)=>{
                if(err){
                    res.send(err);
                }else{
                    res.status(200).json({
                        success: true,
                        message: "event/apply SUCCESS"
                    });
                }
            })
        }
    })
})

// 4. 행사 신청 취소하기(유저 입장)
router.post('/cancel', (req, res) => {
    const id_token = req.body.id_token
    const event_id = req.body.event_id
    conn.query(`select * from user where id_token='${id_token}'`, (err, result) => {
        if(result == null){
            res.status(400).json({
                success: false,
                err: err,
                description: "user_id error"
            })
        }
    })
    conn.query(`select * from event where event_id=${event_id}`, (err, result) => {
        if(result == null){
            res.status(400).json({
                success: false,
                err: err,
                description: "event_id error"
            })
        }
    })
    conn.query(`delete from event_participant where participant='${id_token}' and event_id=${event_id}`,(err,result)=>{
        if(err){
            res.send(err);
        }else{
            res.status(200).json({
                success: true,
                message: "event/cancel SUCCESS"
            });
        }
    })
})

/**
 * <행사 쪽>
 * 1. 행사 신청하기
 * 2. 행사 정보 가져오기
 * 3. 전체 행사 목록 리스트로 가져오기
 * 4. 수시 행사 목록 리스트로 가져오기
 * 5. 정시 행사 목록 리스트로 가져오기
 * 
 * <마이 페이지 쪽>
 * 1. 행사 신청 취소
 * 2. 신청한 행사 가져오기
 * 3. 관심있는 행사 가져오기
 * 4. 구독중인 채널 정보 가져오기
 * 5. 회원정보 가져오기
 * 6. 회원정보 수정하기
 * 
 * <구독 기능>
 * 1. 구독하기
 * 2. 구독 취소
 * 3. 구독 리스트 가져오기
 */

module.exports = router; 