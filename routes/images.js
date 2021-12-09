const express=require(`express`);
const router=express.Router();

const conn = require('../config/connectDB');
const isLogin = require('./login/isLogin.js');
const multer = require('multer');

// MULTER CONFIG OPTION
let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/')
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, callback) => {
        const ext = path.extname(file.originalname)
        if(ext !== '.png'){
            return callback(res.status(400).end('only .png is allowed.'), false)
        }
        callback(null, true)
    }
})

const upload = multer({ storage: storage }).single('file')

router.post('/uploadfiles', (req, res) => {
    // 클라이언트가 보낸 비디오를 서버에 저장한다
    upload(req, res, err => {
        if(err){
            return res.json({ success: false, err })
        }
        console.log('성공')
        return res.json({ 
            success: true, 
            url: res.req.file.path, 
            fileName: res.req.file.filename 
        })
    })
})

module.exports = router; 