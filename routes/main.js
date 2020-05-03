const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const router = express.Router();
/* DB 연동 모듈 불러옴 */
const db = require('./db');

/*
    메인 화면을 출력합니다.
*/

const getMainUi = (req, res) => {
    let mainStream = '';

    mainStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    mainStream += fs.readFileSync(__dirname + '/../views/nav.ejs', 'utf8');
    mainStream += fs.readFileSync(__dirname + '/../views/main.ejs', 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공

    // if :로그인된 상태,  else : 로그인안된 상태
    if (req.session.userId) {  
        res.end(ejs.render(mainStream,  { title: '세상의 모든 금손, 세모금',
                                          userName: req.session.who,
                                          signUpUrl: '/users/myPage',
                                          signUpLabel: '마이페이지',
                                          loginUrl: '/users/logout',
                                          loginLabel: '로그아웃' }));
    }
    else {
        res.end(ejs.render(mainStream, { title : '세상의 모든 금손, 세모금',
                                        userName: '비회원',
                                       signUpUrl: '/users/signUp',
                                       signUpLabel:'회원가입',
                                       loginUrl: '/users/login',
                                       loginLabel: '로그인'}));
    }
};

router.get('/', getMainUi);

module.exports = router;
