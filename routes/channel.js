const express= require('express');
const router= express.Router();

const conn = require('../config/connectDB');
const isLogin = require('./login/isLogin');

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

router.post(`/duplicate`,(req,res)=>{
    const channel_id=req.body.channel_id;
    conn.query(`SELECT count(*) as cnt FROM channel WHERE channel_id=?`,[channel_id],(err,result)=>{
        //SELECT 컬럼명 FROM 테이블명 GROUP BY 컬럼명 HAVING COUNT (컬럼명) > 1
        //SELECT channel_id FROM channel GROUP BY channel_id Having COUNT (channel_id)
        const isDuplicated=result[0]
        if(err){
            res.status(400).json({
                success: false,
                message: err,
            });
        }else{
            res.status(200).json({
                success:true,
                message:'SUCCESS POST:channel/duplicate',
                data:result,
            });
        }
    })
});//중복체크

router.post('/create',(req,res)=>{
    const params=[req.body.channel_id, req.session.passport.user,req.body.channel_name];
    conn.query(`INSERT INTO channel(channel_id,host_id,channel_name) VALUES(?,?,?)`,params,(err,result)=>{
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

router.patch('/:channel_id/:new',isLogin,(req,res)=>{
    const params=[req.params.new,req.params.channel_id]
    conn.query(`UPDATE channel SET channel_name=? WHERE channel_id=?`,params,(err,result)=>{
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
                update_channel_id:req.params.channel_id,
            });
        }
    });
})//특정 채널 이름 수정



router.delete('/:channel_id',(req,res)=>{
    //행사 하나라도 있으면 삭제 못하게
    const params=[req.params.channel_id]
    conn.query(`SELECT EXISTS(SELECT*FROM event WHERE channel_owner_id=?) as success`,params,(err1,result1)=>{
            if(err){
                res.status(400).json({
                    success: false,
                    message: `can't delete`,
                });
            }else{
                conn.query(`DELETE FROM channel WHERE channel_id=?`,params,(err2,result2)=>{
                    if(err){
                        res.status(400).json({
                            success: false,
                            message: err2,
                        });
                    }else{
                        res.status(200).json({
                            success:true,
                            message:'SUCCESS DELETE:channel/:channel_id',
                            data:result2,
                        });
        
                    }
                })
            }
    })
});//특정 채널 삭제

router.post(`/subscribe`,(req,res)=>{
    const params=[req.body.channel_id,req.session.passport.user];
    conn.query(`INSERT INTO channel_subscriber(channel_id,subscriber_id) VALUES(?,?)`,params,(err1,result1)=>{
        if(err){
            res.status(400).json({
                success: false,
                message: err1,
            });
        }else{
            conn.query(`UPDATE channel SET subscribe_count=subscribe_count+1 WHERE channel_id=?`,[params[0]],(err2,result2)=>{
                if(err2){
                    res.status(400).json({
                        success: false,
                        message: err2,
                    });
                }else{
                    res.status(200).json({
                        success:true,
                        message:'SUCCESS POST:channel/subscribe',
                        data:result2,
                    });
                }

            });
        }
        //subscribe 수정
    });
});//구독하기

router.delete(`/subscribe/:channel_id`,(req,res)=>{
    const params=[req.params.channel_id,req.session.passport.user];
    conn.query(`DELETE FROM channel_subscriber WHERE channel_id=? AND subscriber_id=?`,params,(err1,result1)=>{
        if(err){
            res.status(400).json({
                success: false,
                message: err1,
            });
        }else{
            conn.query(`UPDATE channel SET subscribe_count=subscribe_count-1 WHERE channel_id=?`,[params[0]],(err2,result2)=>{
                if(err2){
                    console.log(err2);
                    res.status(400).json({
                        success: false,
                        message: err2,
                    });
                }else{
                    res.status(200).json({
                        success:true,
                        message:'SUCCESS DELETE:channel/subscribe/:channel_id/:subscriber_id',
                        data:result2,
                    });
                }   

            });
        }
    })
});//구독취소

router.get(`/info:channel_id`,(req,res)=>{
    let channelInfo={};
    const params=[req.params.channel_id];
    conn.query(`SELECT* FROM channel WHERE channel_id=?`,params,(err1,result1)=>{
        if(err){
            res.status(400).json({
                success: false,
                message: err1,
            });
        }else{
            channelInfo=result1[0];
            conn.query(`SELECT count(*) as cnt FROM channel_subscriber WHERE channel_id=? `,params,(err2,result2)=>{
                if(error){
                    res.status(400).json({
                        success: false,
                        message: err2,
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



router.get(`/popular`,(req,res)=>{
    conn.query(`SELECT * FROM(SELECT * FROM channel ORDER BY subscriber_count DESC) WHERE ROWNUM<=4`,(err,result)=>{
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
});//채널 구독자순으로 내림차순 제공 상위 4개만



module.exports = router;
