const express=require(`express`);
const router=express.Router();

const conn = require('../config/connectDB');

// 1. 헹사 생성
router.post('/create', (req,res) => {
    const event_name = req.body.event_name // 이벤트 명
    const host_id = req.body.host_id       // 호스트 아이디
    const duration = req.body.duration     // 기간 (+ N일)
    const description = req.body.description // 세부 내용
    const img_url = req.body.img_url        // 이미지 url
    const category = req.body.category      // 카테고리 (1: 수시행사, 2: 정시행사, 3: 박람회)
    conn.query(`insert into event(category, channel_owner_id, name, img_url, expired_at, description) 
                    values(${category}, '${host_id}', '${event_name}', '${img_url}', DATE_ADD(NOW(), INTERVAL ${duration} DAY), '${description}')`,(err,result)=>{
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

// 2. 행사 삭제
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
module.exports = router; 