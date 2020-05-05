const fs = require('fs');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const router = express.Router();
const   methodOverride = require('method-override');
/* DB 연동 모듈 불러옴 */
const db = require('./db');

router.use(methodOverride('_method')); // put을 사용하기 위함

/*********************************************************** */
/************************ 회원가입 기능 ***********************/
/*********************************************************** */
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
    let str2 = 'INSERT INTO USER(userId, userName, userPhone, userPwd, userPwdConfirm) VALUES(?, ?, ?, ?, ?)';
    let body = req.body;
    let userId = body.userId;
    let userName = body.userName;
    let userPhone = body.userPhone;
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
                db.query(str2, [userId, userName, userPhone, userPwd, userPwdConfirm], (error) => {
                    if (error) {
                        res.end('error');
                        console.log(error);
                    } else {
                        // 회원가입 성공시
                        console.log('Insertion into DB was completed!');
                        res.redirect('/');
                    }
                }); // db.query();
            } else {
                let handleSignUpErrorStream = '';
                handleSignUpErrorStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
                handleSignUpErrorStream += fs.readFileSync(__dirname + '/../views/error.ejs', 'utf8');
                //handleSignUpErrorStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

                res.status(562).end(
                    ejs.render(handleSignUpErrorStream, {
                        title: '회원가입 에러',
                        errorMessage: '회원가입을 처리하는 도중 에러가 발생했습니다.',
                    })
                );
            }
        }
    });
};

