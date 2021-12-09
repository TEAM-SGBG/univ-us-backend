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
    if(category_num == 0){
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
    }
    else{
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
    }
    
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
    var sql1 = `select * from event where event_id=${event_id};`
    var sql2 = `update event set views=views+1 where event_id=${event_id};`
    conn.query(sql1 + sql2, (err, result, field) => {
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
                    data: result[0]
                })
            }
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

// 11. 추천 이벤트 가져오기(4개)
router.get('/get_recommanded_events', (req, res) => {
    conn.query(`select * from event order by rand() limit 4`, (err, result) => {
        if(err){
            res.status(400).json({
                success: false,
                err: err,
                message: "[ERROR] api/event/get_recommanded_events"
            })
        }
        else{

            res.status(200).json({
                success: true,
                message: "[SUCCESS] api/event/get_recommanded_events",
                data: result
            })
        }
    })
})

// 11.5. 좋아요 눌렀는지 알려주는 API
router.post('/check_event_like', (req, res) => {
    const user_id = req.session.passport.user
    const event_id = req.body.event_id
    conn.query(`select * from event_like where user_id='${user_id}' and event_id='${event_id}'`, (err, result) => {
        if(err){
            res.status(400).json({
                success: false,
                err: err,
                message: "[ERROR] api/event_like"
            })
        }
        else{
            const is_liked = result.length > 0 ? true : false
            res.status(200).json({
                success: true,
                liked: is_liked,
                message: "[SUCCESS] api/event_like BUT already liked"
            })     
        }
    })
})

// 12. 특정 사용자가 특정 이벤트를 좋아요 누르는 API
router.post('/event_like', (req, res) => {
    const user_id = req.session.passport.user
    const event_id = req.body.event_id
    conn.query(`select * from event_like where user_id='${user_id}' and event_id='${event_id}'`, (err, result) => {
        if(err){
            res.status(400).json({
                success: false,
                err: err,
                message: "[ERROR] api/event_like"
            })
        }
        else{
            if(result.length == 0) {
                conn.query(`insert into event_like(user_id, event_id) values('${user_id}', ${event_id})`, (err, result) => {
                    if(err){
                        res.status(400).json({
                            success: false,
                            err: err,
                            message: "[ERROR] api/event_like"
                        })
                    }
                    else{
                        res.status(200).json({
                            success: true,
                            liked: true,
                            message: "[SUCCESS] api/event_like"
                        })
                    }
                })
            }
            else {
                conn.query(`delete from event_like where user_id='${user_id}' and event_id='${event_id}'`, (err, result) => {
                    if(err){
                        res.status(400).json({
                            success: false,
                            err: err,
                            message: "[ERROR] api/event_like"
                        })
                    }
                    else{
                        res.status(200).json({
                            success: true,
                            liked: false,
                            message: "[SUCCESS] api/event_like"
                        })
                    }
                })
                
            }
        }
    })
    
})

// 13. 특정 행사를 좋아요 누른 사용자 아이디 리스트 가져오기 /api/events/event_like_user_list?event_id=1
router.get('/event_like_user_list', (req, res) => {
    const event_id = req.query.event_id
    conn.query(`select user_id from event_like where event_id=${event_id}`, (err, result) => {
        if(err){
            res.status(400).json({
                success: false,
                err: err,
                message: "[ERROR] api/event_like_user_list"
            })
        }
        else{
            res.status(200).json({
                success: true,
                message: "[SUCCESS] api/event_like_user_list",
                data: result
            })
        }
    })
})

// 14. 특정 사용자가 좋아요를 누른 행사 리스트 가져오기 /api/events/user_like_event_list
router.post('/user_like_event_list', (req, res) => {
    const user_id = req.body.id_token
    conn.query(`select event_id from event_like where user_id='${user_id}'`, (err, result) => {
        if(err){
            res.status(400).json({
                success: false,
                err: err,
                message: "[ERROR] api/user_like_event_list"
            })
        }
        else{
            res.status(200).json({
                success: true,
                message: "[SUCCESS] api/user_like_event_list",
                data: result
            })
        }
    })
})

module.exports = router; 