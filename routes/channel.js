const express= require('express');
const router= express.Router();

const conn = require('../config/connectDB');

router.get(`/all`,(req,res,next)=>{
    console.log(req.session);
    conn.query(`SELECT* FROM channel`,(err,result)=>{
        if(err){
            res.status(400).json({
                success: false,
                message: err,
            });
        }else{
            res.status(200).json({
                success:true,
                message:'SUCCESS GET:channel/all',
                data:result,
            });
        }
    })
});
//전체 채널 조회

router.post('/create',(req,res)=>{
  conn.query(`INSERT INTO channel(host_id,channel_name,channel_img) VALUES(${req.body.host_id},${req.body.channel_name},${req.body.channel_img})`,(err,result)=>{
        if(err){
            res.status(400).json({
                success: false,
                message: err,
            });
        }else{
            res.status(200).json({
                success:true,
                message:'SUCCESS POST:channel/create',
                data:result,
            });
        }
    })
})//채널 생성 

router.patch('/:name/:new',(req,res)=>{
    conn.query(`UPDATE channel SET channel_name=${req.params.new} WHERE channel_name=${req.params.name}`,(err,result)=>{
        if(err){
            res.status(400).json({
                success: false,
                message: err,
            });
        }else{
            res.status(200).json({
                success:true,
                message:'SUCCESS PATCH: channel/:name/:new',
                data:result,
            });
        }
    });
})//특정 채널 이름 수정



router.delete('/:channel_id',(req,res)=>{
    //행사 하나라도 있으면 삭제 못하게
    if(conn.query(`SELECT EXISTS(SELECT*FROM event WHERE channel_owner_id=${req.params.channel_id}) as success`))
    {
        res.status(400).json({
            success: false,
            message: `can't delete`,
        });
    }else{
        conn.query(`DELETE FROM channel WHERE channel_id=${req.params.channel_id}`,(err,result)=>{
            if(err){
                res.status(400).json({
                    success: false,
                    message: err,
                });
            }else{
                res.status(200).json({
                    success:true,
                    message:'SUCCESS DELETE:channel/:channel_id',
                    data:result,
                });

            }
        })
    }
});//특정 채널 삭제

router.post(`/subscribe`,(req,res)=>{
    conn.query(`INSERT INTO channel_subscriber(channel_id,subscriber_id) VALUES(${req.body.channel_id},${req.user.id_token})`,(err,result)=>{
        if(err){
            res.status(400).json({
                success: false,
                message: err,
            });
        }else{
            conn.query(`UPDATE channel SET subscribe_count=subscribe_count+1 WHERE channel_id=${req.body.channel_id}`,(err2,result2)=>{
                if(err2){
                    res.status(400).json({
                        success: false,
                        message: err2,
                    });
                }else{
                    res.status(200).json({
                        success:true,
                        message:'SUCCESS POST:channel/subscribe',
                        data:result,
                    });
                }

            });
        }
        //subscribe 수정
    });
});//구독하기

router.delete(`/subscribe/:channel_id`,(req,res)=>{
    conn.query(`DELETE FROM channel_subscriber WHERE channel_id=${req.params.channel_id} AND subscriber_id=${req.user.id_token}`,(err,result)=>{
        if(err){
            res.status(400).json({
                success: false,
                message: err,
            });
        }else{
            conn.query(`UPDATE channel SET subscribe_count=subscribe_count-1 WHERE channel_id=${req.params.channel_id}`,(err2,result2)=>{
                if(err2){
                    //console.log(req.user.id_token);
                    console.log(err2);
                    res.status(400).json({
                        success: false,
                        message: err2,
                    });
                }else{
                    res.status(200).json({
                        success:true,
                        message:'SUCCESS DELETE:channel/subscribe/:channel_id/:subscriber_id',
                        data:result,
                    });
                }   

            });
        }
    })
});//구독취소

router.get(`/info:channel_id`,(req,res)=>{
    let channelInfo={};
    conn.query(`SELECT* FROM channel WHERE channel_id=${req.params.channel_id}`,(err,result1)=>{
        if(err){
            res.status(400).json({
                success: false,
                message: err,
            });
        }else{
            channelInfo=result1[0];
            conn.query(`SELECT count(*) as cnt FROM channel_subscriber WHERE channel_id=${req.params.channel_id} `,(error,result2)=>{
                if(error){
                    res.status(400).json({
                        success: false,
                        message: error,
                    });
                }else{
                    channelInfo["subscriber"]=JSON.parse(JSON.stringify(result2))[0].cnt;
                    res.status(200).json({
                        success:true,
                        message:'SUCCESS GET:channel/info:channel_id',
                        data:channelInfo,
                    });
                }
            });
        }
    });

});// 특정 채널정보(구독자 수)

router.get(`/subscribe`,(req,res)=>{
    console.log(req.session);
    conn.query(`SELECT* FROM channel_subscriber JOIN channel ON channel.channel_id=channel_subscriber.channel_id WHERE subscriber_id=${req.user.id_token}`,(err,result)=>{
        if(err){
            console.log(err);
            res.status(400).json({
                success: false,
                message: err,
            });
        }else{
            console.log(result);
            res.status(200).json({
                success:true,
                message:'SUCCESS GET:channel/subscribe',
                data:result,
            });
        }
    });
});//구독한 채널 정보 가져옴

router.get(`/popular`,(req,res)=>{
    conn.query(`SELECT * FROM channel ORDER BY subscriber_count DESC`,(err,result)=>{
        if(err){
            res.status(400).json({
                success: false,
                message: err,
            });
        }else{
            res.status(200).json({
                success:true,
                message:'SUCCESS GET:channel/popular',
                data:result,
            });
        }
    })
});//채널 구독순으로 내림차순 제공

module.exports = router;
