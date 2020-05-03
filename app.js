/*
    내외부 모듈 추출
*/
const express = require('express');
const app = express();
const path = require('path');
// const favicon = require('static-favicon'); 
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sessionParser = require('express-session');

/*
    라우팅
*/
const routes = require('./routes/main');
const users = require('./routes/users');

/*
    포트주소 설정(변수화하면 나중에 편해서)
*/
const port = 3000;

/*
    포트번호를 외부 모듈로 빼기
*/
module.exports.port = port; // 이렇게 빼면 다른 파일들에서 require로 불러온 후에 객체에 접근하는 방식으로 사용가능(user_chat.ejs 참고)

/*
    실행환경 설정부분
*/
app.set('views', path.join(__dirname, 'views')); // views 경로 설정(ejs파일이 있는곳을 'views'로 가리킴)
app.set('view engine', 'ejs'); // view  엔진 지정(ejs)

app.use(express.static(path.join(__dirname, 'public'))); // 정적 위치 public을 다루기 위한 소스코드
app.use('/stylesheets', express.static(path.join(__dirname, 'public', 'stylesheets')));   // css 설정
// app.use(favicon()); 모듈 설치 에러나서 일단 주석 처리
// app.use(logger('dev'));
app.use(express.json()); // bodyParser.json() 대신에 사용
app.use(express.urlencoded({ extended: false })); // express 4.16.0버전부터는 bodyParser 필요없이(아래문장 필요X) express로 사용가능!
app.use(bodyParser.urlencoded({ extended: false })); // express 4.16.0버전부터는 이 문장이 필요 없다.(지워도 됨)
app.use(cookieParser());
app.use(
    sessionParser({
        key: 'sid',
        secret: '!@#$%^asdf!@#$^', // 세션id 암호화할때 사용
        resave: false, // 접속할때마다 id부여금지
        saveUninitialized: true, // 세션id사용전에는 발급금지
    })
);

/*
    URI와 핸들러를 매핑
*/
app.use('/', routes); // URI (/) 접속하면 main.js로 라우팅
app.use('/users', users); // URI (/users) 접속하면 users.js로 라우팅

// 서버 실행
app.listen(port, function () {
    console.log('서버실행: http://localhost:' + port);
}); 

module.exports = app;
