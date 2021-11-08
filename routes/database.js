const express= require('express');
const router= express.Router();

const conn = require('../config/connectDB');

router.get(`/channel/all`,async(req,res,next)=>{
    await conn.query(`SELECT* FROM channel`,(err,result)=>{
        if(err){
            res.send(err);
        }else{
            res.send(result);
        }
    })
})//전체 채널 조회

router.post('/channel',async(req,res)=>{
    await conn.query(`INSERT INTO channel(host_id,channel_name) VALUES(${req.body.host_id},${req.body.channel_name})`,(err,result)=>{
        if(err){
            res.send(err);
        }else{
            res.send(result);
        }
    })
    
})//특정 채널 생성 c

router.patch('/channel/:name/:new',async(req,res)=>{
    await conn.query(`UPDATE channel SET channel_name=${req.params.new} WHERE channel_name=${req.params.name}`,(err,result)=>{
        if(err){
            res.send(err);
        }else{
            res.send(result);
        }
    })
    
})//특정 채널 수정 by
router.delete('/channel/:name',async(req,res)=>{
    conn.query(`DELETE FROM channel WHERE channel_name=${req.params.name}`,(err,result)=>{
        if(err){
            res.send(err);
        }else{
            res.send(result);
        }
    })
});//특정 채널 삭제

/*
- 삭제시 

*/

module.exports = router;

