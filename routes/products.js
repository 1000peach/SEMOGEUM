const fs = require('fs');
const express = require('express');
const ejs = require('ejs');
const router = express.Router();
const db = require('./db');
const returnError = require('./error');
const multer = require('multer');
const path = require('path');

// https://www.zerocho.com/category/NodeJS/post/5950a6c4f7934c001894ea83 참고
// 파일명을 보안문자로 저장하지않고 편리함을 위해 그대로 표출하기 위함
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname + '/images/uploads/voteProducts');
        },
        filename: function (req, file, cb) {
            cb(null, new Date().valueOf() + path.extname(file.originalname));
        },
    }),
});

/*
    상품공모 양식을 출력합니다
*/
const getProdContest = (req, res) => {
    let body = req.body;
    let prodContestStream = '';
    prodContestStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    prodContestStream += fs.readFileSync(__dirname + '/../views/nav.ejs', 'utf8');
    prodContestStream += fs.readFileSync(__dirname + '/../views/prodContest.ejs', 'utf8');
    prodContestStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

    console.log(body); 
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공

    if (req.session.userId) {
        res.end(
            ejs.render(prodContestStream, {
                title: '이 달의 상품 공모',
                page: 0,
                userName: req.session.who,
                signUpUrl: '/myPage',
                signUpLabel: '마이페이지',
                loginUrl: '/cart',
                loginLabel: '장바구니',
                logoutUrl: '/users/logout',
                logoutLabel: '로그아웃'
            })
        );
    } else {
        res.end(ejs.render(returnError(), { title: '에러 페이지', errorMessage: '로그인이 필요합니다.' }));
    }
};

/*
    상품공모 양식에서 입력된 상품정보를 등록합니다
*/
const handleProdContest = (req, res) => {
    let body = req.body;
    let productImg = '/images/uploads/voteProducts/'; // 상품이미지 저장디렉터리
    let imgFileArr = req.files;
    let result = { originalName: picfile.originalname, size: picfile.size };

    
};

router.get('/prodContest', getProdContest);
router.post('/prodContest', upload.array('photo'), handleProdContest);

module.exports = router;
