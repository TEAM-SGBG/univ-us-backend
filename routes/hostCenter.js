const express=require(`express`);
const router=express.Router();

const conn = require('../config/connectDB');

const isLogin = require('./login/isLogin');
const moment = require('moment');

// 1. 헹사 생성
router.post('/create_event', (req,res) => {
    const event_name = req.body.event_name      // 이벤트 명
    const host_id = req.session.passport.user   // 호스트 아이디
    const channel_id = req.body.channel_id      // 채널 아이디
    const created_at = moment(req.body.created_at).format('YYYY-MM-DD hh:mm:ss') // 생성 날짜
    const expired_at = moment(req.body.expired_at).format('YYYY-MM-DD hh:mm:ss') // 신청 마감 날짜
    const description = req.body.description    // 세부 내용
    const img_url = req.body.img_url            // 이미지 url
    const category_tag = req.body.category.value    // 카테고리 (1: 수시행사, 2: 정시행사, 3: 박람회)

    category = 1
    if(category_tag == 'OFFLINE')
        category = 2
    else
        category = 3
    console.log(created_at, expired_at);
    conn.query(`insert into event(category, channel_id, channel_owner_id, name, img_url, created_at, expired_at, description) 
                    values(${category}, '${channel_id}', '${host_id}', '${event_name}', '${img_url}', '${created_at}', '${expired_at}', '${description}')`,(err,result)=>{
        if(err){
            console.log(err)
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

// 2. 행사 삭제
router.delete('/delete/:event_id', (req,res) => {
    const event_id = req.params.event_id

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

// 3. 헹사 수정
router.put('/modify_event', (req,res) => {
    const event_id = req.body.event_id
    const event_name = req.body.event_name // 이벤트 명
    const duration = req.body.duration     // 기간 (+ N일)
    const description = req.body.description // 세부 내용
    const img_url = req.body.img_url        // 이미지 url
    const category = req.body.category      // 카테고리 (1: 수시행사, 2: 정시행사, 3: 박람회)
    conn.query(`update event set category='${category}', name='${event_name}', img_url='${img_url}', expired_at=DATE_ADD(NOW(), INTERVAL ${duration} DAY)
                    , description='${description}' where event_id='${event_id}'`,(err,result)=>{
        if(err){
            res.status(400).json({
                success: false,
                message: err
            })
        }
        else{
            res.status(200).json({
                success: true,
                message: "hostCenter/modify_event SUCCESS"
            })
        }
    })
})

// 4. 특정 행사에 참여한 사용자 아이디 리스트 가져오기
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
//5. 내 채널리스트 가져오기
router.get(`/mychannel`,(req,res)=>{
    conn.query(`SELECT* FROM channel WHERE host_id=?`,[req.session.passport.user],(err,result)=>{
        if(err){
            res.status(400).json({
                success: false,
                message: err,
            });
        }else{
            res.status(200).json({
                success:true,
                message:'SUCCESS GET:mychannel:host_id',
                data:result,
            });
        }
    })
});
//6. 특정 채널의 행사 불러오기
router.get('/:channel_id/events', isLogin, (req, res) => {
    const { channel_id } = req.params;

    conn.query(`SELECT* FROM event WHERE channel_id=?`, [channel_id], (err,result)=>{
        if(err){
            res.status(400).json({
                success: false,
                message: err,
            });
        }else{
            res.status(200).json({
                success: true,
                message: 'SUCCESS GET:/:channel_id/events',
                data: result,
            });
        }
    })
    
});


module.exports = router; 