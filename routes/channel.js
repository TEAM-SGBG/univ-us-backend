const express= require('express');
const router= express.Router();

const conn = require('../config/connectDB');

router.get(`/all`,async(req,res,next)=>{
    await conn.query(`SELECT* FROM channel`,(err,result)=>{
        if(err){
            res.send(err);
        }else{
            res.send(result);
        }
    })
})//전체 채널 조회

router.post('/create',async(req,res)=>{
    await conn.query(`INSERT INTO channel(host_id,channel_name) VALUES(${req.body.host_id},${req.body.channel_name})`,(err,result)=>{
        if(err){
            res.send(err);
        }else{
            res.status(200).send(result);
        }
    })
    
})//특정 채널 생성 c

router.patch('/:name/:new',async(req,res)=>{
    await conn.query(`UPDATE channel SET channel_name=${req.params.new} WHERE channel_name=${req.params.name}`,(err,result)=>{
        if(err){
            res.send(err);
        }else{
            res.status(200).send(result);
        }
    });
})//특정 채널 수정 by

router.delete('/:channel_id',async(req,res)=>{
    //행사 하나라도 있으면 삭제 못하게
    if(conn.query(`SELECT EXISTS(SELECT*FROM event WHERE channel_owner_id=${req.params.channel_id}) as success`))
    {
        res.status(400).send({
            "err" : `can't delete`,npm
        });
    }else{
        conn.query(`DELETE FROM channel WHERE channel_id=${req.params.channel_id}`,(err,result)=>{
            if(err){
                res.send(err);
            }else{
                res.status(200).send(result);
            }
        })
    }
});//특정 채널 삭제

router.post(`/subscribe`,async (req,res)=>{//post로 채널 id, 구독자 id(이건 session으로 받을 수도)
    await conn.query(`INSERT INTO channel_subscriber(channel_id,subscriber_id) VALUES(${req.body.channel_id},${req.body.subscriber_id})`,(err,result)=>{
        if(err){
            res.send(err);
        }else{
            res.status(400).send(result);
        }
    })
});//구독하기

router.delete(`/subscribe/:channel_id/:subscriber_id`,async (req,res)=>{//구독취소
    await conn.query(`DELETE FROM channel WHERE channel_id=${req.params.channel_id} AND subscriber_id=${req.params.channel_id}`,(err,result)=>{
        if(err){
            res.send(err);
        }else{
            res.send(result);
        }
    })
});

router.get(`/:channel_id`,async(req,res)=>{
    let channelInfo={};
    await conn.query(`SELECT* FROM channel WHERE channel_id=${req.params.channel_id}`,(err,result)=>{
        if(err){
            res.send(err);
        }else{
            channelInfo=result;
        }
    });

    await conn.query(`SELECT count(*) as cnt FROM channel_subscriber WHERE channel_id=${req.params.channel_id} `,(err,result)=>{
        if(err){
            res.send(err);
        }else{
            channelInfo[0]["subscriber"]=JSON.parse(JSON.stringify(result))[0].cnt;
            console.log(channelInfo);
            res.send(channelInfo);
        }
    });
})// 특정 채널정보 가져오기



module.exports = router;

