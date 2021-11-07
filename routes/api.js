const express=require(`express`);
const router=express.Router();

const conn = require('../config/connectDB');

router.get('/',(req,res)=>{
    console.log('proxy연결성공')
    
})


// 1. 행사 정보 불러오기
router.get('/events/load_list', (req, res) => {
    
    conn.query(`SELECT * FROM event`,(err,result)=>{
        if(err){
            console.log('/evnet/load_list')
            res.send(err);
        }else{
            res.send(result);
        }
    })

})

/**
 * <행사 쪽>
 * 1. 행사 신청하기
 * 2. 행사 정보 가져오기
 * 3. 전체 행사 목록 리스트로 가져오기
 * 4. 수시 행사 목록 리스트로 가져오기
 * 5. 정시 행사 목록 리스트로 가져오기
 * 
 * <마이 페이지 쪽>
 * 1. 행사 신청 취소
 * 2. 신청한 행사 가져오기
 * 3. 관심있는 행사 가져오기
 * 4. 구독중인 채널 정보 가져오기
 * 5. 회원정보 가져오기
 * 6. 회원정보 수정하기
 * 
 * <구독 기능>
 * 1. 구독하기
 * 2. 구독 취소
 * 3. 구독 리스트 가져오기
 */

module.exports = router; 