/*********************************************************** */
/************************* 로그인 기능 ************************/
/*********************************************************** */
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
    console.log('body: ', body);
    let userId, userPwd, userName;
    let str1;
    let handleLoginErrorStream = '';

    handleLoginErrorStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    handleLoginErrorStream += fs.readFileSync(__dirname + '/../views/error.ejs', 'utf8');
    //handleLoginErrorStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

    if (body.userId == '' || body.userPwd == '') {
        res.status(562).end(
            ejs.render(handleLoginErrorStream, {
                title: '로그인 에러',
                errorMessage: '공백을 모두 채워주세요.',
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
                        errorMessage: '로그인을 처리하는 도중 에러가 발생했습니다.',
                    })
                );
                console.log(error);
            } else {
                if (results.length <= 0) {
                    // select 조회결과가 없는 경우 (즉, 등록계정이 없는 경우)
                    res.status(562).end(
                        ejs.render(handleLoginErrorStream, {
                            title: '로그인 에러',
                            errorMessage: '아이디 또는 비밀번호가 일치하지 않습니다.',
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

                        console.log('로그인 성공 ID/암호 : %s/%s', userId, userPwd);

                        // 로그인이 성공한 경우
                        if (body.userId == userId && body.userPwd == userPwd) {
                            req.session.auth = 99; // 임의로 수(99)로 로그인성공했다는 것을 설정함
                            req.session.userId = userId;
                            req.session.who = userName; // 인증된 사용자명 확보 (로그인후 이름출력용)
                            console.log('userName:', req.session.who);
                            if (body.userId == 'admin') {
                                // 만약, 인증된 사용자가 관리자(admin)라면 이를 표시
                                req.session.admin = true;
                            }
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
const handleLogout = (req, res) => {
    req.session.destroy(); // 세션을 제거하여 인증오작동 문제를 해결
    res.redirect('/'); // 로그아웃후 메인화면으로 재접속
};

/*********************************************************** */
/************************* 아이디 찾기 ************************/
/*********************************************************** */
/*
    아이디 찾기 페이지 출력합니다.
*/
const getFindIdPage = (req, res) => {
    let findIdStream = '';
    findIdStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    findIdStream += fs.readFileSync(__dirname + '/../views/findId.ejs', 'utf8');
    //findIdStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공
    res.end(
        ejs.render(findIdStream, {
            title: '아이디 찾기',
        })
    );
};

/*
    아이디 찾기를 처리합니다.
*/
const handleFindId = (req, res) => {
    let str1 = 'SELECT userId FROM USER WHERE userName=? AND userPhone=?';
    let body = req.body;
    let userName = body.userName;
    let userPhone = body.userPhone;

    let findIdResultStream = '';
    let errorStream = '';

    db.query(str1, [userPhone, userName], (error, results) => {
        if (error) {
            console.log(error);
            res.end('error');
        } else {
            // 입력받은 데이터가 DB에 존재하는지 판단합니다.
            if (results[0] == null) {
                errorStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
                errorStream += fs.readFileSync(__dirname + '/../views/error.ejs', 'utf8');
                //errorStream += fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');

                res.status(562).end(
                    ejs.render(errorStream, {
                        title: '에러 페이지',
                        errorMessage: '아이디 찾기를 처리하는 도중 에러가 발생했습니다.',
                    })
                );
            } else {
                findIdResultStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
                findIdResultStream += fs.readFileSync(__dirname + '/../views/findIdResult.ejs', 'utf8');
                //findIdResultStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공
                res.end(
                    ejs.render(findIdResultStream, {
                        title: '아이디 찾기 결과',
                        userId: results[0].userId,
                    })
                );
            }
        }
    });
};

/*********************************************************** */
/************************ 비밀번호 찾기 ***********************/
/*********************************************************** */
/*
    비밀번호 찾기 페이지 출력합니다.
*/
const getFindPwdPage = (req, res) => {
    let findPwdStream = '';
    findPwdStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    findPwdStream += fs.readFileSync(__dirname + '/../views/findPwd.ejs', 'utf8');
    //findPwdStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공

    res.end(
        ejs.render(findPwdStream, {
            title: '비밀번호 찾기',
        })
    );
};

/*
    비밀번호 변경 페이지를 출력합니다. 
*/
// 새로운 비밀번호를 설정하기 위해 데이터를 입력 즉시 변경 페이지로 이동합니다.
const getChangePwdPage = (req, res) => {
    console.log("비밀번호 변경 POST 요청 보냄");
    let str1 = 'SELECT * FROM USER WHERE userId=? AND userPhone=?';
    let body = req.body;
    let userId = body.userId;
    let userPhone = body.userPhone;

    let pwdChangeResultStream = '';
    let errorStream = '';

    db.query(str1, [userId, userPhone], (error, results) => {
        if (error) {
            console.log(error);
            res.end('error');
        } else {
            // 입력받은 데이터가 DB에 존재하는지 판단합니다.
            if (results[0] == null) {
                errorStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
                errorStream += fs.readFileSync(__dirname + '/../views/error.ejs', 'utf8');
                //errorStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

                res.status(562).end(
                    ejs.render(errorStream, {
                        title: '에러 페이지',
                        errorMessage: '비밀번호 변경 페이지를 출력하는 도중 에러가 발생했습니다.',
                    })
                );
            } else {
                pwdChangeResultStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
                pwdChangeResultStream += fs.readFileSync(__dirname + '/../views/changePwd.ejs', 'utf8');
                //pwdChangeResultStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공

                res.end(
                    ejs.render(pwdChangeResultStream, {
                        title: '비밀번호 변경',
                        userId: userId,
                    })
                );
            }
        }
    });
};

/*
    비밀번호 변경을 처리합니다.
*/
const handleChangePwd = (req, res) => {
    console.log("비밀번호 변경 PUT 요청 보냄");
    let str1 = 'UPDATE USER SET userPwd=? WHERE userId=?';
    let body = req.body;
    let userId = body.userId;
    let userPwd = body.userPwd;

    let errorStream = '';

    console.log(body);
    db.query(str1, [userPwd, userId], (error, results) => {
        if (error) {
            console.log(error);
            errorStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
            errorStream += fs.readFileSync(__dirname + '/../views/error.ejs', 'utf8');
            //errorStream += fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');
            res.status(562).end(
                ejs.render(errorStream, {
                    title: '에러 페이지',
                    error: '비밀번호 변경을 처리하는 도중 에러가 발생했습니다.',
                })
            );
        } else {
            // 테스트 코드
            console.log(results);
            res.redirect('/users/login');
        }
    });
};

router.get('/signUp', getSignUpPage);
router.get('/login', getLoginPage);
router.get('/logout', handleLogout);
router.get('/findId', getFindIdPage);
router.get('/findPwd', getFindPwdPage);

router.post('/signUp', handleSignUp);
router.post('/login', handleLogin);
router.post('/findId', handleFindId);
router.post('/findPwd', getChangePwdPage);

router.put('/changePwd', handleChangePwd);

module.exports = router;