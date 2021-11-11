const express=require(`express`);
const router=express.Router();

const conn = require('../config/connectDB');


/**
 * <구독 기능>
 * 1. 구독 리스트 가져오기
 * 2. 구독하기
 * 3. 구독 취소
 */

// 1. 구독 리스트 가져오기(유저 입장)
router.post('/subscribe_info', (req, res) => {
    const id_token = req.body.id_token
    
    conn.query(`select * from channel_subscriber where subscriber_id='${id_token}'`,(err,result) => {
        if(err){
            res.status(400).json({
                success: false,
                message: err
            })
        }
        else{
            list = []
            for(var obj of result){
                list.push(obj.channel_id)
            }
            res.status(200).json({
                success: true,
                message: 'SUCCESS mypage/subscribe_info',
                data: list
            })
        }
    })

})

// 2. 구독하기
router.post('/subscribe', (req, res) => {
    const id_token = req.body.id_token
    const channel_id = req.body.channel_id
    conn.query(`select * from user where id_token='${id_token}'`, (err, result) => {
        //console.log(result)
        if(result.length == 0){
            res.status(400).json({
                success: false,
                err: err,
                description: "user_id error"
            })
        }
    })
    conn.query(`select * from channel where channel_id=${channel_id}`, (err, result) => {
        //console.log(result)
        if(result.length == 0){
            res.status(400).json({
                success: false,
                err: err,
                description: "channel_id error"
            })
        }
    })
    conn.query(`select * from channel_subscriber where channel_id=${channel_id} and subscriber_id='${id_token}'`, (err, result) => {
        if(result.length != 0){
            res.status(400).json({
                success: false,
                description: "already subscribed"
            })
        }
        else{
            conn.query(`insert into channel_subscriber(channel_id, subscriber_id) values(${channel_id}, '${id_token}')`,(err,result)=>{
                if(err){
                    res.send(err);
                }else{
                    res.status(200).json({
                        success: true,
                        message: "subscribe/subscribe SUCCESS"
                    });
                }
            })
        }
    })

})

// 3. 구독 취소하기
router.delete('/unsubscribe', (req, res) => {
    const id_token = req.body.id_token
    const channel_id = req.body.channel_id
    conn.query(`select * from channel_subscriber where channel_id=${channel_id} and subscriber_id='${id_token}'`, (err, result) => {
        if(result.length == 0){
            res.status(400).json({
                success: false,
                description: "already unsubscribed or have never subscribed"
            })
        }
        else{
            conn.query(`delete from channel_subscriber where channel_id=${channel_id} and subscriber_id='${id_token}'`,(err,result)=>{
                if(err){
                    res.send(err);
                }else{
                    res.status(200).json({
                        success: true,
                        message: "subscribe/unsubscribe SUCCESS"
                    });
                }
            })
        }
    })
})

module.exports = router; 