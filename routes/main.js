const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const router = express.Router();

/*
    메인 화면을 출력합니다.
*/

const getMainUi = (req, res) => {
    let mainStream = '';
    mainStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    mainStream += fs.readFileSync(__dirname + '/../views/nav.ejs', 'utf8');
    mainStream += fs.readFileSync(__dirname + '/../views/main.ejs', 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공
    res.end(
        ejs.render(mainStream, {
            title: '세상의 모든 금손, 세모금',
        })
    );
};

router.get('/', getMainUi);

module.exports = router;
