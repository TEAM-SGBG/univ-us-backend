const express=require(`express`);
const router=express.Router();

const conn = require('../config/connectDB');



// 1. 전체 유저
router.get('/all_user', (req, res) => {
    conn.query(`select * from user`,(err,result)=>{
        if(err){
            res.status(400).json({
                success: false,
                err: err,
                message: 'ERROR user/all_event'
            })
        }
        else{
            res.status(200).json({
                success: true,
                message: 'SUCCESS user/all_user',
                data: result
            })
        }
    })
})
// 2. 유저 삭제
router.delete('/delete_user/:user_id', (req, res) => {
    conn.query(`DELETE FROM user WHERE id_token = ?`,[req.params.user_id],(err,result)=>{
        if(err){
            res.status(400).json({
                success: false,
                err: err,
                message: 'ERROR user/delete_user'
            })
        }
        else{
            if(result.affectedRows==0){
                res.status(400).json({
                    success: false,
                    err: '삭제실패',
                    message: 'ERROR user/delete_user'
                })
            }else{
                res.status(200).json({
                    success: true,
                    message: 'SUCCESS user/delete_user',
                    data: result
                })
            }
         
        }
    })
})


module.exports = router; 