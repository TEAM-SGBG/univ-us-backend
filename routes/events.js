const express=require(`express`);
const router=express.Router();

const conn = require('../config/connectDB');

// 1. 전체 행사 정보 불러오기
router.get('/all_event', (req, res) => {
    
    conn.query(`select * from event`,(err,result)=>{
        if(err){
            res.status(400).json({
                success: false,
                err: err,
                message: 'ERROR events/all_event'
            })
        }
        else{
            res.status(200).json({
                success: true,
                message: 'SUCCESS events/all_event',
                data: result
            })
        }
    })
})

// 2. 특정 카테고리 행사 정보 불러오기
router.get('/category_event', (req, res) => {
    const category = req.query.category
    var category_num = 0;
    switch (category) {
        case 'sushi':
            category_num = 1;
            break;
        case 'jungshi':
            category_num = 2;
            break;
        case 'fair':
            category_num = 3;
            break;
        default:
            break;
    }
    conn.query(`select * from event where category=${category_num}`,(err,result)=>{
        if(err){
            res.status(400).json({
                success: false,
                err: err,
                message: 'ERROR events/category_event'
            })
        }
        else{
            res.status(200).json({
                success: true,
                message: 'SUCCESS events/category_event',
                data: result
            })
        }
    })
})

// 3. 헹사 생성
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

// 4. 행사 삭제
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

// 5. 행사 신청하기
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

// 6. 행사 신청 취소하기(유저 입장)
router.delete('/cancel', (req, res) => {
    const id_token = req.body.id_token
    const event_id = req.body.event_id
    conn.query(`select * from user where id_token='${id_token}'`, (err, result) => {
        if(result == null){
            res.status(400).json({
                success: false,
                err: err,
                message: "user_id error"
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

// 7. 행사 구체 정보 가져오기
router.post('/detail', (req, res) => {
    const event_id = req.body.event_id
    conn.query(`select * from event where event_id=${event_id}`, (err, result) => {
        if(err){
            res.status(400).json({
                success: false,
                err: err,
                message: "[ERROR] api/event/detail"
            })
        }
        else{
            if(result.length == 0){
                res.status(400).json({
                    success: false,
                    message: "[ERROR] 해당 이벤트가 존재하지 않음"
                })
            }
            else{
                res.status(200).json({
                    success: true,
                    message: "api/event/detail SUCCESS",
                    data: result
                })
            }
        }
    })
})

// 8. 특정 행사에 참여한 사용자 아이디 리스트 가져오기
router.post('/get_participants', (req, res) => {
    const event_id = req.body.event_id
    conn.query(`select participant from event_participant where event_id=${event_id}`, (err, result) => {
        if(err){
            res.status(400).json({
                success: false,
                err: err,
                message: "[ERROR] api/event/get_participants"

            })
        }
        else{
            res.status(200).json({
                success: true,
                message: "[SUCCESS] api/event/get_participants",
                data: result
            })
        }
    })
})

// 9. 인기 이벤트 가져오기(4개)
router.get('/get_popular_events', (req, res) => {
    conn.query(`select * from event order by views desc limit 4`, (err, result) => {
        if(err){
            res.status(400).json({
                success: false,
                err: err,
                message: "[ERROR] api/event/get_popular_events"
            })
        }
        else{
            res.status(200).json({
                success: true,
                message: "[SUCCESS] api/event/get_popular_events",
                data: result
            })
        }
    })
})

// 10. 최신 이벤트 가져오기(4개)
router.get('/get_new_events', (req, res) => {
    conn.query(`select * from event order by created_at desc limit 4`, (err, result) => {
        if(err){
            res.status(400).json({
                success: false,
                err: err,
                message: "[ERROR] api/event/get_new_events"
            })
        }
        else{
            res.status(200).json({
                success: true,
                message: "[SUCCESS] api/event/get_new_events",
                data: result
            })
        }
    })
})

// 11. 추천 이벤트 가져오기(4개) // 맹그는 중
router.get('/get_new_events', (req, res) => {
    conn.query(`select * from event`, (err, result) => {
        if(err){
            res.status(400).json({
                success: false,
                err: err,
                message: "[ERROR] api/event/get_new_events"
            })
        }
        else{
            res.status(200).json({
                success: true,
                message: "[SUCCESS] api/event/get_new_events",
                data: result
            })
        }
    })
})

module.exports = router; 