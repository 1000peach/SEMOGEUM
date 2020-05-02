const fs = require('fs');
const express = require('express');
const ejs = require('ejs');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const router = express.Router();

/* 
    데이터베이스 연동 소스코드 
*/
const db = mysql.createConnection({
    host: 'localhost', // DB서버 IP주소
    port: 3306, // DB서버 Port주소
    user: 'root', // DB접속 아이디
    password: 'root', // DB암호
    database: 'semogeum', //사용할 DB명
});

/*
    회원가입 페이지를 출력합니다.
*/
const getSignUpPage = (req, res) => {
    let signUpStream = '';

    signUpStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    signUpStream += fs.readFileSync(__dirname + '/../views/signUp.ejs', 'utf8');
    //signUpStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공
    res.end(
        ejs.render(signUpStream, {
            title: '회원가입',
        })
    );
};

/*
    회원가입을 처리합니다.
*/
const handleSignUp = (req, res) => {
    let str1 = 'SELECT * FROM USER WHERE userId=?';
    let str2 = 'INSERT INTO USER(userId, userName, userPwd, userPwdConfirm) VALUES(?, ?, ?, ?)';
    let body = req.body;
    let userId = body.userId;
    let userName = body.userName;
    let userPwd = body.userPwd;
    let userPwdConfirm = body.userPwdConfirm;

    // console.log(req.body);
    // console.log('POST 데이터 받음');

    db.query(str1, [userId], (error, results) => {
        if (error) {
            console.log(error);
            res.end('error');
        } else {
            // 입력받은 데이터가 DB에 존재하는지 판단합니다.
            if (results[0] == undefined && userPwd == userPwdConfirm) {
                db.query(str2, [userId, userName, userPwd, userPwdConfirm], (error) => {
                    if (error) {
                        res.end('error');
                        console.log(error);
                    } else {
                        // 회원가입 성공시
                        console.log('Insertion into DB was completed!');

                        let signUpSuccessStream = '';
                        signUpSuccessStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
                        signUpSuccessStream += fs.readFileSync(__dirname + '/../views/nav.ejs', 'utf8');
                        //signUpSuccessStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

                        res.status(562).end(
                            ejs.render(signUpSuccessStream, {
                                title: '회원가입 완료',
                            })
                        );
                    }
                }); // db.query();
            } else {
                let handleSignUpErrorStream = '';
                handleSignUpErrorStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
                //handleSignUpErrorStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

                res.status(562).end(
                    ejs.render(handleSignUpErrorStream, {
                        title: '회원가입 에러',
                    })
                );
            }
        }
    });
};

/*
    로그인 화면을 출력합니다.
*/
const getLoginPage = (req, res) => {
    let loginStream = '';
    loginStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    loginStream += fs.readFileSync(__dirname + '/../views/login.ejs', 'utf8');
    //loginStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공
    res.end(
        ejs.render(loginStream, {
            title: '로그인',
        })
    );
};

/*
    로그인을 처리합니다.
*/
const handleLogin = (req, res) => {
    let body = req.body; // req.body에 login.ejs 폼으로부터 name값 value값이 객체 형식으로 넘어옴 {uid: '어쩌고', pass: '저쩌고'}
    let userId, userPwd, userName;
    let str1;
    let handleLoginErrorStream = '';

    handleLoginErrorStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    handleLoginErrorStream += fs.readFileSync(__dirname + '/../views/nav.ejs', 'utf8');
    //handleLoginErrorStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

    if (body.userId == '' || body.userPwd == '') {
        res.status(562).end(
            ejs.render(handleLoginErrorStream, {
                title: '로그인 에러',
            })
        );
        console.log('아이디나 암호가 입력되지 않아서 로그인할 수 없습니다.');
    } else {
        str1 = 'SELECT * FROM USER WHERE userId=? AND userPwd=?;';

        db.query(str1, [body.userId, body.userPwd], (error, results, fields) => {
            if (error) {
                res.status(562).end(
                    ejs.render(handleLoginErrorStream, {
                        title: '로그인 에러',
                    })
                );
                console.log(error);
            } else {
                if (results.length <= 0) {
                    // select 조회결과가 없는 경우 (즉, 등록계정이 없는 경우)
                    res.status(562).end(
                        ejs.render(handleLoginErrorStream, {
                            title: '로그인 에러',
                        })
                    );
                    console.log('등록된 아이디가 존재하지 않습니다.');
                } else {
                    // select 조회결과가 있는 경우 (즉, 등록된 계정이 존재하는 경우)
                    //console.log("results: ", results);
                    results.forEach((userData, index) => {
                        // results는 db로부터 넘어온 key와 value를 0번째 방에 객체로 저장함
                        userId = userData.userId;
                        userPwd = userData.userPwd;
                        userName = userData.userName;

                        console.log('DB에서 로그인성공한 ID/암호 : %s/%s', userId, userPwd);

                        // 로그인이 성공한 경우
                        if (body.userId == userId && body.userPwd == userPwd) {
                            req.session.auth = 99; // 임의로 수(99)로 로그인성공했다는 것을 설정함
                            req.session.userId = userId;
                            req.session.who = userName; // 인증된 사용자명 확보 (로그인후 이름출력용)

                            if (body.userId == 'admin')
                                // 만약, 인증된 사용자가 관리자(admin)라면 이를 표시
                                req.session.admin = true;
                            res.redirect('/');
                        }
                    });
                } // else
            } // else
        });
    } // else
};

/*
    로그아웃을 처리합니다.
*/
const handleLogout = (req, res) => {};

router.get('/signUp', getSignUpPage);
router.get('/login', getLoginPage);
router.get('/logout', handleLogout);

router.post('/signUp', handleSignUp);
router.post('/login', handleLogin);

module.exports = router;
