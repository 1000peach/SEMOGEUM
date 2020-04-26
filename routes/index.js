var express = require('express');
const fs = require('fs');
const ejs = require('ejs');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    let mainStream = '';
    mainStream = mainStream + fs.readFileSync(__dirname + '/../views/nav.ejs', 'utf8');
    mainStream = mainStream + fs.readFileSync(__dirname + '/../views/main.ejs', 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공
    res.end(
        ejs.render(mainStream, {
            title: '세상의 모든 금손, 세모금',
        })
    );
});

module.exports = router;
