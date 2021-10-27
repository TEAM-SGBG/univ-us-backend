const express=require(`express`);
const router=express.Router();


router.get('/',(req,res)=>{
    console.log('proxy연결성공')
    
})

module.exports = router; 