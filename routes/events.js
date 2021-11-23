const express=require(`express`);
const router=express.Router();

const conn = require('../config/connectDB');

// 1. 행사 정보 불러오기 (추후 세부 조건 별로 가져오는 API 추가 예정)
router.get('/all_event', (req, res) => {
    
    conn.query(`select * from event`,(err,result)=>{
        if(err){
            res.status(400).json({
                success: false,
                message: err
            })
        }
        else{
            res.status(200).json({
                success: true,
                message: 'SUCCESS events/load_list',
                data: result
            })
        }
    })
})

// 2. 헹사 생성
router.post('/create', (req,res) => {
    const event_id = req.body.event_id
    const event_name = req.body.event_name
    const host_id = req.body.host_id
    conn.query(`insert into event(event_id, channel_owner_id, name) values(${event_id}, ${host_id}, ${event_name})`,(err,result)=>{
        if(err){
            res.status(400).json({
                success: false,
                message: err
            })
        }
        else{
            res.status(200).json({
                success: true,
                message: "events/create SUCCESS"
            })
        }
    })
})

// 3. 행사 삭제
router.delete('/delete', (req,res) => {
    const event_id = req.body.event_id
    conn.query(`select * from event_participant where event_id='${event_id}'`, (err, result) =>{
        if(result.length != 0){
            res.status(200).json({
                success: false,
                message: 'Still have appliments of the event. It must have zero appliment.'
            })
        }
    })
    conn.query(`delete from event where event_id=${event_id}`,(err,result)=>{
        if(err){
            res.status(400).json({
                success: false,
                message: err
            })
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
        if(result.length == 0){
            res.status(400).json({
                success: false,
                err: err,
                description: "user_id error"
            })
        }
    })
    conn.query(`select * from event where event_id=${event_id}`, (err, result) => {
        if(result.length == 0){
            res.status(400).json({
                success: false,
                err: err,
                message: "event_id error"
            })
        }
    })
    conn.query(`select * from event_participant where event_id=${event_id} and participant='${id_token}'`, (err, result) => {
        if(result.length != 0){
            res.status(400).json({
                success: false,
                err: err,
                message: "already applied"
            })
        }
        else{
            conn.query(`insert into event_participant(event_id, participant) values(${event_id}, '${id_token}')`,(err,result)=>{
                if(err){
                    res.status(400).json({
                        success: false,
                        message: err
                    })
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
router.delete('/cancel', (req, res) => {
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
            res.status(400).json({
                success: false,
                message: err
            })
        }else{
            res.status(200).json({
                success: true,
                message: "event/cancel SUCCESS"
            });
        }
    })
})

module.exports = router; 